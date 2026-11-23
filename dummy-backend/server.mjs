import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const files = ['associates', 'auth_users', 'learnings', 'learning_assignments', 'skills', 'approval_requests'];
const immutable = value => { Object.freeze(value); for (const x of Object.values(value)) if (x && typeof x === 'object' && !Object.isFrozen(x)) immutable(x); return value; };

export async function createApiServer({ dbDirectory = new URL('./DB/', import.meta.url), clock = () => Date.now() } = {}) {
  const db = Object.fromEntries(await Promise.all(files.map(async name => [name, JSON.parse(await readFile(new URL(`${name}.db.json`, dbDirectory), 'utf8'))])));
  immutable(db);
  const secret = randomBytes(32); // Restart invalidates all demo tokens. Never stored in JSON.
  const sign = text => createHmac('sha256', secret).update(text).digest('base64url');
  const fail = (status, code, message) => Object.assign(new Error(message), { status, code });
  function issue(identity) {
    const now = Math.floor(clock() / 1000);
    const payload = { sub: identity.auth_user_id, associate_id: identity.associate_id, roles: identity.application_roles, iss: 'talent-dummy', aud: 'talent-mobile', iat: now, exp: now + 3600 };
    const body = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url') + '.' + Buffer.from(JSON.stringify(payload)).toString('base64url');
    return { access_token: body + '.' + sign(body), token_type: 'Bearer', expires_in: 3600, identity };
  }
  function authenticate(req) {
    const match = /^Bearer ([A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)$/.exec(req.headers.authorization || '');
    if (!match) throw fail(401, 'UNAUTHENTICATED', 'A valid demo Bearer token is required.');
    const [h, p, sig] = match[1].split('.');
    const expected = Buffer.from(sign(h + '.' + p)); const actual = Buffer.from(sig);
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) throw fail(401, 'INVALID_TOKEN', 'Invalid demo token.');
    let claims;
    try { claims = JSON.parse(Buffer.from(p, 'base64url').toString('utf8')); } catch { throw fail(401, 'INVALID_TOKEN', 'Invalid demo token.'); }
    if (claims.iss !== 'talent-dummy' || claims.aud !== 'talent-mobile' || !Number.isFinite(claims.exp) || claims.exp <= Math.floor(clock() / 1000)) throw fail(401, 'EXPIRED_TOKEN', 'Demo session expired.');
    const identity = db.auth_users.find(x => x.associate_id === claims.associate_id && x.auth_user_id === claims.sub);
    if (!identity || !db.associates.find(x => x.associate_id === identity.associate_id)?.is_active) throw fail(401, 'INACTIVE_ACCOUNT', 'Account unavailable.');
    return identity;
  }
  function scope(identity, id) {
    return identity.application_roles.includes('admin') || identity.associate_id === id || (identity.application_roles.includes('manager') && db.associates.some(p => p.associate_id === id && p.associate_manager === identity.associate_id));
  }
  function associate(identity, id) {
    if (!scope(identity, id)) throw fail(403, 'FORBIDDEN', 'Outside your permitted associate scope.');
    const p = db.associates.find(x => x.associate_id === id);
    if (!p) throw fail(404, 'NOT_FOUND', 'Associate not found.');
    return p;
  }
  function list(items, url, { searchFields = [] } = {}) {
    const rawLimit = url.searchParams.get('limit') ?? '20'; const rawOffset = url.searchParams.get('offset') ?? '0';
    if (!/^\d+$/.test(rawLimit) || !/^\d+$/.test(rawOffset)) throw fail(400, 'INVALID_PAGINATION', 'limit and offset must be integers.');
    const limit = Number(rawLimit), offset = Number(rawOffset);
    if (!Number.isSafeInteger(offset) || limit < 1 || limit > 100) throw fail(400, 'INVALID_PAGINATION', 'limit must be 1–100; offset must be a nonnegative safe integer.');
    const q = (url.searchParams.get('q') || '').trim().toLowerCase();
    const filtered = q ? items.filter(item => searchFields.some(key => String(item[key] ?? '').toLowerCase().includes(q))) : items;
    return { items: filtered.slice(offset, offset + limit), total: filtered.length, limit, offset, next_offset: offset + limit < filtered.length ? offset + limit : null };
  }
  async function body(req) {
    if ((req.headers['content-type'] || '').toLowerCase().split(';')[0].trim() !== 'application/json') throw fail(415, 'UNSUPPORTED_MEDIA_TYPE', 'Use Content-Type: application/json.');
    const chunks = []; let bytes = 0;
    for await (const chunk of req) { bytes += chunk.length; if (bytes > 16384) throw fail(413, 'PAYLOAD_TOO_LARGE', 'Maximum JSON body is 16 KiB.'); chunks.push(chunk); }
    const text = Buffer.concat(chunks).toString('utf8');
    try { const value = JSON.parse(text); if (!value || typeof value !== 'object' || Array.isArray(value)) throw Error(); return value; } catch { throw fail(400, 'INVALID_JSON', 'A JSON object is required.'); }
  }
  return http.createServer(async (req, res) => {
    const requestId = randomBytes(8).toString('hex');
    const reply = (status, value, headers = {}) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'X-Request-Id': requestId, ...headers }); res.end(JSON.stringify(value)); };
    try {
      const url = new URL(req.url, 'http://localhost'); const route = url.pathname;
      if (route === '/health' && req.method === 'GET') return reply(200, { status: 'ok', mode: 'read-only', counts: Object.fromEntries(files.map(f => [f, db[f].length])) });
      if (route === '/config.json' && req.method === 'GET') {
        const config = JSON.parse(await readFile(new URL('../solution-design/runtime-config.example.json', import.meta.url), 'utf8'));
        return reply(200, { ...config, issuedAt: new Date(clock()).toISOString(), expiresAt: new Date(clock() + 86400000).toISOString() });
      }
      if (route === '/v1/auth/demo' && req.method === 'POST') {
        const input = await body(req);
        if (typeof input.email !== 'string' || typeof input.associate_id !== 'string' || !/^\d{6,7}$/.test(input.associate_id)) throw fail(422, 'VALIDATION_ERROR', 'Provide email and a 6–7-digit string associate_id.');
        const p = db.associates.find(p => p.is_active && p.associate_id === input.associate_id && p.associate_email.toLowerCase() === input.email.trim().toLowerCase());
        if (!p) throw fail(401, 'IDENTITY_MISMATCH', 'Email and associate ID do not match.');
        return reply(200, issue(db.auth_users.find(a => a.associate_id === p.associate_id)));
      }
      if (!route.startsWith('/v1/')) throw fail(404, 'NOT_FOUND', 'Route not found.');
      const identity = authenticate(req);
      if (!['GET', 'HEAD'].includes(req.method)) return reply(405, { error: { code: 'READ_ONLY', message: 'Domain writes are not implemented. Use app-session mock state.', request_id: requestId } }, { Allow: 'GET' });
      if (req.method === 'HEAD') return reply(405, { error: { code: 'METHOD_NOT_ALLOWED', message: 'Use GET.', request_id: requestId } }, { Allow: 'GET' });
      if (route === '/v1/me') return reply(200, identity);
      if (route === '/v1/me/profile') return reply(200, associate(identity, identity.associate_id));
      if (route === '/v1/me/skills') return reply(200, list(associate(identity, identity.associate_id).skills, url, { searchFields: ['title', 'description'] }));
      if (route === '/v1/me/assignments') return reply(200, list(db.learning_assignments.filter(a => a.associate_id === identity.associate_id), url, { searchFields: ['subject', 'learning_code'] }));
      if (route === '/v1/learnings') return reply(200, list(db.learnings, url, { searchFields: ['subject', 'learning_code'] }));
      if (route === '/v1/skills') return reply(200, list(db.skills, url, { searchFields: ['title', 'skill_code'] }));
      if (route === '/v1/associates') return reply(200, list(db.associates.filter(p => scope(identity, p.associate_id)), url, { searchFields: ['associate_name', 'associate_id'] }));
      if (route === '/v1/team') {
        if (!identity.application_roles.includes('manager')) throw fail(403, 'FORBIDDEN', 'Manager role required.');
        return reply(200, list(db.associates.filter(p => p.associate_manager === identity.associate_id), url, { searchFields: ['associate_name', 'associate_id'] }));
      }
      if (route === '/v1/approvals') {
        const roles = identity.application_roles;
        const visible = db.approval_requests.filter(r => roles.includes('admin') || r.associate_id === identity.associate_id || (roles.includes('manager') && r.reviewer_id === identity.associate_id));
        const status = url.searchParams.get('status');
        if (status && !['pending', 'approved', 'rejected'].includes(status)) throw fail(400, 'INVALID_STATUS', 'Invalid approval status.');
        return reply(200, list(status ? visible.filter(r => r.status === status) : visible, url));
      }
      if (route === '/v1/admin/users') {
        if (!identity.application_roles.includes('admin')) throw fail(403, 'FORBIDDEN', 'Admin role required.');
        return reply(200, list(db.associates.map(p => ({ ...db.auth_users.find(a => a.associate_id === p.associate_id), associate_name: p.associate_name, associate_email: p.associate_email })), url, { searchFields: ['associate_name', 'associate_id'] }));
      }
      let match;
      if ((match = /^\/v1\/associates\/(\d{6,7})(?:\/(profile|skills|assignments))?$/.exec(route))) {
        const p = associate(identity, match[1]);
        if (match[2] === 'skills') return reply(200, list(p.skills, url, { searchFields: ['title', 'description'] }));
        if (match[2] === 'assignments') return reply(200, list(db.learning_assignments.filter(a => a.associate_id === p.associate_id), url, { searchFields: ['subject', 'learning_code'] }));
        return reply(200, p);
      }
      if ((match = /^\/v1\/learnings\/([^/]+)$/.exec(route))) {
        const item = db.learnings.find(l => l.learning_code === decodeURIComponent(match[1]));
        if (!item) throw fail(404, 'NOT_FOUND', 'Learning not found.');
        return reply(200, item);
      }
      if ((match = /^\/v1\/assignments\/([^/]+)$/.exec(route))) {
        const item = db.learning_assignments.find(l => l.learning_assignment_id === decodeURIComponent(match[1]));
        if (!item) throw fail(404, 'NOT_FOUND', 'Assignment not found.');
        associate(identity, item.associate_id); return reply(200, item);
      }
      if ((match = /^\/v1\/approvals\/([^/]+)$/.exec(route))) {
        const item = db.approval_requests.find(r => r.approval_request_id === decodeURIComponent(match[1]));
        if (!item) throw fail(404, 'NOT_FOUND', 'Approval not found.');
        if (!identity.application_roles.includes('admin') && item.associate_id !== identity.associate_id && !(identity.application_roles.includes('manager') && item.reviewer_id === identity.associate_id)) throw fail(403, 'FORBIDDEN', 'Approval outside permitted scope.');
        return reply(200, item);
      }
      throw fail(404, 'NOT_FOUND', 'Route not found.');
    } catch (error) {
      reply(error.status || 500, { error: { code: error.code && error.status ? error.code : 'INTERNAL_ERROR', message: error.status ? error.message : 'Unexpected server error.', request_id: requestId } });
    }
  });
}

if (typeof process !== 'undefined' && process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 3001);
  const host = process.env.HOST || '127.0.0.1';
  const server = await createApiServer();
  server.listen(port, host, () => console.log(`Read-only dummy API: http://${host}:${port}/v1`));
}

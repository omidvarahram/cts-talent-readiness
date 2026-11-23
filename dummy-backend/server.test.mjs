import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createApiServer } from './server.mjs';

async function call(port, route, { token, method = 'GET', body, raw } = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: '127.0.0.1', port, path: route, method, headers: { ...(token ? { Authorization: 'Bearer ' + token } : {}), ...(body || raw ? { 'Content-Type': 'application/json' } : {}) } }, res => {
      let text = ''; res.on('data', x => text += x); res.on('end', () => { try { resolve({ status: res.statusCode, data: JSON.parse(text) }); } catch (e) { reject(e); } });
    });
    req.on('error', reject); req.end(raw ?? (body ? JSON.stringify(body) : undefined));
  });
}

function conforms(value, schema, spec) {
  if (schema.$ref) return conforms(value, spec.components.schemas[schema.$ref.split('/').at(-1)], spec);
  if (value === null && schema.nullable) return true;
  if (schema.allOf) return schema.allOf.every(s => conforms(value, s, spec));
  if (schema.oneOf) return schema.oneOf.filter(s => conforms(value, s, spec)).length === 1;
  if (schema.enum && !schema.enum.includes(value)) return false;
  if (schema.type === 'object') return value !== null && typeof value === 'object' && !Array.isArray(value) && (schema.required || []).every(k => Object.hasOwn(value, k)) && Object.entries(schema.properties || {}).every(([k, s]) => !Object.hasOwn(value, k) || conforms(value[k], s, spec));
  if (schema.type === 'array') return Array.isArray(value) && value.every(x => conforms(x, schema.items, spec));
  if (schema.type === 'integer') return Number.isInteger(value);
  return !schema.type || typeof value === schema.type;
}

export let testResult = 'running';
export const integrationTest = test('read-only API integration: roles, contracts, expiry and immutable seeds', async () => {
  let now = Date.now();
  const server = await createApiServer({ clock: () => now });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const seedNames = ['associates', 'auth_users', 'learnings', 'skills', 'learning_assignments', 'approval_requests'];
  const hashes = async () => Promise.all(seedNames.map(async n => createHash('sha256').update(await readFile(new URL(`./DB/${n}.db.json`, import.meta.url))).digest('hex')));
  const before = await hashes();
  try {
    assert.equal((await call(port, '/health')).data.counts.associates, 40);
    assert.equal((await call(port, '/config.json')).data.schemaVersion, 1);
    assert.equal((await call(port, '/v1/me')).status, 401);
    assert.equal((await call(port, '/v1/auth/demo', { method: 'POST', raw: '{bad' })).status, 400);
    assert.equal((await call(port, '/v1/auth/demo', { method: 'POST', body: { email: 'wrong@example.com', associate_id: '6100001' } })).status, 401);
    async function login(email, id) { const r = await call(port, '/v1/auth/demo', { method: 'POST', body: { email, associate_id: id } }); assert.equal(r.status, 200); return r.data.access_token; }
    const admin = await login('alex.morgan@example.com', '6100001');
    const manager = await login('sophie.taylor@example.com', '6100004');
    const associate = await login('noah.williams@example.com', '6100009');
    const routes = ['/v1/me', '/v1/me/profile', '/v1/me/skills', '/v1/me/assignments', '/v1/learnings', '/v1/learnings/LRN-001', '/v1/skills', '/v1/associates', '/v1/associates/6100009', '/v1/associates/6100009/profile', '/v1/associates/6100009/skills', '/v1/associates/6100009/assignments', '/v1/assignments/LA-0001', '/v1/approvals', '/v1/approvals/APR-6100003-01', '/v1/admin/users', '/v1/team'];
    const spec = JSON.parse(await readFile(new URL('./openapi.json', import.meta.url), 'utf8'));
    for (const route of routes) {
      const response = await call(port, route, { token: admin });
      assert.equal(response.status, 200, route);
      const documentedPath = Object.keys(spec.paths).find(p => new RegExp('^' + p.replace(/\{[^}]+\}/g, '[^/]+') + '$').test(route));
      assert.ok(documentedPath, `Documented route: ${route}`);
      assert.ok(conforms(response.data, spec.paths[documentedPath].get.responses[200].content['application/json'].schema, spec), `Response contract: ${route}`);
    }
    assert.equal((await call(port, '/v1/associates', { token: associate })).data.total, 1);
    assert.equal((await call(port, '/v1/associates/6100009', { token: manager })).status, 200);
    assert.equal((await call(port, '/v1/associates/6100010', { token: manager })).status, 403);
    assert.equal((await call(port, '/v1/admin/users', { token: manager })).status, 403);
    assert.equal((await call(port, '/v1/team', { token: associate })).status, 403);
    assert.equal((await call(port, '/v1/me', { token: admin.slice(0, -2) + 'xx' })).status, 401);
    const page = await call(port, '/v1/learnings?limit=3&offset=3', { token: admin }); assert.equal(page.data.items.length, 3); assert.equal(page.data.next_offset, 6);
    assert.equal((await call(port, '/v1/skills?q=aws', { token: associate })).data.total, 1);
    assert.equal((await call(port, '/v1/learnings?limit=0', { token: admin })).status, 400);
    assert.equal((await call(port, '/v1/approvals?status=bad', { token: admin })).status, 400);
    assert.equal((await call(port, '/v1/learnings/unknown', { token: admin })).status, 404);
    assert.equal((await call(port, '/v1/me/profile', { token: admin, method: 'PATCH', body: { associate_name: 'Changed' } })).status, 405);
    assert.equal((await call(port, '/v1/auth/logout', { token: admin, method: 'POST', body: {} })).status, 405);
    now += 3601000;
    assert.equal((await call(port, '/v1/me', { token: admin })).status, 401);
    assert.deepEqual(await hashes(), before);
    testResult = 'passed';
  } finally { await new Promise(resolve => server.close(resolve)); }
});

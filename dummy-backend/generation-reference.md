# Fixture generation reference

Original deterministic generation source preserved for reference. It originally wrote to a sibling `DB` folder; if reused, set ROOT explicitly to this document’s sibling `DB` directory. Existing fixtures are authoritative.

```python
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent / 'DB'
ROOT.mkdir(exist_ok=True)
NOW = '2026-11-20T00:00:00Z'
names = ['Alex Morgan','Priya Sharma','Daniel Chen','Sophie Taylor','Omar Hassan','Grace Wilson','Liam Nguyen','Amelia Patel','Noah Williams','Isla Thompson','Ethan Lee','Mia Robinson','Lucas Martin','Ava Singh','Oliver Brown','Chloe Anderson','Jack Thomas','Zoe Harris','Henry Walker','Layla Ahmed','Leo White','Ruby Clark','Arjun Mehta','Emily Lewis','Oscar Young','Hannah Scott','Adam Ibrahim','Ella Green','Max King','Sarah Kim','James Wright','Nina Silva','Benjamin Hall','Freya Adams','Ryan Cooper','Aisha Khan','Samuel Mitchell','Lily Roberts','Dylan Evans','Mei Tan']
ids = [str(6100001+i) for i in range(40)]
catalog = [
 ('LRN-001','Engineering Foundations','foundation',['associate'],['TypeScript','Git'],False),
 ('LRN-002','Automated Testing Essentials','foundation',['associate','senior_associate'],['Testing','TypeScript'],False),
 ('LRN-003','React Application Engineering','intermediate',['associate','senior_associate'],['React','TypeScript'],False),
 ('LRN-004','Backend APIs and Data Modelling','intermediate',['associate','senior_associate'],['Node.js','SQL'],False),
 ('LRN-005','Cloud Architecture Fundamentals','intermediate',['senior_associate','lead_engineer','technology_architect'],['AWS','Architecture'],True),
 ('LRN-006','Distributed Systems and Event Driven Design','advanced',['lead_engineer','technology_architect'],['Distributed Systems','Architecture'],False),
 ('LRN-007','Enterprise Security Architecture','advanced',['lead_engineer','technology_architect'],['Security','Architecture'],True),
 ('LRN-008','Technical Leadership and Mentoring','advanced',['lead_engineer','technology_architect','delivery_lead'],['Leadership','Mentoring'],False),
 ('LRN-009','Delivery Planning and Risk Management','leadership',['delivery_lead','manager_projects'],['Delivery Management','Risk Management'],True),
 ('LRN-010','People Management and Coaching','leadership',['delivery_lead','manager_projects'],['People Management','Coaching'],False),
]
learnings = [dict(learning_code=c,subject=s,seniority_level=l,target_associate_roles=r,skills=sk,description=f'Practical learning and assessment covering {s.lower()}.',estimated_hours=8+i*2,certificate_required=cert,is_active=True) for i,(c,s,l,r,sk,cert) in enumerate(catalog)]
associates=[]
identities=[]
assignments=[]
for i,(aid,name) in enumerate(zip(ids,names)):
    if i==0: roles=['admin','manager','associate']; job='technology_architect'
    elif i in (1,2): roles=['admin','associate']; job='senior_associate' if i==1 else 'lead_engineer'
    elif i<8: roles=['manager'] if i in (5,7) else ['manager','associate']; job='delivery_lead' if i in (3,4) else 'manager_projects'
    else: roles=['associate']; job=['associate','senior_associate','lead_engineer','technology_architect'][(i-8)%4]
    bench = i not in (1,5,6,7)
    manager = None if i==0 else ids[0] if i<8 else ids[3+(i-8)%5]
    email=name.lower().replace(' ','.')+'@example.com'
    a=dict(associate_id=aid,auth_user_id=f'dummy-user-{aid}',associate_name=name,associate_email=email,associate_group=['ssd','fsd','pmp'][i%3],associate_role=job,date_join=f'{2016+i%10}-{1+i%12:02d}-10',associate_manager=manager,associate_direct_reports=[],location=['AUS/MEL','AUS/SYD','AUS/BRIS'][i%3],skills=sorted(set(skill for l in learnings if job in l['target_associate_roles'] for skill in l['skills'])),associate_status=dict(status='on_bench',unassigned_start_date=f'2026-{9+i%2:02d}-01') if bench else dict(status='assigned',assignment_code=f'CLIENT-{i+1:03d}',start_date='2026-08-01',end_date='2027-06-30',assignment_role=job.replace('_',' '),billing_code=f'BILL-{i+1:03d}'),learning_assignments=[],is_active=True,date_leave=None,created_at=NOW,updated_at=NOW)
    identities.append(dict(auth_user_id=a['auth_user_id'],associate_id=aid,application_roles=roles))
    associates.append(a)
    if bench:
        relevant=[l for l in learnings if job in l['target_associate_roles']]
        for j,l in enumerate(relevant):
            pct=[0,25,50,75,100][(i+j)%5]
            status='not_started' if pct==0 else 'completed' if pct==100 else 'in_progress'
            assignment_id=f'LA-{len(assignments)+1:04d}'
            assignments.append(dict(learning_assignment_id=assignment_id,associate_id=aid,learning_code=l['learning_code'],subject=l['subject'],date_assigned='2026-11-02',date_due='2026-12-18',status=status,status_percentage=pct,description=l['description'],certificate_required=l['certificate_required'],certificate=f'https://example.com/certificates/{assignment_id}.pdf' if pct==100 and l['certificate_required'] else None,assigned_by=ids[0] if manager is None else manager,date_completed='2026-11-18' if pct==100 else None))
            a['learning_assignments'].append(assignment_id)
for a in associates:
    a['associate_direct_reports']=[b['associate_id'] for b in associates if b['associate_manager']==a['associate_id']]

# Validate counts, referential integrity, role scenarios and progress before writing.
assert len(associates)==40 and len(set(ids))==40
assert len({a['associate_email'] for a in associates})==40
assert len(learnings)==10 and len({l['learning_code'] for l in learnings})==10
assert sum('admin' in u['application_roles'] for u in identities)==3
assert sum('manager' in identities[i]['application_roles'] for i in range(3,8))==5
assert sum(associates[i]['associate_status']['status']=='on_bench' for i in range(3,8))==2
assert all(identities[i]['application_roles']==['associate'] and associates[i]['associate_status']['status']=='on_bench' and associates[i]['learning_assignments'] for i in range(8,40))
assert not associates[1]['learning_assignments']
assert len({x['learning_assignment_id'] for x in assignments})==len(assignments)
assert {x['learning_code'] for x in assignments}=={l['learning_code'] for l in learnings}
by_id={a['associate_id']:a for a in associates}
by_learning={l['learning_code']:l for l in learnings}
for a in associates:
    assert a['associate_id'].isdigit() and len(a['associate_id']) in (6,7)
    seen=set(); current=a
    while current['associate_manager'] is not None:
        assert current['associate_id'] not in seen
        seen.add(current['associate_id']); current=by_id[current['associate_manager']]
    assert a['associate_direct_reports']==[b['associate_id'] for b in associates if b['associate_manager']==a['associate_id']]
    if a['associate_direct_reports']: assert 'manager' in identities[ids.index(a['associate_id'])]['application_roles']
for x in assignments:
    assert x['assigned_by'] in ids
    assert x['learning_assignment_id'] in by_id[x['associate_id']]['learning_assignments']
    assert by_id[x['associate_id']]['associate_role'] in by_learning[x['learning_code']]['target_associate_roles']
    assert (x['status']=='completed')==(x['status_percentage']==100)
    assert (x['status']=='not_started')==(x['status_percentage']==0)
    assert not (x['status']=='completed' and x['certificate_required']) or x['certificate']
for filename,data in [('associates.db.json',associates),('learnings.db.json',learnings),('learning_assignments.db.json',assignments),('auth_users.db.json',identities)]:
    path=ROOT/filename
    if path.exists(): raise FileExistsError(path)
    path.write_text(json.dumps(data,indent=2)+'\n',encoding='utf-8')
    assert json.loads(path.read_text(encoding='utf-8'))==data
print(json.dumps(dict(associates=len(associates),admins=3,additional_managers=5,manager_role_total=6,associate_only=32,on_bench=sum(a['associate_status']['status']=='on_bench' for a in associates),learnings=len(learnings),learning_assignments=len(assignments),progress_values=sorted({x['status_percentage'] for x in assignments}),validation='passed'),indent=2))

```

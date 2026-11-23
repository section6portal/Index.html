let currentRole = 'ANHPHAT';
let records = JSON.parse(localStorage.getItem('nsrp_records')) || DEFAULT_DATA;

const save = () => { localStorage.setItem('nsrp_records', JSON.stringify(records)); renderList(); };
const resetDemo = () => { localStorage.removeItem('nsrp_records'); records = JSON.parse(JSON.stringify(DEFAULT_DATA)); renderList(); showToast('Reset OK!'); };
const closeModals = () => document.querySelectorAll('.modal').forEach(m => m.classList.remove('open'));

function showToast(msg) {
  const t = document.getElementById('toast');
  t.innerText = msg; t.style.display = 'block';
  setTimeout(() => t.style.display = 'none', 2500);
}

function copyText(txt) {
  navigator.clipboard.writeText(txt);
  showToast('Copied: ' + txt);
}

function setRole(role) {
  currentRole = role;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  document.getElementById('role-' + role).classList.add('active');
  renderList();
}

function getBadge(st) {
  if (st === '3_ON_HOLD_ISSUE') return 'b-issue';
  if (st === '5_CHECKED_OK_PENDING_PAYMENT') return 'b-ok';
  if (st === '4_FIXED_RECHECKING') return 'b-fix';
  return 'b-default';
}

function getEmailGuide(r) {
  if (r.status === '5_CHECKED_OK_PENDING_PAYMENT') {
    return `<div class="guide-box" style="color:#107C10;"><b>✓ Completed:</b> Checked OK.</div>`;
  }
  const upd = `NSRP | ${r.contractor} | ${r.invoice} | UPDATE`;
  let fix = '';
  if (r.issueCount > 0 && r.status === '3_ON_HOLD_ISSUE') {
    const cmd = `NSRP | ${r.contractor} | ${r.invoice} | FIX-${r.issueCount}`;
    fix = `<div style="margin-top:6px;color:#A80000;">Fix Issue #${r.issueCount}:</div>
           <div class="copy-row"><span class="code-txt">${cmd}</span><button class="btn-copy" onclick="event.stopPropagation();copyText('${cmd}')">Copy</button></div>`;
  }
  return `<div class="guide-box"><b>📋 Next Action (No Re:/Fwd:):</b>${fix}
          <div class="copy-row"><span class="code-txt">${upd}</span><button class="btn-copy" onclick="event.stopPropagation();copyText('${upd}')">Copy</button></div></div>`;
}

function renderList() {
  const listEl = document.getElementById('main-list');
  const visible = currentRole === 'STAFF' ? records : records.filter(r => r.contractor === currentRole);
  if (!visible.length) {
    listEl.innerHTML = `<div class="card" style="text-align:center;">No records for ${currentRole}.</div>`;
    return;
  }
  listEl.innerHTML = visible.map(r => `
    <div class="card" onclick="openDetail('${r.recordId}')">
      <div class="card-header">
        <div class="record-id">${r.recordId}</div>
        <span class="badge ${getBadge(r.status)}">${r.status}</span>
      </div>
      <div class="meta-row">Issues: <b>${r.issueCount}</b></div>
      ${r.expectedDate ? `<div class="meta-row" style="color:#107C10;">Payment: <b>${r.expectedDate}</b> (${r.maxDays}d)</div>` : ''}
      ${r.remark ? `<div class="meta-row">Remark: <i>${r.remark}</i></div>` : ''}
      ${getEmailGuide(r)}
    </div>`).join('');
}

function openEmailModal() {
  document.getElementById('email-error').style.display = 'none';
  document.getElementById('email-subject').value = `NSRP | ${currentRole === 'STAFF' ? 'ANHPHAT' : currentRole} | INV016 | SUBMIT`;
  document.getElementById('email-modal').classList.add('open');
}

function sendSimulatedEmail() {
  const subj = document.getElementById('email-subject').value.trim();
  const body = document.getElementById('email-body').value.trim() || 'Attached files.';
  const err = document.getElementById('email-error');

  if (/^(re:|fwd:|fw:)/i.test(subj) || !subj.toUpperCase().startsWith('NSRP') || subj.split('|').length !== 4) {
    err.style.display = 'block';
    err.innerHTML = `<b>[BLOCKED]</b> No Re:/Fwd:. Use: <code>NSRP | [CODE] | [INV] | [ACTION]</code>`;
    return;
  }

  const [, contractor, invoice, action] = subj.split('|').map(s => s.trim().toUpperCase());
  const recordId = `NSRP-${contractor}-${invoice}`;
  const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
  let item = records.find(r => r.recordId === recordId);

  if (action === 'SUBMIT') {
    if (item) { err.style.display = 'block'; err.innerText = 'Already exists!'; return; }
    records.unshift({ recordId, contractor, invoice, status: '1_SUBMITTED', issueCount: 0, maxDays: 0, expectedDate: '', remark: '', history: [{ title: 'SUBMIT', type: 'SUBMIT', time: now, desc: body }] });
  } else if (action === 'UPDATE' && item) {
    item.history.push({ title: 'UPDATE', type: 'UPDATE', time: now, desc: body });
  } else if (action.startsWith('FIX-') && item) {
    item.status = '4_FIXED_RECHECKING';
    item.history.push({ title: action, type: 'FIX', time: now, desc: body });
  } else {
    err.style.display = 'block'; err.innerText = 'Invalid ACTION or Record ID!'; return;
  }
  save(); closeModals(); showToast('Email processed!');
}

function openDetail(id) {
  const r = records.find(x => x.recordId === id);
  const staffUI = currentRole === 'STAFF' ? `
    <div style="border-top:2px solid #E5E7EB;margin-top:12px;padding-top:10px;">
      <h4>🏢 NSRP Staff Actions</h4>
      <textarea id="issue-in" rows="2" placeholder="Issue details..."></textarea>
      <button class="btn btn-danger" onclick="raiseIssue('${r.recordId}')">Send ISSUE #${r.issueCount + 1}</button>
      <input type="number" id="sla-in" value="10" min="0" style="margin-top:10px;" />
      <input type="text" id="rem-in" placeholder="Payment Remark..." style="margin-top:6px;" />
      <button class="btn btn-success" onclick="approveOK('${r.recordId}')">Confirm Check OK</button>
    </div>` : '';

  document.getElementById('detail-content').innerHTML = `
    <div class="sheet-header"><h3>${r.recordId}</h3><span class="material-icons close-btn" onclick="closeModals()">close</span></div>
    ${getEmailGuide(r)}
    <div class="timeline">${r.history.map(h => `
      <div class="tl-item">
        <div class="tl-dot" style="background:${h.type === 'ISSUE' ? '#DC2626' : '#005A9E'}"></div>
        <div class="tl-title">${h.title} <span class="tl-time">(${h.time})</span></div>
        <div class="tl-desc">${h.desc}</div>
      </div>`).join('')}
    </div>${staffUI}`;
  document.getElementById('detail-modal').classList.add('open');
}

function raiseIssue(id) {
  const txt = document.getElementById('issue-in').value.trim();
  if (!txt) return;
  const r = records.find(x => x.recordId === id);
  r.issueCount++; r.status = '3_ON_HOLD_ISSUE';
  r.history.push({ title: `ISSUE #${r.issueCount}`, type: 'ISSUE', time: new Date().toISOString().slice(0, 16).replace('T', ' '), desc: txt });
  save(); closeModals(); showToast(`ISSUE #${r.issueCount} sent!`);
}

function approveOK(id) {
  const days = parseInt(document.getElementById('sla-in').value || '0', 10);
  const rem = document.getElementById('rem-in').value.trim() || 'Approved.';
  const r = records.find(x => x.recordId === id);
  r.maxDays = days; r.expectedDate = addVNWorkingDays(new Date(), days); r.remark = rem;
  r.status = '5_CHECKED_OK_PENDING_PAYMENT';
  r.history.push({ title: 'CHECKED-OK', type: 'CHECKED_OK', time: new Date().toISOString().slice(0, 16).replace('T', ' '), desc: `Pay: ${r.expectedDate} | ${rem}` });
  save(); closeModals(); showToast('Checked OK!');
}

renderList();

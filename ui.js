let currentRole = 'ANHPHAT';
let records = [];
try {
  records = JSON.parse(localStorage.getItem('nsrp_records')) || DEFAULT_DATA;
} catch (e) {
  records = DEFAULT_DATA;
}

const save = () => { localStorage.setItem('nsrp_records', JSON.stringify(records)); renderList(); };
const closeModals = () => document.querySelectorAll('.modal').forEach(m => m.classList.remove('open'));
const resetDemo = () => { localStorage.clear(); location.reload(); };

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.innerText = msg; t.style.display = 'block';
  setTimeout(() => t.style.display = 'none', 2800);
}

function copyText(txt) {
  navigator.clipboard.writeText(txt);
  showToast('Copied: ' + txt);
}

function setRole(role) {
  currentRole = role;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  const activeChip = document.getElementById('role-' + role);
  if (activeChip) activeChip.classList.add('active');
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
  listEl.innerHTML = visible.length ? visible.map(r => `
    <div class="card" onclick="openDetail('${r.recordId}')">
      <div class="card-header"><div class="record-id">${r.recordId}</div><span class="badge ${getBadge(r.status)}">${r.status}</span></div>
      <div class="meta-row">Issues: <b>${r.issueCount}</b></div>
      ${r.expectedDate ? `<div class="meta-row" style="color:#107C10;">Payment: <b>${r.expectedDate}</b> (${r.maxDays}d)</div>` : ''}
      ${r.remark ? `<div class="meta-row">Remark: <i>${r.remark}</i></div>` : ''}
      ${getEmailGuide(r)}
    </div>`).join('') : `<div class="card" style="text-align:center;">No records for ${currentRole}.</div>`;
  if (typeof updateMailBadge === 'function') updateMailBadge();
}

function openInboxModal() {
  const mails = (typeof inboxEmails !== 'undefined' && Array.isArray(inboxEmails)) ? inboxEmails : [];
  mails.forEach(e => e.unread = false);
  localStorage.setItem('nsrp_emails', JSON.stringify(mails));
  if (typeof updateMailBadge === 'function') updateMailBadge();

  const content = document.getElementById('inbox-content');
  content.innerHTML = `
    <div class="sheet-header"><h3>📥 Auto-Emails (${mails.length})</h3><span class="material-icons close-btn" onclick="closeModals()">close</span></div>
    <p class="sub-info">From: <b>payment.portal@nsrp.com.vn</b></p>
    ${mails.length ? mails.map(e => `
      <div style="border:1px solid #D1D5DB;border-radius:8px;padding:10px;margin:8px 0;background:#FAFAFA;">
        <div style="font-size:11px;color:#6B7280;">To: <b>${e.to}</b> • ${e.time}</div>
        <div style="font-weight:700;color:#005A9E;font-size:13px;margin:4px 0;">${e.subject}</div>
        <div style="font-size:12px;border-top:1px dashed #E5E7EB;padding-top:6px;">${e.html}</div>
      </div>`).join('') : '<p style="text-align:center;color:#6B7280;">No emails yet.</p>'}`;
  document.getElementById('inbox-modal').classList.add('open');
}

let inboxEmails = JSON.parse(localStorage.getItem('nsrp_emails')) || [
  {
    id: 1,
    to: 'accounting@anhphat.vn',
    from: 'payment.portal@nsrp.com.vn',
    subject: '[NSRP PORTAL] Action Required - ISSUE #1 for NSRP-ANHPHAT-INV015',
    time: '2026-11-21 14:30',
    unread: true,
    html: `<p>Dear <b>ANHPHAT</b>,</p>
           <p>Your submission <b>NSRP-ANHPHAT-INV015</b> is <b>ON HOLD</b> due to <b>ISSUE #1</b>:</p>
           <div style="background:#FDE7E9;padding:8px;border-left:3px solid #A80000;margin:8px 0;">Missing site supervisor signature on page 4.</div>
           <p>To submit fix, compose a <b>NEW EMAIL</b> with exact subject:<br>
           <code>NSRP | ANHPHAT | INV015 | FIX-1</code></p>`
  }
];

function pushAutoEmail(to, subject, htmlBody) {
  const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
  inboxEmails.unshift({
    id: Date.now(),
    to,
    from: 'payment.portal@nsrp.com.vn',
    subject,
    time: now,
    unread: true,
    html: htmlBody
  });
  localStorage.setItem('nsrp_emails', JSON.stringify(inboxEmails));
  updateMailBadge();
}

function updateMailBadge() {
  const count = inboxEmails.filter(e => e.unread).length;
  const badge = document.getElementById('mail-badge');
  if (badge) {
    badge.innerText = count;
    badge.style.display = count > 0 ? 'inline-block' : 'none';
  }
}

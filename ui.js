<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <meta name="theme-color" content="#005A9E" />
  <title>NSRP Payment Portal</title>
  <link href="https://googleapis.com" rel="stylesheet">
  <link href="https://googleapis.com" rel="stylesheet">
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="app-bar">
    <div class="app-title">🏛️ NSRP Portal</div>
    <div style="display:flex; gap:6px; align-items:center;">
      <div class="role-badge" style="background:#107C10;" onclick="openEmailModal()">
        ✉️ Send Mail
      </div>
      <div class="role-badge" onclick="openInboxModal()">
        📥 Inbox <span id="mail-badge" style="background:#DC2626;color:#fff;border-radius:10px;padding:1px 6px;font-size:11px;">1</span>
      </div>
      <div class="role-badge" onclick="resetDemo()">🔄</div>
    </div>
  </div>

  <div class="role-bar">
    <div class="chip active" id="role-ANHPHAT" onclick="setRole('ANHPHAT')">👷 ANHPHAT</div>
    <div class="chip" id="role-LILAMA18" onclick="setRole('LILAMA18')">👷 LILAMA18</div>
    <div class="chip" id="role-STAFF" onclick="setRole('STAFF')">🏢 NSRP Staff</div>
  </div>

  <div class="container">
    <button class="btn btn-primary" style="margin-bottom:12px;" onclick="openEmailModal()">
      ✉️ Compose & Send Email to NSRP
    </button>
    <div id="main-list"></div>
  </div>

  <!-- Modal Soạn Email -->
  <div class="modal" id="email-modal">
    <div class="modal-sheet">
      <div class="sheet-header"><h3>📤 Send Email to NSRP</h3><span class="close-btn" style="font-size:20px;font-weight:bold;" onclick="closeModals()">✕</span></div>
      <p class="sub-info">To: <b>payment.portal@nsrp.com.vn</b></p>
      <label>Email Subject (4-Part Format):</label>
      <input type="text" id="email-subject" />
      <div class="alert-box" id="email-error"></div>
      <label>Message / Attachment Note:</label>
      <textarea id="email-body" rows="3" placeholder="Attached documents..."></textarea>
      <button class="btn btn-primary" onclick="sendSimulatedEmail()">🚀 Send Email Now</button>
    </div>
  </div>

  <!-- Modal Chi tiết Hồ sơ -->
  <div class="modal" id="detail-modal"><div class="modal-sheet" id="detail-content"></div></div>

  <!-- Modal Hộp thư Auto-Emails -->
  <div class="modal" id="inbox-modal"><div class="modal-sheet" id="inbox-content"></div></div>

  <div class="toast" id="toast"></div>

  <script src="data.js"></script>
  <script src="emails.js"></script>
  <script src="ui.js"></script>
  <script src="actions.js"></script>
</body>
</html>

const VN_HOLIDAYS = ['2026-01-01', '2026-04-30', '2026-05-01', '2026-09-02'];

const DEFAULT_DATA = [
  {
    recordId: 'NSRP-ANHPHAT-INV015',
    contractor: 'ANHPHAT',
    invoice: 'INV015',
    status: '3_ON_HOLD_ISSUE',
    issueCount: 1,
    maxDays: 0,
    expectedDate: '',
    remark: '',
    history: [
      { title: 'SUBMIT', type: 'SUBMIT', time: '2026-11-20 09:15', desc: 'Submitted Invoice #015.' },
      { title: 'ISSUE #1', type: 'ISSUE', time: '2026-11-21 14:30', desc: 'Missing signature on page 4.' }
    ]
  },
  {
    recordId: 'NSRP-LILAMA18-IPC03',
    contractor: 'LILAMA18',
    invoice: 'IPC03',
    status: '5_CHECKED_OK_PENDING_PAYMENT',
    issueCount: 0,
    maxDays: 10,
    expectedDate: '2026-12-04',
    remark: 'Verified OK. Prioritized.',
    history: [
      { title: 'SUBMIT', type: 'SUBMIT', time: '2026-11-18 10:00', desc: 'Submitted IPC03 package.' },
      { title: 'CHECKED-OK', type: 'CHECKED_OK', time: '2026-11-20 16:00', desc: 'Payment Date: 2026-12-04' }
    ]
  }
];

function addVNWorkingDays(startDate, days) {
  let cur = new Date(startDate);
  let added = 0;
  while (added < days) {
    cur.setDate(cur.getDate() + 1);
    const day = cur.getDay();
    const iso = cur.toISOString().slice(0, 10);
    if (day !== 0 && day !== 6 && !VN_HOLIDAYS.includes(iso)) added++;
  }
  return cur.toISOString().slice(0, 10);
}

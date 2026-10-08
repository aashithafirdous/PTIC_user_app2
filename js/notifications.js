// ============================================================
// PTIC – notifications.js
// Notification center
// ============================================================

const Notifications = {
  render() {
    Router.showPage('page-notifications');
    const unread = PTIC_DATA.notifications.filter(n => !n.read);
    const read   = PTIC_DATA.notifications.filter(n => n.read);

    const iconMap = {
      connection_accepted: { icon: Icons.userCheck(16, '#fff'), bg: '#22A06B' },
      connection_request:  { icon: Icons.userPlus(16, '#fff'),  bg: '#1976D2' },
      new_answer:          { icon: Icons.messageCircle(16,'#fff'), bg: '#9C27B0' },
      event_reminder:      { icon: Icons.calendar(16, '#fff'),  bg: '#FF6F00' },
      enquiry_response:    { icon: Icons.mail(16, '#fff'),      bg: '#0097A7' },
      like:                { icon: Icons.thumbsUp(16, '#fff'),  bg: '#F59E0B' },
    };

    const renderItem = (n) => {
      const { icon, bg } = iconMap[n.type] || { icon: Icons.bell(16,'#fff'), bg: '#667085' };
      return `
        <div class="notification-item ${n.read ? '' : 'unread'}" onclick="Notifications.markRead('${n.id}')">
          <div class="notif-icon" style="background:${bg};">${icon}</div>
          <div class="notif-text">
            <div class="notif-title">${n.title}</div>
            <div class="notif-desc">${n.desc}</div>
            <div class="notif-time">${n.time}</div>
          </div>
          ${!n.read ? `<div style="width:8px; height:8px; background:var(--blue); border-radius:50%; flex-shrink:0; margin-top:6px;"></div>` : ''}
        </div>`;
    };

    document.getElementById('page-notifications').innerHTML = `
      <div class="page-header" style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:var(--space-3);">
        <div>
          <div class="page-title">Notifications</div>
          ${unread.length > 0 ? `<div class="page-subtitle">${unread.length} unread notification${unread.length !== 1 ? 's' : ''}</div>` : '<div class="page-subtitle">You\'re all caught up!</div>'}
        </div>
        ${unread.length > 0 ? `<button class="btn btn-outline-gray btn-sm" onclick="Notifications.markAllRead()">Mark all as read</button>` : ''}
      </div>

      ${unread.length > 0 ? `
        <div style="font-size:var(--text-xs); font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--text-secondary); margin-bottom:var(--space-3);">New</div>
        ${unread.map(renderItem).join('')}
        <div class="divider"></div>` : ''}

      ${read.length > 0 ? `
        <div style="font-size:var(--text-xs); font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--text-secondary); margin-bottom:var(--space-3);">Earlier</div>
        ${read.map(renderItem).join('')}` : ''}

      ${PTIC_DATA.notifications.length === 0 ? `
        <div class="empty-state">
          <div class="empty-state-icon">${Icons.bell(28)}</div>
          <div class="empty-state-title">No notifications yet</div>
          <div class="empty-state-desc">Activity on your connections, questions and enquiries will appear here.</div>
        </div>` : ''}`;
  },

  markRead(notifId) {
    const n = PTIC_DATA.notifications.find(n => n.id === notifId);
    if (n) {
      n.read = true;
      App.updateNavBadges();
      Notifications.render();
    }
  },

  markAllRead() {
    PTIC_DATA.notifications.forEach(n => n.read = true);
    App.updateNavBadges();
    Toast.success('All notifications marked as read.');
    Notifications.render();
  },
};

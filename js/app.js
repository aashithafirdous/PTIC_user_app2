// ============================================================
// PTIC – app.js
// Application bootstrap, navigation, icons, global wiring
// ============================================================

// ── Inline SVG Icons (Lucide-style) ──────────────────────────
const Icons = {
  _svg: (content, size = 20, color = 'currentColor', extra = '') =>
    `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;" ${extra}>${content}</svg>`,

  home:          (s, c) => Icons._svg('<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>', s, c),
  users:         (s, c) => Icons._svg('<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>', s, c),
  user:          (s, c) => Icons._svg('<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>', s, c),
  userPlus:      (s, c) => Icons._svg('<path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>', s, c),
  userCheck:     (s, c) => Icons._svg('<path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/>', s, c),
  messageCircle: (s, c) => Icons._svg('<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>', s, c),
  shoppingBag:   (s, c) => Icons._svg('<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>', s, c),
  calendar:      (s, c) => Icons._svg('<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>', s, c),
  calendarCheck: (s, c) => Icons._svg('<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="9 16 11 18 15 14"/>', s, c),
  bell:          (s, c) => Icons._svg('<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>', s, c),
  search:        (s, c) => Icons._svg('<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>', s, c),
  settings:      (s, c) => Icons._svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>', s, c),
  mapPin:        (s, c) => Icons._svg('<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>', s, c),
  mail:          (s, c) => Icons._svg('<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>', s, c),
  phone:         (s, c) => Icons._svg('<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>', s, c),
  briefcase:     (s, c) => Icons._svg('<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>', s, c),
  check:         (s, c) => Icons._svg('<polyline points="20 6 9 17 4 12"/>', s, c),
  checkCircle:   (s, c) => Icons._svg('<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>', s, c),
  x:             (s, c) => Icons._svg('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>', s, c),
  plus:          (s, c) => Icons._svg('<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>', s, c),
  arrowLeft:     (s, c) => Icons._svg('<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>', s, c),
  arrowRight:    (s, c) => Icons._svg('<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>', s, c),
  chevronRight:  (s, c) => Icons._svg('<polyline points="9 18 15 12 9 6"/>', s, c),
  edit:          (s, c) => Icons._svg('<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>', s, c),
  thumbsUp:      (s, c) => Icons._svg('<path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/><path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>', s, c),
  send:          (s, c) => Icons._svg('<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>', s, c),
  lock:          (s, c) => Icons._svg('<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>', s, c),
  image:         (s, c) => Icons._svg('<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>', s, c),
  package:       (s, c) => Icons._svg('<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>', s, c),
  mic:           (s, c) => Icons._svg('<path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>', s, c),
  camera:        (s, c) => Icons._svg('<path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>', s, c),
  feather:       (s, c) => Icons._svg('<path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/>', s, c),
  video:         (s, c) => Icons._svg('<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>', s, c),
  play:          (s, c) => Icons._svg('<polygon points="5 3 19 12 5 21 5 3"/>', s, c),
  clock:         (s, c) => Icons._svg('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>', s, c),
  helpCircle:    (s, c) => Icons._svg('<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>', s, c),
  shield:        (s, c) => Icons._svg('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', s, c),
  eye:           (s, c) => Icons._svg('<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>', s, c),
  info:          (s, c) => Icons._svg('<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>', s, c),
  fileText:      (s, c) => Icons._svg('<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>', s, c),
  logOut:        (s, c) => Icons._svg('<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>', s, c),
  menu:          (s, c) => Icons._svg('<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>', s, c),
  filter:        (s, c) => Icons._svg('<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>', s, c),
};

// ── Navigation config ─────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'home',          label: 'Home',        icon: (a) => Icons.home(20, a), route: 'home' },
  { id: 'directory',     label: 'Directory',   icon: (a) => Icons.users(20, a), route: 'directory' },
  { id: 'ask-expert',   label: 'Ask Expert',  icon: (a) => Icons.messageCircle(20, a), route: 'ask-expert' },
  { id: 'emart',         label: 'E-Mart',      icon: (a) => Icons.shoppingBag(20, a), route: 'emart' },
  { id: 'events',        label: 'Events',      icon: (a) => Icons.calendar(20, a), route: 'events' },
  { id: 'connections',   label: 'Connections', icon: (a) => Icons.userPlus(20, a), route: 'connections', badge: true },
  { id: 'notifications', label: 'Notifications', icon: (a) => Icons.bell(20, a), route: 'notifications', badge: true },
];

const BOTTOM_NAV_ITEMS = [
  { id: 'home',       label: 'Home',      icon: (a) => Icons.home(20, a),         route: 'home' },
  { id: 'directory',  label: 'Directory', icon: (a) => Icons.users(20, a),        route: 'directory' },
  { id: 'ask-expert', label: 'Ask',       icon: (a) => Icons.messageCircle(20, a), route: 'ask-expert' },
  { id: 'emart',      label: 'E-Mart',    icon: (a) => Icons.shoppingBag(20, a),  route: 'emart' },
  { id: 'events',     label: 'Events',    icon: (a) => Icons.calendar(20, a),     route: 'events' },
];

// ── App ───────────────────────────────────────────────────────
const App = {
  init() {
    this.renderSidebar();
    this.renderMobileHeader();
    this.renderBottomNav();
    this.registerRoutes();
    Toast.init();
    Modal.initStatic();
    this.updateNavBadges();
  },

  renderSidebar() {
    const u = PTIC_DATA.currentUser;
    document.getElementById('sidebar').innerHTML = `
      <div class="sidebar-logo">
        <div class="logo-mark">${Icons.feather(18, '#fff')}</div>
        <div>
          <div class="logo-text">PTIC</div>
          <div class="logo-sub">Poultry Tech Community</div>
        </div>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-label">Main Menu</div>
        ${NAV_ITEMS.map(item => `
          <div class="nav-item" data-route="${item.route}" id="nav-${item.id}" onclick="Router.navigate('${item.route}')">
            ${item.icon('currentColor')}
            <span>${item.label}</span>
            ${item.badge ? `<span class="nav-badge" id="badge-${item.id}" style="display:none;">0</span>` : ''}
          </div>`).join('')}
      </nav>
      <div class="sidebar-bottom">
        <div class="nav-item" onclick="Router.navigate('settings')" id="nav-settings">
          ${Icons.settings(20)}
          <span>Settings</span>
        </div>
        <div class="sidebar-user" onclick="Router.navigate('my-profile')" id="sidebar-user">
          <div class="avatar avatar-sm">${DataUtils.getInitials(u.name)}</div>
          <div class="sidebar-user-info">
            <div class="sidebar-user-name">${u.name}</div>
            <div class="sidebar-user-type">${u.type}</div>
          </div>
        </div>
      </div>`;
  },

  renderMobileHeader() {
    const u = PTIC_DATA.currentUser;
    document.getElementById('mobile-header').innerHTML = `
      <button class="mobile-menu-btn" id="mobile-menu-btn" onclick="App.toggleMobileMenu()">
        ${Icons.menu(22)}
      </button>
      <div style="display:flex; align-items:center; gap:var(--space-2);">
        <div class="logo-mark" style="width:30px; height:30px;">${Icons.feather(14, '#fff')}</div>
        <span style="font-size:17px; font-weight:700; color:var(--navy);">PTIC</span>
      </div>
      <div style="display:flex; align-items:center; gap:var(--space-2);">
        <button class="icon-btn" onclick="Router.navigate('notifications')">
          ${Icons.bell(20)}
          <span class="badge" id="notif-badge-mobile" style="display:none;"></span>
        </button>
        <div class="avatar avatar-sm" onclick="Router.navigate('my-profile')" style="cursor:pointer;" id="mobile-avatar">
          ${DataUtils.getInitials(u.name)}
        </div>
      </div>`;

    // Overlay
    document.getElementById('sidebar-overlay').addEventListener('click', () => App.closeMobileMenu());
  },

  renderBottomNav() {
    document.getElementById('bottom-nav').innerHTML = `
      <div class="bottom-nav-inner">
        ${BOTTOM_NAV_ITEMS.map(item => `
          <div class="bottom-nav-item" data-route="${item.route}" id="bottom-nav-${item.id}" onclick="Router.navigate('${item.route}')">
            ${item.icon('currentColor')}
            <span>${item.label}</span>
          </div>`).join('')}
      </div>`;
  },

  registerRoutes() {
    Router.register('home',           () => HomePage.render());
    Router.register('directory',      () => Directory.render());
    Router.register('profile-view',   (data) => Directory.renderProfileView(data.userId));
    Router.register('company-view',   (data) => Directory.renderCompanyView(data.companyId));
    Router.register('ask-expert',     () => AskExpert.render());
    Router.register('question-detail',(data) => AskExpert.renderQuestionDetail(data.questionId));
    Router.register('ask-form',       () => AskExpert.renderAskForm());
    Router.register('emart',          () => EMart.render());
    Router.register('product-detail', (data) => EMart.renderProductDetail(data.productId));
    Router.register('events',         () => Events.render());
    Router.register('event-detail',   (data) => Events.renderEventDetail(data.eventId));
    Router.register('connections',    () => Connections.render());
    Router.register('notifications',  () => Notifications.render());
    Router.register('my-profile',     () => Profile.render());
    Router.register('profile-edit',   () => Profile.renderEdit());
    Router.register('settings',       () => Settings.render());
    Router.register('search',         (data) => Search.render(data));
  },

  updateNav(route) {
    // Sidebar
    document.querySelectorAll('.nav-item[data-route]').forEach(item => {
      item.classList.toggle('active', item.dataset.route === route);
    });
    document.getElementById('nav-settings').classList.toggle('active', route === 'settings');
    // Bottom nav
    document.querySelectorAll('.bottom-nav-item[data-route]').forEach(item => {
      item.classList.toggle('active', item.dataset.route === route);
    });
    // Hide/show overlay
    App.closeMobileMenu();
  },

  updateNavBadges() {
    const connReqs = PTIC_DATA.currentUser.pendingIn.length;
    const notifUnread = DataUtils.unreadCount();

    // Connections badge
    const connBadge = document.getElementById('badge-connections');
    if (connBadge) {
      connBadge.style.display = connReqs > 0 ? 'flex' : 'none';
      connBadge.textContent = connReqs;
    }
    // Notifications badge
    const notifBadge = document.getElementById('badge-notifications');
    if (notifBadge) {
      notifBadge.style.display = notifUnread > 0 ? 'flex' : 'none';
      notifBadge.textContent = notifUnread;
    }
    // Mobile bell badge
    const mobileBadge = document.getElementById('notif-badge-mobile');
    if (mobileBadge) {
      mobileBadge.style.display = notifUnread > 0 ? 'block' : 'none';
    }
  },

  updateSidebarUser() {
    const u = PTIC_DATA.currentUser;
    const sidebarUser = document.getElementById('sidebar-user');
    if (sidebarUser) {
      sidebarUser.innerHTML = `
        <div class="avatar avatar-sm">${DataUtils.getInitials(u.name)}</div>
        <div class="sidebar-user-info">
          <div class="sidebar-user-name">${u.name}</div>
          <div class="sidebar-user-type">${u.type}</div>
        </div>`;
    }
    const mobileAvatar = document.getElementById('mobile-avatar');
    if (mobileAvatar) mobileAvatar.textContent = DataUtils.getInitials(u.name);
  },

  toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const isOpen = sidebar.classList.contains('mobile-open');
    if (isOpen) {
      App.closeMobileMenu();
    } else {
      sidebar.classList.add('mobile-open');
      overlay.style.display = 'block';
    }
  },

  closeMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.remove('mobile-open');
    overlay.style.display = 'none';
  },

  // Header search
  initHeaderSearch() {
    const input = document.getElementById('header-search-input');
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const q = e.target.value.trim();
          if (q.length >= 2) Router.navigate('search', { query: q });
        }
      });
    }
  },
};

// ── Bootstrap ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  Toast.init();
  if (Auth.isLoggedIn()) {
    document.getElementById('auth-wrapper').classList.add('hidden');
    document.getElementById('app-shell').classList.remove('hidden');
    App.init();
    Router.navigate('home');
  } else {
    document.getElementById('app-shell').classList.add('hidden');
    Auth.showAuth();
  }

  // Header search init (delayed until after App.init)
  setTimeout(() => App.initHeaderSearch(), 100);
});

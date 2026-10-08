// ============================================================
// PTIC – connections.js
// Connection management — requests, connected people
// ============================================================

const Connections = {
  currentTab: 'requests',

  render() {
    Router.showPage('page-connections');
    this.currentTab = 'requests';
    const incomingIds = PTIC_DATA.currentUser.pendingIn;
    const connectedIds = PTIC_DATA.currentUser.connections;

    document.getElementById('page-connections').innerHTML = `
      <div class="page-header">
        <div class="page-title">Connections</div>
        <div class="page-subtitle">Manage your network and connection requests.</div>
      </div>

      <div class="tabs connections-tabs" id="conn-tabs">
        <div class="tab-item active" data-tab="requests">
          Requests
          ${incomingIds.length > 0 ? `<span class="nav-badge" style="position:static; margin-left:4px;">${incomingIds.length}</span>` : ''}
        </div>
        <div class="tab-item" data-tab="connected">Connected (${connectedIds.length})</div>
        <div class="tab-item" data-tab="pending">Pending (${PTIC_DATA.currentUser.pendingOut.length})</div>
      </div>

      <div id="conn-content"></div>`;

    document.querySelectorAll('#conn-tabs .tab-item').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('#conn-tabs .tab-item').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentTab = tab.dataset.tab;
        this.renderContent();
      });
    });

    this.renderContent();
  },

  renderContent() {
    const container = document.getElementById('conn-content');
    const user = PTIC_DATA.currentUser;

    if (this.currentTab === 'requests') {
      if (user.pendingIn.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">${Icons.userPlus(28)}</div>
            <div class="empty-state-title">No pending requests</div>
            <div class="empty-state-desc">When someone sends you a connection request, it will appear here.</div>
            <button class="btn btn-outline" onclick="Router.navigate('directory')">
              ${Icons.users(14)} Explore Directory
            </button>
          </div>`;
        return;
      }
      container.innerHTML = user.pendingIn.map(uid => {
        const p = DataUtils.getPerson(uid);
        if (!p) return '';
        return `
          <div class="connection-card">
            ${DataUtils.avatarHTML(p, 'md')}
            <div class="connection-info">
              <div class="connection-name">${p.name}</div>
              <div class="connection-type">${p.type} · ${p.location}</div>
            </div>
            <div class="connection-actions">
              <button class="btn btn-green btn-sm" onclick="Connections.acceptRequest('${uid}')">
                ${Icons.check(13)} Accept
              </button>
              <button class="btn btn-outline-gray btn-sm" onclick="Connections.declineRequest('${uid}')">
                Decline
              </button>
            </div>
          </div>`;
      }).join('');
    }

    else if (this.currentTab === 'connected') {
      if (user.connections.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">${Icons.users(28)}</div>
            <div class="empty-state-title">No connections yet</div>
            <div class="empty-state-desc">Find relevant people and start connecting to build your network.</div>
            <button class="btn btn-outline" onclick="Router.navigate('directory')">
              ${Icons.users(14)} Explore Directory
            </button>
          </div>`;
        return;
      }
      container.innerHTML = user.connections.map(uid => {
        const p = DataUtils.getPerson(uid);
        if (!p) return '';
        return `
          <div class="connection-card">
            ${DataUtils.avatarHTML(p, 'md')}
            <div class="connection-info">
              <div class="connection-name">${p.name}</div>
              <div class="connection-type">${p.type} · ${p.location}</div>
            </div>
            <div class="connection-actions">
              <button class="btn btn-outline btn-sm" onclick="Router.navigate('profile-view', {userId:'${uid}'})">
                View Profile
              </button>
              <button class="btn btn-ghost btn-sm" title="Contact">
                ${Icons.mail(14)}
              </button>
            </div>
          </div>`;
      }).join('');
    }

    else if (this.currentTab === 'pending') {
      if (user.pendingOut.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">${Icons.clock(28)}</div>
            <div class="empty-state-title">No pending requests</div>
            <div class="empty-state-desc">Requests you've sent that are awaiting acceptance will appear here.</div>
          </div>`;
        return;
      }
      container.innerHTML = user.pendingOut.map(uid => {
        const p = DataUtils.getPerson(uid);
        if (!p) return '';
        return `
          <div class="connection-card">
            ${DataUtils.avatarHTML(p, 'md')}
            <div class="connection-info">
              <div class="connection-name">${p.name}</div>
              <div class="connection-type">${p.type} · ${p.location}</div>
              <span class="pill pill-amber" style="margin-top:4px;">Request Pending</span>
            </div>
            <div class="connection-actions">
              <button class="btn btn-ghost btn-sm" onclick="Connections.withdrawRequest('${uid}')">Withdraw</button>
            </div>
          </div>`;
      }).join('');
    }
  },

  acceptRequest(userId) {
    const user = PTIC_DATA.currentUser;
    user.pendingIn = user.pendingIn.filter(id => id !== userId);
    if (!user.connections.includes(userId)) user.connections.push(userId);
    const person = DataUtils.getPerson(userId);
    Toast.success(`✓ You're now connected with ${person ? person.name : 'them'}!`);
    App.updateNavBadges();
    Connections.render();
  },

  declineRequest(userId) {
    PTIC_DATA.currentUser.pendingIn = PTIC_DATA.currentUser.pendingIn.filter(id => id !== userId);
    Toast.info('Request declined.');
    App.updateNavBadges();
    Connections.render();
  },

  withdrawRequest(userId) {
    PTIC_DATA.currentUser.pendingOut = PTIC_DATA.currentUser.pendingOut.filter(id => id !== userId);
    Toast.info('Request withdrawn.');
    Connections.render();
  },

  openConnectModal(userId) {
    const person = DataUtils.getPerson(userId);
    if (!person) return;
    const status = DataUtils.getConnectionStatus(userId);
    if (status !== 'none') return;

    Modal.show({
      id: 'connect-modal',
      title: `Connect with ${person.name}?`,
      body: `
        <div style="display:flex; align-items:center; gap:var(--space-4); margin-bottom:var(--space-5);">
          ${DataUtils.avatarHTML(person, 'md')}
          <div>
            <div style="font-size:var(--text-md); font-weight:600; color:var(--text);">${person.name}</div>
            <div style="font-size:var(--text-sm); color:var(--text-secondary);">${person.type} · ${person.location}</div>
          </div>
        </div>
        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label">Message <span style="font-weight:400; color:var(--text-secondary);">(optional)</span></label>
          <textarea id="connect-message" class="form-textarea" placeholder="Tell them why you'd like to connect..." style="min-height:100px;"></textarea>
        </div>`,
      confirmText: 'Send Request',
      confirmClass: 'btn-green',
      onConfirm: () => {
        PTIC_DATA.currentUser.pendingOut.push(userId);
        Modal.close('connect-modal');
        Toast.success(`✓ Connection request sent to ${person.name}!`);
        App.updateNavBadges();
      },
    });
  },
};

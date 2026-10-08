// ============================================================
// PTIC – settings.js
// Settings page
// ============================================================

const Settings = {
  render() {
    Router.showPage('page-settings');
    const u = PTIC_DATA.currentUser;

    const groups = [
      {
        label: 'Account',
        items: [
          { icon: Icons.user(18, 'var(--blue)'), label: 'Personal Information', desc: `${u.name} · ${u.email}`, action: () => Profile.renderEdit() },
          { icon: Icons.lock(18, 'var(--blue)'), label: 'Change Password', desc: 'Update your password', action: () => Toast.info('Password change available in full version.') },
        ],
      },
      {
        label: 'Notifications',
        items: [
          { icon: Icons.bell(18, 'var(--green)'), label: 'Notification Preferences', desc: 'Choose what you are notified about', action: () => Settings.renderNotifPrefs() },
        ],
      },
      {
        label: 'Privacy',
        items: [
          { icon: Icons.shield(18, 'var(--navy)'), label: 'Privacy Settings', desc: 'Control who can see your profile', action: () => Toast.info('Privacy settings available in full version.') },
          { icon: Icons.eye(18, 'var(--navy)'), label: 'Profile Visibility', desc: 'Manage your profile visibility', action: () => Toast.info('Privacy settings available in full version.') },
        ],
      },
      {
        label: 'Help',
        items: [
          { icon: Icons.helpCircle(18, 'var(--blue)'), label: 'Help & Support', desc: 'FAQs and support resources', action: () => Toast.info('Help center coming soon.') },
          { icon: Icons.mail(18, 'var(--blue)'), label: 'Contact PTIC', desc: 'Reach our support team', action: () => Toast.info('Contact: support@ptic.in') },
        ],
      },
      {
        label: 'About',
        items: [
          { icon: Icons.info(18, 'var(--text-secondary)'), label: 'About PTIC', desc: 'Version 1.0.0 · Build 2026.09', action: () => Settings.renderAbout() },
          { icon: Icons.fileText(18, 'var(--text-secondary)'), label: 'Terms & Privacy Policy', desc: '', action: () => Toast.info('Legal documents available in full version.') },
        ],
      },
    ];

    document.getElementById('page-settings').innerHTML = `
      <div class="page-header">
        <div class="page-title">Settings</div>
      </div>

      <div style="max-width:600px;">
        ${groups.map((g, gi) => `
          <div class="settings-group">
            <div class="settings-group-label">${g.label}</div>
            ${g.items.map((item, ii) => `
              <div class="settings-item" id="settings-item-${gi}-${ii}">
                <div class="settings-item-left">
                  <div style="width:32px; height:32px; border-radius:var(--radius-md); background:var(--bg); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                    ${item.icon}
                  </div>
                  <div>
                    <div class="settings-item-label">${item.label}</div>
                    ${item.desc ? `<div class="settings-item-desc">${item.desc}</div>` : ''}
                  </div>
                </div>
                ${Icons.chevronRight(16, 'var(--text-secondary)')}
              </div>`).join('')}
          </div>`).join('')}

        <!-- Logout -->
        <div class="settings-group">
          <div class="settings-item" id="settings-logout" style="color:var(--red);">
            <div class="settings-item-left">
              <div style="width:32px; height:32px; border-radius:var(--radius-md); background:var(--red-light); display:flex; align-items:center; justify-content:center;">
                ${Icons.logOut(18, 'var(--red)')}
              </div>
              <div class="settings-item-label" style="color:var(--red);">Logout</div>
            </div>
          </div>
        </div>
      </div>`;

    // Bind actions
    groups.forEach((g, gi) => {
      g.items.forEach((item, ii) => {
        const el = document.getElementById(`settings-item-${gi}-${ii}`);
        if (el) el.addEventListener('click', item.action);
      });
    });

    document.getElementById('settings-logout').addEventListener('click', () => {
      Modal.show({
        id: 'logout-modal',
        title: 'Logout',
        body: '<p style="color:var(--text-secondary);">Are you sure you want to logout from PTIC?</p>',
        confirmText: 'Logout',
        confirmClass: 'btn-danger',
        onConfirm: () => Auth.logout(),
      });
    });
  },

  renderAbout() {
    Modal.show({
      id: 'about-modal',
      title: 'About PTIC',
      body: `
        <div style="text-align:center; padding:var(--space-4) 0;">
          <div style="width:56px; height:56px; background:var(--navy); border-radius:var(--radius-lg); display:flex; align-items:center; justify-content:center; margin:0 auto var(--space-4);">
            ${Icons.feather(28, '#fff')}
          </div>
          <div style="font-size:var(--text-xl); font-weight:700; color:var(--navy); margin-bottom:var(--space-2);">PTIC</div>
          <div style="font-style:italic; color:var(--text-secondary); margin-bottom:var(--space-4);">"Connect. Discover. Grow."</div>
          <div style="font-size:var(--text-sm); color:var(--text-secondary); line-height:1.8;">
            PTIC is a digital community platform connecting poultry-industry stakeholders across India.<br><br>
            Version 1.0.0 · September 2026<br>
            © 2026 PTIC. All rights reserved.
          </div>
        </div>`,
      showCancel: false,
      confirmText: 'Close',
      confirmClass: 'btn-outline-gray',
      onConfirm: () => Modal.close('about-modal'),
    });
  },

  renderNotifPrefs() {
    Toast.info('Notification preferences available in full version.');
  },
};

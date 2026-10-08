// ============================================================
// PTIC – events.js
// Events / PTSE — list, detail with tabs, registration
// ============================================================

const Events = {
  currentTab: 'overview',

  render() {
    Router.showPage('page-events');

    document.getElementById('page-events').innerHTML = `
      <div class="page-header">
        <div class="page-title">Events</div>
        <div class="page-subtitle">Discover and register for poultry industry events.</div>
      </div>
      <div class="events-grid">
        ${PTIC_DATA.events.map(e => Events.eventCard(e)).join('')}
      </div>`;
  },

  eventCard(e) {
    const isUpcoming = new Date(e.dateStart) >= new Date();
    return `
      <div class="event-card" onclick="Events.renderEventDetail('${e.id}')">
        <div class="event-card-img" style="height:160px;">
          <div style="text-align:center; color:rgba(255,255,255,0.7);">
            ${Icons.calendar(40, 'rgba(255,255,255,0.5)')}
            <div style="font-size:var(--text-xs); margin-top:8px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase;">${e.shortName || e.name}</div>
          </div>
        </div>
        <div class="event-card-body">
          <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:var(--space-2); margin-bottom:var(--space-2);">
            <div class="event-name">${e.name}</div>
            ${isUpcoming ? `<span class="pill pill-green" style="flex-shrink:0;">Upcoming</span>` : `<span class="pill pill-gray" style="flex-shrink:0;">Past</span>`}
          </div>
          <div class="event-meta">
            <div class="event-meta-row">${Icons.calendar(13)} ${e.date}</div>
            <div class="event-meta-row">${Icons.mapPin(13)} ${e.location}</div>
          </div>
          <div style="font-size:var(--text-sm); color:var(--text-secondary); line-height:1.5; margin-bottom:var(--space-4);">
            ${e.description.slice(0, 100)}…
          </div>
          ${e.registered
            ? `<button class="btn btn-connected btn-full btn-sm" disabled>${Icons.check(13)} Registered</button>`
            : `<button class="btn btn-outline btn-full btn-sm" onclick="event.stopPropagation(); Events.renderEventDetail('${e.id}')">View Event</button>`}
        </div>
      </div>`;
  },

  renderEventDetail(eventId) {
    Router.showPage('page-event-detail');
    const e = PTIC_DATA.events.find(ev => ev.id === eventId);
    if (!e) { Events.render(); return; }
    this.currentTab = 'overview';
    this.renderEventDetailContent(e);
  },

  renderEventDetailContent(e) {
    const tabs = ['Overview', 'Agenda', 'Speakers', 'Sponsors', 'Expo / Stalls', 'Videos'];
    document.getElementById('page-event-detail').innerHTML = `
      <button class="btn btn-ghost" onclick="Router.navigate('events')" style="margin-bottom:var(--space-4);">
        ${Icons.arrowLeft(16)} Back to Events
      </button>

      <div class="event-detail-hero">
        <div class="event-detail-title">${e.name}</div>
        <div class="event-detail-dates">${Icons.calendar(14)} ${e.date}</div>
        <div class="event-detail-loc">${Icons.mapPin(13)} ${e.location}</div>
      </div>

      <div class="event-detail-top">
        <div style="display:flex; gap:var(--space-3); align-items:center;">
          <span class="pill pill-green">Upcoming</span>
          ${e.registered ? `<span class="pill pill-blue">${Icons.check(11)} You're Registered</span>` : ''}
        </div>
        ${e.registered
          ? `<button class="btn btn-connected" disabled>${Icons.check(16)} Registered</button>`
          : `<button class="btn btn-green" onclick="Events.registerForEvent('${e.id}')">
               ${Icons.calendarCheck(16)} Register Now
             </button>`}
      </div>

      <div class="tabs" id="event-tabs">
        ${tabs.map(t => `<div class="tab-item ${t.toLowerCase().replace(' / ','').replace(' ','') === this.currentTab ? 'active' : ''}" data-tab="${t.toLowerCase().replace(' / ','').replace(' ','')}">${t}</div>`).join('')}
      </div>

      <div id="event-tab-content"></div>`;

    // Tab click events
    document.querySelectorAll('#event-tabs .tab-item').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('#event-tabs .tab-item').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentTab = tab.dataset.tab;
        this.renderTabContent(e);
      });
    });

    this.renderTabContent(e);
  },

  renderTabContent(e) {
    const container = document.getElementById('event-tab-content');
    switch (this.currentTab) {
      case 'overview':   container.innerHTML = this.tabOverview(e); break;
      case 'agenda':     container.innerHTML = this.tabAgenda(e); break;
      case 'speakers':   container.innerHTML = this.tabSpeakers(e); break;
      case 'sponsors':   container.innerHTML = this.tabSponsors(e); break;
      case 'expostalls': container.innerHTML = this.tabStalls(e); break;
      case 'videos':     container.innerHTML = this.tabVideos(e); break;
    }
  },

  tabOverview(e) {
    return `
      <div class="card" style="margin-bottom:var(--space-4);">
        <div style="font-size:var(--text-base); color:var(--text); line-height:1.9;">${e.overview}</div>
      </div>
      <div class="grid-3" style="margin-bottom:var(--space-4);">
        <div class="card" style="text-align:center;">
          ${Icons.users(24, 'var(--blue)')}<br>
          <div style="font-size:var(--text-2xl); font-weight:700; color:var(--navy); margin:var(--space-2) 0;">200+</div>
          <div style="font-size:var(--text-sm); color:var(--text-secondary);">Exhibitors</div>
        </div>
        <div class="card" style="text-align:center;">
          ${Icons.mic(24, 'var(--green)')}<br>
          <div style="font-size:var(--text-2xl); font-weight:700; color:var(--navy); margin:var(--space-2) 0;">40+</div>
          <div style="font-size:var(--text-sm); color:var(--text-secondary);">Sessions</div>
        </div>
        <div class="card" style="text-align:center;">
          ${Icons.calendar(24, 'var(--navy)')}<br>
          <div style="font-size:var(--text-2xl); font-weight:700; color:var(--navy); margin:var(--space-2) 0;">3</div>
          <div style="font-size:var(--text-sm); color:var(--text-secondary);">Days</div>
        </div>
      </div>`;
  },

  tabAgenda(e) {
    if (!e.agenda || e.agenda.length === 0) {
      return `<div class="empty-state"><div class="empty-state-title">Agenda coming soon</div></div>`;
    }
    return `
      <div class="card">
        ${e.agenda.map(item => `
          <div class="agenda-item">
            <div class="agenda-time">${item.time}</div>
            <div class="agenda-content">
              <div class="agenda-session">${item.session}</div>
              <div class="agenda-topic">${item.topic}</div>
              <div class="agenda-speaker">${Icons.user(12)} ${item.speaker}</div>
            </div>
          </div>`).join('')}
      </div>`;
  },

  tabSpeakers(e) {
    if (!e.speakers || e.speakers.length === 0) {
      return `<div class="empty-state"><div class="empty-state-title">Speakers to be announced</div></div>`;
    }
    return `
      <div class="grid-2">
        ${e.speakers.map(s => `
          <div class="speaker-card">
            ${DataUtils.avatarHTML({name: s.name}, 'lg')}
            <div class="speaker-info">
              <div class="speaker-name">${s.name}</div>
              <div class="speaker-role">${s.role}</div>
              <div class="speaker-org">${s.org}</div>
            </div>
          </div>`).join('')}
      </div>`;
  },

  tabSponsors(e) {
    if (!e.sponsors || e.sponsors.length === 0) {
      return `<div class="empty-state"><div class="empty-state-title">Sponsors to be announced</div></div>`;
    }
    const tiers = [...new Set(e.sponsors.map(s => s.tier))];
    return tiers.map(tier => `
      <div style="margin-bottom:var(--space-6);">
        <div style="font-size:var(--text-xs); font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--text-secondary); margin-bottom:var(--space-3);">${tier}</div>
        <div class="sponsor-grid">
          ${e.sponsors.filter(s => s.tier === tier).map(s => `
            <div class="sponsor-card">
              <div class="sponsor-logo">${s.logo}</div>
              <div style="font-size:var(--text-sm); font-weight:600; color:var(--text);">${s.name}</div>
            </div>`).join('')}
        </div>
      </div>`).join('');
  },

  tabStalls(e) {
    if (!e.stalls || e.stalls.length === 0) {
      return `<div class="empty-state"><div class="empty-state-title">Stall list coming soon</div></div>`;
    }
    return `
      <div class="stall-grid">
        ${e.stalls.map(s => `
          <div class="stall-card">
            <div class="stall-number">Stall ${s.number}</div>
            <div style="font-size:var(--text-md); font-weight:600; color:var(--text);">${s.company}</div>
            <div style="margin:var(--space-2) 0;"><span class="pill pill-blue">${s.category}</span></div>
            <div style="font-size:var(--text-sm); color:var(--text-secondary);">${s.description}</div>
          </div>`).join('')}
      </div>`;
  },

  tabVideos(e) {
    if (!e.videos || e.videos.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-state-icon">${Icons.video(28)}</div>
          <div class="empty-state-title">Videos coming soon</div>
          <div class="empty-state-desc">Post-event videos and recordings will appear here after the event.</div>
        </div>`;
    }
    return `<div class="video-grid">${e.videos.map(v => `
      <div class="video-card">
        <div class="video-thumb">
          <div class="video-play-btn">${Icons.play(18)}</div>
        </div>
        <div class="video-info">
          <div class="video-title">${v.title}</div>
          <div class="video-meta">${v.speaker}</div>
        </div>
      </div>`).join('')}
    </div>`;
  },

  registerForEvent(eventId) {
    const e = PTIC_DATA.events.find(ev => ev.id === eventId);
    Modal.show({
      id: 'register-modal',
      title: `Register for ${e.shortName || e.name}`,
      body: `
        <div style="color:var(--text-secondary); font-size:var(--text-sm); margin-bottom:var(--space-4);">
          ${Icons.calendar(14)} ${e.date} &nbsp; ${Icons.mapPin(14)} ${e.location}
        </div>
        <p style="font-size:var(--text-base); color:var(--text); line-height:1.7;">
          You're registering as <strong>${PTIC_DATA.currentUser.name}</strong> (${PTIC_DATA.currentUser.type}).
          A confirmation will be sent to <strong>${PTIC_DATA.currentUser.email}</strong>.
        </p>`,
      confirmText: 'Confirm Registration',
      confirmClass: 'btn-green',
      onConfirm: () => {
        e.registered = true;
        Modal.close('register-modal');
        Toast.success('✓ Registration confirmed! Check your email.');
        PTIC_DATA.currentUser.events.push(eventId);
        Events.renderEventDetail(eventId);
      },
    });
  },
};

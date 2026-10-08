// ============================================================
// PTIC – home.js
// Home page renderer
// ============================================================

const HomePage = {
  render() {
    Router.showPage('page-home');
    const user = PTIC_DATA.currentUser;
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

    // Recommended: connections + 2 random people not yet connected
    const recommended = PTIC_DATA.people.filter(p =>
      !user.connections.includes(p.id) &&
      !user.pendingOut.includes(p.id)
    ).slice(0, 3);

    const upcomingEvents = PTIC_DATA.events.filter(e =>
      new Date(e.dateStart) >= new Date()
    ).slice(0, 2);

    const activities = [
      { text: `You asked a question about FCR improvement`, time: '2 days ago' },
      { text: `Dr. Arun Kumar answered your question`, time: '2 hours ago' },
      { text: `Your enquiry to AgriTech Solutions was responded`, time: 'Yesterday' },
    ];

    document.getElementById('page-home').innerHTML = `
      <div class="home-greeting">
        <h1>${greeting}, ${user.name.split(' ')[0]} 👋</h1>
        <p>What are you looking for today?</p>
      </div>

      <div class="home-search">
        <div class="search-bar">
          <div class="search-bar-icon">${Icons.search(18)}</div>
          <input id="home-search-input" type="text" placeholder="Search people, companies, products, solutions..." />
        </div>
      </div>

      <div class="home-section">
        <div class="section-header">
          <div class="section-title">Quick Actions</div>
        </div>
        <div class="quick-actions-grid">
          <div class="quick-action-card" onclick="Router.navigate('directory')">
            <div class="qa-icon" style="background:#E3F0FC;">${Icons.users(22, '#1976D2')}</div>
            <div>
              <div class="qa-title">Find People</div>
              <div class="qa-desc">Discover farmers, vets &amp; experts</div>
            </div>
          </div>
          <div class="quick-action-card" onclick="Router.navigate('ask-expert')">
            <div class="qa-icon" style="background:#F3E5F5;">${Icons.messageCircle(22, '#9C27B0')}</div>
            <div>
              <div class="qa-title">Ask Expert</div>
              <div class="qa-desc">Get answers from the community</div>
            </div>
          </div>
          <div class="quick-action-card" onclick="Router.navigate('emart')">
            <div class="qa-icon" style="background:#FFF3E0;">${Icons.shoppingBag(22, '#FF6F00')}</div>
            <div>
              <div class="qa-title">Explore E-Mart</div>
              <div class="qa-desc">Find products &amp; services</div>
            </div>
          </div>
          <div class="quick-action-card" onclick="Router.navigate('events')">
            <div class="qa-icon" style="background:#E6F7F1;">${Icons.calendar(22, '#22A06B')}</div>
            <div>
              <div class="qa-title">Upcoming Events</div>
              <div class="qa-desc">Discover &amp; register for events</div>
            </div>
          </div>
        </div>
      </div>

      <div class="home-section">
        <div class="section-header">
          <div class="section-title">Recommended for You</div>
          <span class="section-link" onclick="Router.navigate('directory')">See all</span>
        </div>
        <div class="recommended-grid">
          ${recommended.map(p => HomePage.personCard(p)).join('')}
        </div>
      </div>

      <div class="home-section">
        <div class="section-header">
          <div class="section-title">Upcoming Events</div>
          <span class="section-link" onclick="Router.navigate('events')">See all</span>
        </div>
        <div class="events-grid">
          ${upcomingEvents.map(e => HomePage.eventCard(e)).join('')}
        </div>
      </div>

      <div class="home-section">
        <div class="section-header">
          <div class="section-title">Recent Activity</div>
        </div>
        <div class="activity-list">
          ${activities.map(a => `
            <div class="activity-item">
              <div class="activity-dot"></div>
              <span style="flex:1;">${a.text}</span>
              <span style="font-size:var(--text-xs);color:var(--text-secondary);white-space:nowrap;">${a.time}</span>
            </div>`).join('')}
        </div>
      </div>`;

    // Home search
    document.getElementById('home-search-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = e.target.value.trim();
        if (q.length >= 2) Router.navigate('search', { query: q });
      }
    });
  },

  personCard(p) {
    const status = DataUtils.getConnectionStatus(p.id);
    const btnHtml = status === 'connected'
      ? `<button class="btn btn-connected btn-sm" disabled>${Icons.check(12)} Connected</button>`
      : status === 'pending'
      ? `<button class="btn btn-pending btn-sm" disabled>Request Pending</button>`
      : `<button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); Connections.openConnectModal('${p.id}')">
           ${Icons.userPlus(12)} Connect
         </button>`;

    return `
      <div class="person-card">
        <div class="person-card-header">
          ${DataUtils.avatarHTML(p, 'md')}
          <div class="person-card-info">
            <div class="person-name">${p.name}</div>
            <div class="person-type">${p.type}</div>
          </div>
        </div>
        <div class="person-location">${Icons.mapPin(13)} ${p.location}</div>
        <div class="person-tags">
          ${(p.interests || []).slice(0, 3).map(i => `<span class="tag">${i}</span>`).join('')}
        </div>
        <div style="display:flex; gap:var(--space-2); margin-top:var(--space-2);">
          <button class="btn btn-outline btn-sm btn-full" onclick="Router.navigate('profile-view', {userId:'${p.id}'})">View Profile</button>
          ${btnHtml}
        </div>
      </div>`;
  },

  eventCard(e) {
    return `
      <div class="event-card" onclick="Router.navigate('event-detail', {eventId:'${e.id}'})">
        <div class="event-card-img">
          ${Icons.calendar(36, 'rgba(255,255,255,0.6)')}
        </div>
        <div class="event-card-body">
          <div class="event-name">${e.name}</div>
          <div class="event-meta">
            <div class="event-meta-row">${Icons.calendar(13)} ${e.date}</div>
            <div class="event-meta-row">${Icons.mapPin(13)} ${e.location}</div>
          </div>
          <button class="btn btn-outline btn-sm">View Event</button>
        </div>
      </div>`;
  },
};

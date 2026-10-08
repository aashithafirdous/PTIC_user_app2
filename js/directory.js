// ============================================================
// PTIC – directory.js
// Directory · People · Companies · Profile View
// ============================================================

const Directory = {
  state: {
    tab: 'all',
    typeFilter: '',
    locationFilter: '',
    interestFilter: '',
    searchQuery: '',
  },

  render() {
    Router.showPage('page-directory');
    this.state = { tab: 'all', typeFilter: '', locationFilter: '', interestFilter: '', searchQuery: '' };

    const locations = [...new Set(PTIC_DATA.people.map(p => p.location.split(',')[0].trim()))];
    const interests = [...new Set(PTIC_DATA.people.flatMap(p => p.interests || []))].slice(0, 10);
    const types = [...new Set(PTIC_DATA.people.map(p => p.type))];

    document.getElementById('page-directory').innerHTML = `
      <div class="page-header">
        <div class="page-title">People &amp; Companies</div>
        <div class="page-subtitle">Find farmers, veterinarians, technology providers and more.</div>
      </div>

      <div class="search-bar">
        <div class="search-bar-icon">${Icons.search(18)}</div>
        <input id="dir-search" type="text" placeholder="Search people, companies..." />
      </div>

      <div class="directory-filters">
        <select id="dir-type" class="form-select">
          <option value="">All Types</option>
          ${types.map(t => `<option value="${t}">${t}</option>`).join('')}
        </select>
        <select id="dir-location" class="form-select">
          <option value="">All Locations</option>
          ${locations.map(l => `<option value="${l}">${l}</option>`).join('')}
        </select>
        <select id="dir-interest" class="form-select">
          <option value="">All Interests</option>
          ${interests.map(i => `<option value="${i}">${i}</option>`).join('')}
        </select>
      </div>

      <div class="tabs" id="dir-tabs">
        <div class="tab-item active" data-tab="all">All</div>
        <div class="tab-item" data-tab="people">People</div>
        <div class="tab-item" data-tab="companies">Companies</div>
      </div>

      <div id="dir-results" class="directory-grid"></div>`;

    // Events
    document.getElementById('dir-search').addEventListener('input', (e) => {
      this.state.searchQuery = e.target.value.toLowerCase();
      this.renderResults();
    });
    document.getElementById('dir-type').addEventListener('change', (e) => {
      this.state.typeFilter = e.target.value;
      this.renderResults();
    });
    document.getElementById('dir-location').addEventListener('change', (e) => {
      this.state.locationFilter = e.target.value;
      this.renderResults();
    });
    document.getElementById('dir-interest').addEventListener('change', (e) => {
      this.state.interestFilter = e.target.value;
      this.renderResults();
    });
    document.querySelectorAll('#dir-tabs .tab-item').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('#dir-tabs .tab-item').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.state.tab = tab.dataset.tab;
        this.renderResults();
      });
    });

    this.renderResults();
  },

  filterPeople() {
    const { searchQuery, typeFilter, locationFilter, interestFilter } = this.state;
    return PTIC_DATA.people.filter(p => {
      const matchSearch = !searchQuery ||
        p.name.toLowerCase().includes(searchQuery) ||
        p.type.toLowerCase().includes(searchQuery) ||
        p.location.toLowerCase().includes(searchQuery) ||
        (p.interests || []).some(i => i.toLowerCase().includes(searchQuery));
      const matchType     = !typeFilter || p.type === typeFilter;
      const matchLocation = !locationFilter || p.location.includes(locationFilter);
      const matchInterest = !interestFilter || (p.interests || []).includes(interestFilter);
      return matchSearch && matchType && matchLocation && matchInterest;
    });
  },

  filterCompanies() {
    const { searchQuery, typeFilter, locationFilter } = this.state;
    return PTIC_DATA.companies.filter(c => {
      const matchSearch = !searchQuery ||
        c.name.toLowerCase().includes(searchQuery) ||
        c.type.toLowerCase().includes(searchQuery) ||
        c.description.toLowerCase().includes(searchQuery);
      const matchType     = !typeFilter || c.type.includes(typeFilter.split(' ')[0]);
      const matchLocation = !locationFilter || c.location.includes(locationFilter);
      return matchSearch && matchType && matchLocation;
    });
  },

  renderResults() {
    const container = document.getElementById('dir-results');
    const { tab } = this.state;

    let html = '';
    const people    = (tab === 'all' || tab === 'people')    ? this.filterPeople()    : [];
    const companies = (tab === 'all' || tab === 'companies') ? this.filterCompanies() : [];

    if (people.length === 0 && companies.length === 0) {
      container.innerHTML = `
        <div style="grid-column:1/-1;">
          <div class="empty-state">
            <div class="empty-state-icon">${Icons.users(28)}</div>
            <div class="empty-state-title">No results found</div>
            <div class="empty-state-desc">Try adjusting your search or filters.</div>
          </div>
        </div>`;
      return;
    }

    people.forEach(p => { html += this.personCard(p); });
    companies.forEach(c => { html += this.companyCard(c); });
    container.innerHTML = html;
  },

  personCard(p) {
    const status = DataUtils.getConnectionStatus(p.id);
    let btn = '';
    if (status === 'connected')
      btn = `<button class="btn btn-connected btn-sm" disabled>${Icons.check(12)} Connected</button>`;
    else if (status === 'pending')
      btn = `<button class="btn btn-pending btn-sm" disabled>Pending</button>`;
    else
      btn = `<button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); Connections.openConnectModal('${p.id}')">
               ${Icons.userPlus(13)} Connect
             </button>`;

    return `
      <div class="person-card card-clickable" onclick="Router.navigate('profile-view', {userId:'${p.id}'})">
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
          <button class="btn btn-outline btn-sm flex-1" onclick="event.stopPropagation(); Router.navigate('profile-view', {userId:'${p.id}'})">View Profile</button>
          ${btn}
        </div>
      </div>`;
  },

  companyCard(c) {
    return `
      <div class="person-card card-clickable" onclick="Router.navigate('company-view', {companyId:'${c.id}'})">
        <div class="person-card-header">
          <div class="avatar avatar-md" style="background:var(--bg); border:1px solid var(--border); font-weight:700; color:var(--navy); font-size:14px;">
            ${DataUtils.getInitials(c.name)}
          </div>
          <div class="person-card-info">
            <div class="person-name">${c.name}</div>
            <div class="person-type">${c.type}</div>
          </div>
        </div>
        <div class="person-location">${Icons.mapPin(13)} ${c.location}</div>
        <div style="font-size:var(--text-sm); color:var(--text-secondary); line-height:1.5; margin:var(--space-2) 0;">
          ${c.description.slice(0, 90)}…
        </div>
        <button class="btn btn-outline btn-sm btn-full" onclick="event.stopPropagation(); Router.navigate('company-view', {companyId:'${c.id}'})">View Profile</button>
      </div>`;
  },

  renderProfileView(userId) {
    Router.showPage('page-profile-view');
    const person = DataUtils.getPerson(userId);
    if (!person) { Router.navigate('directory'); return; }
    const status = DataUtils.getConnectionStatus(userId);

    let connectBtn = '';
    if (status === 'connected')
      connectBtn = `<button class="btn btn-connected" disabled>${Icons.check(16)} Connected</button>`;
    else if (status === 'pending')
      connectBtn = `<button class="btn btn-pending" disabled>Request Pending</button>`;
    else
      connectBtn = `<button class="btn btn-green" onclick="Connections.openConnectModal('${person.id}')">
                      ${Icons.userPlus(16)} Connect
                    </button>`;

    document.getElementById('page-profile-view').innerHTML = `
      <button class="btn btn-ghost" onclick="Router.back()" style="margin-bottom:var(--space-4);">
        ${Icons.arrowLeft(16)} Back
      </button>

      <div class="profile-hero">
        ${DataUtils.avatarHTML(person, 'xl')}
        <div class="profile-hero-info">
          <div class="profile-hero-name">${person.name}</div>
          <div class="profile-hero-type">${person.type}</div>
          <div class="profile-hero-meta">
            <div class="profile-meta-item">${Icons.mapPin(14)} ${person.location}</div>
            ${person.company ? `<div class="profile-meta-item">${Icons.briefcase(14)} ${person.role}, ${person.company}</div>` : ''}
          </div>
          <div class="profile-hero-actions">
            ${connectBtn}
            ${status === 'connected' ? `<button class="btn btn-outline">${Icons.mail(16)} Message</button>` : ''}
          </div>
        </div>
      </div>

      <div class="profile-detail-content">
        <div>
          ${person.about ? `
          <div class="card" style="margin-bottom:var(--space-4);">
            <div class="section-title" style="margin-bottom:var(--space-3);">About</div>
            <div style="font-size:var(--text-base); color:var(--text); line-height:1.8;">${person.about}</div>
          </div>` : ''}

          ${person.interests && person.interests.length ? `
          <div class="card" style="margin-bottom:var(--space-4);">
            <div class="section-title" style="margin-bottom:var(--space-3);">Interests</div>
            <div class="person-tags">
              ${person.interests.map(i => `<span class="tag">${i}</span>`).join('')}
            </div>
          </div>` : ''}
        </div>

        <div>
          ${person.company ? `
          <div class="profile-sidebar-card" style="margin-bottom:var(--space-4);">
            <h4>Company</h4>
            <div style="font-size:var(--text-md); font-weight:600; color:var(--text); margin-bottom:4px;">${person.company}</div>
            <div style="font-size:var(--text-sm); color:var(--blue); margin-bottom:var(--space-3);">${person.role}</div>
            <div style="font-size:var(--text-sm); color:var(--text-secondary); line-height:1.6;">${person.companyDesc}</div>
          </div>` : ''}

          ${status === 'connected' ? `
          <div class="profile-sidebar-card">
            <h4>Contact</h4>
            <div style="display:flex; flex-direction:column; gap:var(--space-3);">
              ${person.email ? `<div style="display:flex; align-items:center; gap:var(--space-2); font-size:var(--text-sm);">${Icons.mail(14)} ${person.email}</div>` : ''}
              ${person.phone ? `<div style="display:flex; align-items:center; gap:var(--space-2); font-size:var(--text-sm);">${Icons.phone(14)} ${person.phone}</div>` : ''}
            </div>
          </div>` : `
          <div class="profile-sidebar-card" style="text-align:center;">
            <div style="color:var(--text-secondary); font-size:var(--text-sm); line-height:1.6;">
              ${Icons.lock(28)}<br>
              <br>Connect with ${person.name.split(' ')[0]} to view contact details.
            </div>
          </div>`}
        </div>
      </div>`;
  },

  renderCompanyView(companyId) {
    Router.showPage('page-profile-view');
    const company = PTIC_DATA.companies.find(c => c.id === companyId);
    if (!company) { Router.navigate('directory'); return; }

    // Find people from this company
    const members = PTIC_DATA.people.filter(p => p.company === company.name);

    document.getElementById('page-profile-view').innerHTML = `
      <button class="btn btn-ghost" onclick="Router.back()" style="margin-bottom:var(--space-4);">
        ${Icons.arrowLeft(16)} Back
      </button>

      <div class="profile-hero">
        <div class="avatar avatar-xl" style="background:var(--bg); border:2px solid var(--border); font-weight:700; color:var(--navy);">
          ${DataUtils.getInitials(company.name)}
        </div>
        <div class="profile-hero-info">
          <div class="profile-hero-name">${company.name}</div>
          <div class="profile-hero-type">${company.type}</div>
          <div class="profile-hero-meta">
            <div class="profile-meta-item">${Icons.mapPin(14)} ${company.location}</div>
            <div class="profile-meta-item">${Icons.users(14)} ${company.employees} employees</div>
          </div>
          <div class="profile-hero-actions">
            <button class="btn btn-green" onclick="Router.navigate('emart')">
              ${Icons.shoppingBag(16)} View Products
            </button>
            <button class="btn btn-outline" onclick="Toast.info('Enquiry form coming up!')">
              ${Icons.mail(16)} Send Enquiry
            </button>
          </div>
        </div>
      </div>

      <div class="card" style="margin-bottom:var(--space-4);">
        <div class="section-title" style="margin-bottom:var(--space-3);">About</div>
        <div style="font-size:var(--text-base); color:var(--text); line-height:1.8;">${company.description}</div>
      </div>

      ${company.interests.length ? `
      <div class="card" style="margin-bottom:var(--space-4);">
        <div class="section-title" style="margin-bottom:var(--space-3);">Focus Areas</div>
        <div class="person-tags">
          ${company.interests.map(i => `<span class="tag">${i}</span>`).join('')}
        </div>
      </div>` : ''}

      ${members.length ? `
      <div>
        <div class="section-title" style="margin-bottom:var(--space-4);">Team Members</div>
        <div class="directory-grid">
          ${members.map(m => this.personCard(m)).join('')}
        </div>
      </div>` : ''}`;
  },
};

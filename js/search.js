// ============================================================
// PTIC – search.js
// Global search page with categorized results
// ============================================================

const Search = {
  render(data = {}) {
    Router.showPage('page-search');
    const query = data.query || '';

    document.getElementById('page-search').innerHTML = `
      <div class="page-header">
        <div class="page-title">Search Results</div>
      </div>
      <div class="search-bar" style="max-width:640px;">
        <div class="search-bar-icon">${Icons.search(18)}</div>
        <input id="search-input" type="text" placeholder="Search people, companies, products, solutions..." value="${query}" />
      </div>
      <div id="search-results" class="search-results-page"></div>`;

    const input = document.getElementById('search-input');
    input.addEventListener('input', () => Search.runSearch(input.value));
    input.focus();
    if (query) Search.runSearch(query);
  },

  runSearch(query) {
    const container = document.getElementById('search-results');
    if (!query || query.trim().length < 2) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">${Icons.search(28)}</div>
          <div class="empty-state-title">Start typing to search</div>
          <div class="empty-state-desc">Search across people, companies, products, questions and events.</div>
        </div>`;
      return;
    }

    const results = DataUtils.searchAll(query);
    const totalCount = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);

    if (totalCount === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">${Icons.search(28)}</div>
          <div class="empty-state-title">No results found</div>
          <div class="empty-state-desc">Try different keywords or browse the directory.</div>
          <button class="btn btn-outline" onclick="Router.navigate('directory')">Browse Directory</button>
        </div>`;
      return;
    }

    let html = '';

    if (results.people.length > 0) {
      html += `
        <div class="search-result-group">
          <div class="search-result-label">People</div>
          ${results.people.map(p => `
            <div class="search-result-item" onclick="Router.navigate('profile-view', {userId:'${p.id}'})">
              ${DataUtils.avatarHTML(p, 'sm')}
              <div class="search-result-text">
                <div class="search-result-title">${p.name}</div>
                <div class="search-result-sub">${p.type} · ${p.location}</div>
              </div>
              ${Icons.chevronRight(14, 'var(--text-secondary)')}
            </div>`).join('')}
        </div>`;
    }

    if (results.companies.length > 0) {
      html += `
        <div class="search-result-group">
          <div class="search-result-label">Companies</div>
          ${results.companies.map(c => `
            <div class="search-result-item" onclick="Router.navigate('company-view', {companyId:'${c.id}'})">
              <div class="avatar avatar-sm" style="background:var(--bg); border:1px solid var(--border); font-weight:700; color:var(--navy); font-size:11px;">${DataUtils.getInitials(c.name)}</div>
              <div class="search-result-text">
                <div class="search-result-title">${c.name}</div>
                <div class="search-result-sub">${c.type} · ${c.location}</div>
              </div>
              ${Icons.chevronRight(14, 'var(--text-secondary)')}
            </div>`).join('')}
        </div>`;
    }

    if (results.products.length > 0) {
      html += `
        <div class="search-result-group">
          <div class="search-result-label">Products &amp; Services</div>
          ${results.products.map(p => `
            <div class="search-result-item" onclick="EMart.renderProductDetail('${p.id}'); Router.navigate('product-detail', {productId:'${p.id}'})">
              <div style="width:36px; height:36px; background:var(--blue-light); border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; flex-shrink:0; color:var(--blue);">
                ${Icons.package(16, 'var(--blue)')}
              </div>
              <div class="search-result-text">
                <div class="search-result-title">${p.name}</div>
                <div class="search-result-sub">${p.provider} · ${p.category}</div>
              </div>
              ${Icons.chevronRight(14, 'var(--text-secondary)')}
            </div>`).join('')}
        </div>`;
    }

    if (results.questions.length > 0) {
      html += `
        <div class="search-result-group">
          <div class="search-result-label">Questions</div>
          ${results.questions.map(q => `
            <div class="search-result-item" onclick="AskExpert.renderQuestionDetail('${q.id}'); Router.showPage('page-question-detail')">
              <div style="width:36px; height:36px; background:#F3E5F5; border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                ${Icons.messageCircle(16, '#9C27B0')}
              </div>
              <div class="search-result-text">
                <div class="search-result-title">${q.title}</div>
                <div class="search-result-sub">${q.topic} · ${q.answers.length} answers</div>
              </div>
              ${Icons.chevronRight(14, 'var(--text-secondary)')}
            </div>`).join('')}
        </div>`;
    }

    if (results.events.length > 0) {
      html += `
        <div class="search-result-group">
          <div class="search-result-label">Events</div>
          ${results.events.map(e => `
            <div class="search-result-item" onclick="Events.renderEventDetail('${e.id}')">
              <div style="width:36px; height:36px; background:var(--green-light); border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                ${Icons.calendar(16, 'var(--green)')}
              </div>
              <div class="search-result-text">
                <div class="search-result-title">${e.name}</div>
                <div class="search-result-sub">${e.date} · ${e.location}</div>
              </div>
              ${Icons.chevronRight(14, 'var(--text-secondary)')}
            </div>`).join('')}
        </div>`;
    }

    container.innerHTML = `
      <div style="font-size:var(--text-sm); color:var(--text-secondary); margin-bottom:var(--space-5);">
        ${totalCount} result${totalCount !== 1 ? 's' : ''} for "<strong>${query}</strong>"
      </div>
      ${html}`;
  },
};

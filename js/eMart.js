// ============================================================
// PTIC – eMart.js
// E-Mart: product/service discovery and enquiry
// ============================================================

const EMart = {
  state: { category: 'All', searchQuery: '' },

  render() {
    Router.showPage('page-emart');
    this.state = { category: 'All', searchQuery: '' };

    document.getElementById('page-emart').innerHTML = `
      <div class="page-header">
        <div class="page-title">E-Mart</div>
        <div class="page-subtitle">Discover products and services for your poultry operation.</div>
      </div>

      <div class="search-bar">
        <div class="search-bar-icon">${Icons.search(18)}</div>
        <input id="emart-search" type="text" placeholder="Search products and services..." />
      </div>

      <div class="emart-categories">
        ${PTIC_DATA.emartCategories.map(cat => `
          <div class="chip ${cat === 'All' ? 'active' : ''}" data-cat="${cat}">${cat}</div>`).join('')}
      </div>

      <div id="emart-grid" class="emart-grid"></div>`;

    document.getElementById('emart-search').addEventListener('input', (e) => {
      this.state.searchQuery = e.target.value.toLowerCase();
      this.renderGrid();
    });
    document.querySelectorAll('.emart-categories .chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.emart-categories .chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.state.category = chip.dataset.cat;
        this.renderGrid();
      });
    });

    this.renderGrid();
  },

  filterProducts() {
    const { category, searchQuery } = this.state;
    return PTIC_DATA.products.filter(p => {
      const matchCat  = category === 'All' || p.category === category || p.tag === category;
      const matchSearch = !searchQuery ||
        p.name.toLowerCase().includes(searchQuery) ||
        p.description.toLowerCase().includes(searchQuery) ||
        p.provider.toLowerCase().includes(searchQuery) ||
        p.category.toLowerCase().includes(searchQuery);
      return matchCat && matchSearch;
    });
  },

  renderGrid() {
    const container = document.getElementById('emart-grid');
    const products  = this.filterProducts();

    if (products.length === 0) {
      container.innerHTML = `
        <div style="grid-column:1/-1;">
          <div class="empty-state">
            <div class="empty-state-icon">${Icons.shoppingBag(28)}</div>
            <div class="empty-state-title">No products found</div>
            <div class="empty-state-desc">Try a different category or search term.</div>
          </div>
        </div>`;
      return;
    }

    container.innerHTML = products.map(p => `
      <div class="product-card" onclick="EMart.renderProductDetail('${p.id}')">
        <div class="product-card-img">
          ${Icons.package(36, 'rgba(25,118,210,0.4)')}
        </div>
        <div class="product-card-body">
          <div style="margin-bottom:var(--space-2);">
            <span class="pill pill-blue">${p.category}</span>
          </div>
          <div class="product-name">${p.name}</div>
          <div class="product-provider">${p.provider}</div>
          <div class="product-desc">${p.description}</div>
          <button class="btn btn-outline btn-sm btn-full">View Details</button>
        </div>
      </div>`).join('');
  },

  renderProductDetail(productId) {
    Router.showPage('page-product-detail');
    const p = DataUtils.getProduct(productId);
    if (!p) { EMart.render(); return; }

    document.getElementById('page-product-detail').innerHTML = `
      <button class="btn btn-ghost" onclick="Router.navigate('emart')" style="margin-bottom:var(--space-4);">
        ${Icons.arrowLeft(16)} Back to E-Mart
      </button>

      <div class="product-detail-grid">
        <div>
          <div class="product-detail-img">
            ${Icons.package(64, 'rgba(25,118,210,0.3)')}
          </div>
          <div class="card" style="margin-top:var(--space-4);">
            <div style="font-size:var(--text-sm); font-weight:700; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:var(--space-3);">Provider</div>
            <div style="display:flex; align-items:center; gap:var(--space-3);">
              <div class="avatar avatar-md" style="background:var(--bg); border:1px solid var(--border); font-weight:700; color:var(--navy); font-size:13px;">
                ${DataUtils.getInitials(p.provider)}
              </div>
              <div>
                <div style="font-size:var(--text-md); font-weight:600; color:var(--text);">${p.provider}</div>
                <div style="font-size:var(--text-sm); color:var(--text-secondary);">Technology Provider</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div style="margin-bottom:var(--space-2);">
            <span class="pill pill-blue">${p.category}</span>
          </div>
          <h1 style="font-size:var(--text-2xl); font-weight:700; color:var(--navy); margin-bottom:var(--space-2); line-height:1.3;">${p.name}</h1>
          <div style="font-size:var(--text-md); color:var(--blue); margin-bottom:var(--space-5);">${p.provider}</div>

          <div class="card" style="margin-bottom:var(--space-4);">
            <div style="font-size:var(--text-sm); font-weight:600; color:var(--text-secondary); margin-bottom:var(--space-3);">Description</div>
            <div style="font-size:var(--text-base); color:var(--text); line-height:1.8;">${p.description}</div>
          </div>

          ${p.features && p.features.length ? `
          <div class="card" style="margin-bottom:var(--space-4);">
            <div style="font-size:var(--text-sm); font-weight:600; color:var(--text-secondary); margin-bottom:var(--space-3);">Key Features</div>
            <ul class="product-feature-list">
              ${p.features.map(f => `
                <li>
                  <span style="color:var(--green); flex-shrink:0;">${Icons.checkCircle(15)}</span>
                  ${f}
                </li>`).join('')}
            </ul>
          </div>` : ''}

          ${p.suitableFor ? `
          <div class="card" style="margin-bottom:var(--space-5);">
            <div style="font-size:var(--text-sm); font-weight:600; color:var(--text-secondary); margin-bottom:var(--space-2);">Suitable For</div>
            <div style="font-size:var(--text-base); color:var(--text);">${p.suitableFor}</div>
          </div>` : ''}

          <button class="btn btn-green btn-lg btn-full" onclick="EMart.openEnquiryModal('${p.id}')">
            ${Icons.mail(18)} Send Enquiry
          </button>
        </div>
      </div>`;

    // Enquiry modal
    EMart.setupEnquiryModal(p);
  },

  setupEnquiryModal(product) {
    // Create modal dynamically
    const existing = document.getElementById('enquiry-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'enquiry-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-box modal-box-lg">
        <div class="modal-header">
          <h3 class="modal-title">Send Enquiry</h3>
          <button class="modal-close" onclick="Modal.close('enquiry-modal')">${Icons.x(20)}</button>
        </div>
        <div style="font-size:var(--text-sm); color:var(--text-secondary); margin-bottom:var(--space-5); padding:var(--space-3) var(--space-4); background:var(--bg); border-radius:var(--radius-md);">
          <strong style="color:var(--text);">Product:</strong> ${product.name}<br>
          <strong style="color:var(--text);">Provider:</strong> ${product.provider}
        </div>
        <div class="form-group">
          <label class="form-label">Your Requirement <span class="required">*</span></label>
          <textarea id="enq-requirement" class="form-textarea" placeholder="Describe your specific requirement, farm details, expected volume..."></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Quantity / Units <span style="font-weight:400;">(if applicable)</span></label>
            <input id="enq-quantity" class="form-input" type="text" placeholder="e.g. 3 units, 5 MT, 2 houses" />
          </div>
          <div class="form-group">
            <label class="form-label">Timeline</label>
            <input id="enq-timeline" class="form-input" type="text" placeholder="e.g. Immediately, 3 months" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Additional Message</label>
          <textarea id="enq-message" class="form-textarea" placeholder="Any other details or questions for the provider..." style="min-height:80px;"></textarea>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-gray" onclick="Modal.close('enquiry-modal')">Cancel</button>
          <button class="btn btn-green" onclick="EMart.submitEnquiry('${product.id}', '${product.name}', '${product.provider}')">
            ${Icons.send(15)} Send Enquiry
          </button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal) Modal.close('enquiry-modal'); });
  },

  openEnquiryModal(productId) {
    Modal.open('enquiry-modal');
  },

  submitEnquiry(productId, productName, provider) {
    const requirement = document.getElementById('enq-requirement').value.trim();
    if (!requirement) { Toast.error('Please describe your requirement.'); return; }
    const quantity = document.getElementById('enq-quantity').value.trim();
    const message  = document.getElementById('enq-message').value.trim();
    PTIC_DATA.enquiries.push({
      id: 'en_' + Date.now(), productId, productName, provider,
      requirement, message, status: 'Pending',
      date: new Date().toISOString().split('T')[0], response: null,
    });
    Modal.close('enquiry-modal');
    Toast.success('✓ Enquiry sent successfully!');
  },
};

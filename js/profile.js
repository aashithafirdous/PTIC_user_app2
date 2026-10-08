// ============================================================
// PTIC – profile.js
// My Profile · Edit Profile · My Enquiries
// ============================================================

const Profile = {
  editing: false,
  editStep: 1,

  render() {
    Router.showPage('page-profile');
    const u = PTIC_DATA.currentUser;

    document.getElementById('page-profile').innerHTML = `
      <div class="profile-hero">
        ${DataUtils.avatarHTML(u, 'xl')}
        <div class="profile-hero-info">
          <div class="profile-hero-name">${u.name}</div>
          <div class="profile-hero-type">${u.type}</div>
          <div class="profile-hero-meta">
            <div class="profile-meta-item">${Icons.mapPin(14)} ${u.location}</div>
            <div class="profile-meta-item">${Icons.briefcase(14)} ${u.role}, ${u.company}</div>
            <div class="profile-meta-item">${Icons.mail(14)} ${u.email}</div>
          </div>
          <div class="profile-hero-actions">
            <button class="btn btn-navy" onclick="Profile.renderEdit()">${Icons.edit(16)} Edit Profile</button>
          </div>
        </div>
      </div>

      <div class="grid-2" style="margin-bottom:var(--space-5);">
        <div class="card">
          <div class="section-title" style="margin-bottom:var(--space-3);">About</div>
          <div style="font-size:var(--text-base); color:var(--text); line-height:1.8;">${u.about || 'No bio added yet.'}</div>
        </div>
        <div>
          <div class="card" style="margin-bottom:var(--space-4);">
            <div class="section-title" style="margin-bottom:var(--space-3);">Interests</div>
            <div class="person-tags">
              ${(u.interests || []).map(i => `<span class="tag">${i}</span>`).join('') || '<span style="color:var(--text-secondary); font-size:var(--text-sm);">No interests added yet.</span>'}
            </div>
          </div>
          <div class="card">
            <div class="section-title" style="margin-bottom:var(--space-3);">Company</div>
            <div style="font-size:var(--text-md); font-weight:600; color:var(--text);">${u.company}</div>
            <div style="font-size:var(--text-sm); color:var(--blue); margin-bottom:var(--space-2);">${u.role}</div>
            <div style="font-size:var(--text-sm); color:var(--text-secondary); line-height:1.6;">${u.companyDesc || ''}</div>
          </div>
        </div>
      </div>

      <!-- Activity Summary -->
      <div class="card" style="margin-bottom:var(--space-5);">
        <div class="section-title" style="margin-bottom:var(--space-4);">My Activity</div>
        <div class="grid-4" style="gap:0;">
          <div class="profile-stat" style="border-right:1px solid var(--border);">
            <div class="profile-stat-num">${u.questions.length}</div>
            <div class="profile-stat-label">Questions</div>
          </div>
          <div class="profile-stat" style="border-right:1px solid var(--border);">
            <div class="profile-stat-num">${u.answers.length}</div>
            <div class="profile-stat-label">Answers</div>
          </div>
          <div class="profile-stat" style="border-right:1px solid var(--border);">
            <div class="profile-stat-num">${u.connections.length}</div>
            <div class="profile-stat-label">Connections</div>
          </div>
          <div class="profile-stat">
            <div class="profile-stat-num">${u.enquiries.length}</div>
            <div class="profile-stat-label">Enquiries</div>
          </div>
        </div>
      </div>

      <!-- My Enquiries -->
      <div>
        <div class="section-header">
          <div class="section-title">My Enquiries</div>
        </div>
        ${PTIC_DATA.enquiries.length === 0 ? `
          <div class="card" style="text-align:center; padding:var(--space-8);">
            <div style="color:var(--text-secondary); font-size:var(--text-sm);">No enquiries yet. Browse E-Mart to find products and services.</div>
            <button class="btn btn-outline" style="margin-top:var(--space-4);" onclick="Router.navigate('emart')">${Icons.shoppingBag(14)} Browse E-Mart</button>
          </div>` :
          PTIC_DATA.enquiries.map(en => `
            <div class="enquiry-card">
              <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:var(--space-3);">
                <div>
                  <div class="enquiry-product">${en.productName}</div>
                  <div class="enquiry-meta">Provider: ${en.provider} · ${DataUtils.formatDate(en.date)}</div>
                  <div style="font-size:var(--text-sm); color:var(--text-secondary); line-height:1.5;">${en.requirement.slice(0, 120)}…</div>
                </div>
                <span class="pill ${en.status === 'Responded' ? 'pill-green' : en.status === 'Closed' ? 'pill-gray' : 'pill-amber'}">${en.status}</span>
              </div>
              ${en.response ? `
                <div style="margin-top:var(--space-3); padding:var(--space-3); background:var(--green-light); border-radius:var(--radius-md); font-size:var(--text-sm); color:var(--text);">
                  <strong>Response:</strong> ${en.response}
                </div>` : ''}
            </div>`).join('')}
      </div>`;
  },

  renderEdit() {
    Router.showPage('page-profile-edit');
    const u = PTIC_DATA.currentUser;

    document.getElementById('page-profile-edit').innerHTML = `
      <button class="btn btn-ghost" onclick="Router.navigate('my-profile')" style="margin-bottom:var(--space-4);">
        ${Icons.arrowLeft(16)} Back to Profile
      </button>
      <div class="page-header">
        <div class="page-title">Edit Profile</div>
      </div>

      <div style="max-width:600px;">
        <div class="card" style="margin-bottom:var(--space-4);">
          <div class="section-title" style="margin-bottom:var(--space-5);">Basic Information</div>
          <div style="display:flex; align-items:center; gap:var(--space-4); margin-bottom:var(--space-5);">
            ${DataUtils.avatarHTML(u, 'lg')}
            <button class="btn btn-outline-gray btn-sm">${Icons.camera(14)} Change Photo</button>
          </div>
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input id="edit-name" class="form-input" type="text" value="${u.name}" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Location</label>
              <input id="edit-location" class="form-input" type="text" value="${u.location}" />
            </div>
            <div class="form-group">
              <label class="form-label">Phone</label>
              <input id="edit-phone" class="form-input" type="tel" value="${u.phone}" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input id="edit-email" class="form-input" type="email" value="${u.email}" />
          </div>
        </div>

        <div class="card" style="margin-bottom:var(--space-4);">
          <div class="section-title" style="margin-bottom:var(--space-5);">About</div>
          <div class="form-group">
            <label class="form-label">About</label>
            <textarea id="edit-about" class="form-textarea" style="min-height:120px;">${u.about || ''}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Interests</label>
            <input id="edit-interests" class="form-input" type="text" value="${(u.interests || []).join(', ')}" />
            <div class="form-hint">Separate with commas</div>
          </div>
        </div>

        <div class="card" style="margin-bottom:var(--space-6);">
          <div class="section-title" style="margin-bottom:var(--space-5);">Company</div>
          <div class="form-group">
            <label class="form-label">Company Name</label>
            <input id="edit-company" class="form-input" type="text" value="${u.company}" />
          </div>
          <div class="form-group">
            <label class="form-label">Your Role</label>
            <input id="edit-role" class="form-input" type="text" value="${u.role}" />
          </div>
          <div class="form-group">
            <label class="form-label">Company Description</label>
            <textarea id="edit-company-desc" class="form-textarea">${u.companyDesc || ''}</textarea>
          </div>
        </div>

        <div style="display:flex; gap:var(--space-3);">
          <button class="btn btn-outline-gray" onclick="Router.navigate('my-profile')">Cancel</button>
          <button class="btn btn-green" onclick="Profile.saveEdit()">
            ${Icons.check(15)} Save Changes
          </button>
        </div>
      </div>`;
  },

  saveEdit() {
    const u = PTIC_DATA.currentUser;
    u.name     = document.getElementById('edit-name').value.trim() || u.name;
    u.location = document.getElementById('edit-location').value.trim() || u.location;
    u.phone    = document.getElementById('edit-phone').value.trim() || u.phone;
    u.email    = document.getElementById('edit-email').value.trim() || u.email;
    u.about    = document.getElementById('edit-about').value.trim();
    u.company  = document.getElementById('edit-company').value.trim() || u.company;
    u.role     = document.getElementById('edit-role').value.trim() || u.role;
    u.companyDesc = document.getElementById('edit-company-desc').value.trim();
    const interestStr = document.getElementById('edit-interests').value;
    u.interests = interestStr.split(',').map(s => s.trim()).filter(Boolean);

    // Update sidebar user info
    App.updateSidebarUser();
    Toast.success('✓ Profile updated successfully!');
    Router.navigate('my-profile');
  },
};

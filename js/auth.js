// ============================================================
// PTIC – auth.js
// Login · Sign Up · Onboarding · Profile Setup
// ============================================================

const Auth = {
  // Check if user is "logged in" (session flag)
  isLoggedIn() {
    return sessionStorage.getItem('ptic_logged_in') === 'true';
  },

  login(email, password) {
    if (!email || !password) {
      Toast.error('Please enter your email and password.');
      return false;
    }
    // Simulate login
    sessionStorage.setItem('ptic_logged_in', 'true');
    return true;
  },

  logout() {
    sessionStorage.removeItem('ptic_logged_in');
    Auth.showAuth();
  },

  showAuth() {
    document.getElementById('app-shell').classList.add('hidden');
    document.getElementById('auth-wrapper').classList.remove('hidden');
    Auth.renderLogin();
  },

  showApp() {
    document.getElementById('auth-wrapper').classList.add('hidden');
    document.getElementById('app-shell').classList.remove('hidden');
    App.init();
    Router.navigate('home');
  },

  renderLogin() {
    document.getElementById('auth-wrapper').innerHTML = `
      <div class="auth-card">
        <div class="auth-logo">
          <div class="auth-logo-mark">
            ${Icons.feather(28, '#fff')}
          </div>
          <div class="auth-logo-title">PTIC</div>
          <div class="auth-logo-sub">"Connect. Discover. Grow."</div>
        </div>

        <div class="form-group">
          <label class="form-label">Email / Mobile Number</label>
          <input id="login-email" class="form-input" type="text" placeholder="Enter your email or mobile" />
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input id="login-password" class="form-input" type="password" placeholder="Enter your password" />
        </div>

        <button id="login-btn" class="btn btn-navy btn-full" style="margin-bottom:var(--space-3);">Login</button>
        <div style="text-align:center; font-size:var(--text-sm); color:var(--blue); cursor:pointer; margin-bottom:var(--space-5);">Forgot Password?</div>

        <div class="auth-divider">or</div>

        <button id="email-login-btn" class="btn btn-outline btn-full" style="margin-bottom:var(--space-4);">
          ${Icons.mail(16)} Continue with Email
        </button>

        <div style="text-align:center; font-size:var(--text-sm); color:var(--text-secondary);">
          New to PTIC?
          <span id="goto-signup" style="color:var(--blue); font-weight:600; cursor:pointer; margin-left:4px;">Create Account</span>
        </div>
      </div>`;

    document.getElementById('login-btn').addEventListener('click', () => {
      const email = document.getElementById('login-email').value.trim();
      const pass  = document.getElementById('login-password').value;
      if (Auth.login(email, pass)) Auth.showApp();
    });

    document.getElementById('email-login-btn').addEventListener('click', () => {
      // Quick demo login
      sessionStorage.setItem('ptic_logged_in', 'true');
      Auth.showApp();
    });

    document.getElementById('goto-signup').addEventListener('click', () => {
      Auth.renderSignup();
    });

    // Allow Enter key
    document.getElementById('login-password').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') document.getElementById('login-btn').click();
    });
  },

  renderSignup() {
    document.getElementById('auth-wrapper').innerHTML = `
      <div class="auth-card">
        <div class="auth-logo">
          <div class="auth-logo-mark">${Icons.feather(28, '#fff')}</div>
          <div class="auth-logo-title">Create Account</div>
          <div class="auth-logo-sub">Join the PTIC community</div>
        </div>

        <div class="form-group">
          <label class="form-label">Full Name <span class="required">*</span></label>
          <input id="signup-name" class="form-input" type="text" placeholder="Your full name" />
        </div>
        <div class="form-group">
          <label class="form-label">Email <span class="required">*</span></label>
          <input id="signup-email" class="form-input" type="email" placeholder="Your email address" />
        </div>
        <div class="form-group">
          <label class="form-label">Mobile Number</label>
          <input id="signup-mobile" class="form-input" type="tel" placeholder="+91 XXXXX XXXXX" />
        </div>
        <div class="form-group">
          <label class="form-label">Password <span class="required">*</span></label>
          <input id="signup-password" class="form-input" type="password" placeholder="Create a password" />
        </div>

        <button id="signup-btn" class="btn btn-green btn-full" style="margin-bottom:var(--space-4);">Continue</button>

        <div style="text-align:center; font-size:var(--text-sm); color:var(--text-secondary);">
          Already have an account?
          <span id="goto-login" style="color:var(--blue); font-weight:600; cursor:pointer; margin-left:4px;">Login</span>
        </div>
      </div>`;

    document.getElementById('signup-btn').addEventListener('click', () => {
      const name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      if (!name || !email) { Toast.error('Please fill in required fields.'); return; }
      Auth.renderTypeSelector();
    });

    document.getElementById('goto-login').addEventListener('click', () => Auth.renderLogin());
  },

  renderTypeSelector() {
    const types = PTIC_DATA.stakeholderTypes;
    document.getElementById('auth-wrapper').innerHTML = `
      <div class="onboarding-card">
        <div class="onboarding-title">What best describes you?</div>
        <div class="onboarding-sub">This helps us personalise your PTIC experience.</div>
        <div class="type-grid" id="type-grid">
          ${types.map(t => `
            <div class="type-card" data-type="${t.id}" id="type-${t.id}">
              <div class="type-card-icon" style="background:${t.bg}; font-size:24px;">${t.icon}</div>
              <div class="type-card-label">${t.label}</div>
            </div>`).join('')}
        </div>
        <button id="type-continue" class="btn btn-navy btn-full" style="margin-top:var(--space-6);" disabled>Continue</button>
      </div>`;

    let selected = null;
    document.querySelectorAll('.type-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.type-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selected = card.dataset.type;
        document.getElementById('type-continue').disabled = false;
      });
    });

    document.getElementById('type-continue').addEventListener('click', () => {
      if (selected) Auth.renderProfileSetup(selected);
    });
  },

  renderProfileSetup(type) {
    document.getElementById('auth-wrapper').innerHTML = `
      <div class="onboarding-card" style="max-width:520px;">
        <div class="onboarding-title">Set up your profile</div>
        <div class="onboarding-sub">Help others find and connect with you.</div>

        <div class="step-indicator" id="setup-steps">
          <div class="step active" id="setup-step-1">
            <div class="step-num">1</div>
            <div class="step-label">Basic Info</div>
          </div>
          <div class="step-line" id="setup-line-1"></div>
          <div class="step" id="setup-step-2">
            <div class="step-num">2</div>
            <div class="step-label">About You</div>
          </div>
          <div class="step-line" id="setup-line-2"></div>
          <div class="step" id="setup-step-3">
            <div class="step-num">3</div>
            <div class="step-label">Company</div>
          </div>
        </div>

        <div id="setup-content"></div>
        <div style="display:flex; gap:var(--space-3); margin-top:var(--space-6);">
          <button id="setup-back" class="btn btn-outline-gray" style="display:none;">Back</button>
          <button id="setup-next" class="btn btn-green btn-full">Next</button>
        </div>
      </div>`;

    let step = 1;
    const renderStep = (s) => {
      step = s;
      [1,2,3].forEach(i => {
        const stepEl = document.getElementById(`setup-step-${i}`);
        stepEl.className = `step ${i < s ? 'done' : i === s ? 'active' : ''}`;
        if (i < 3) {
          const line = document.getElementById(`setup-line-${i}`);
          line.className = `step-line ${i < s ? 'done' : ''}`;
        }
      });

      const content = document.getElementById('setup-content');
      const backBtn = document.getElementById('setup-back');
      const nextBtn = document.getElementById('setup-next');
      backBtn.style.display = s > 1 ? 'block' : 'none';
      nextBtn.textContent = s === 3 ? 'Complete Setup' : 'Next';

      if (s === 1) {
        content.innerHTML = `
          <div class="form-group">
            <label class="form-label">Profile Photo</label>
            <div style="display:flex; align-items:center; gap:var(--space-4); padding:var(--space-3) 0;">
              <div class="avatar avatar-lg">${DataUtils.getInitials(PTIC_DATA.currentUser.name)}</div>
              <button class="btn btn-outline-gray btn-sm">${Icons.camera(14)} Upload Photo</button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input class="form-input" type="text" value="${PTIC_DATA.currentUser.name}" placeholder="Your full name" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Location</label>
              <input class="form-input" type="text" placeholder="City, State" value="${PTIC_DATA.currentUser.location}" />
            </div>
            <div class="form-group">
              <label class="form-label">Phone</label>
              <input class="form-input" type="tel" placeholder="+91 XXXXX XXXXX" value="${PTIC_DATA.currentUser.phone}" />
            </div>
          </div>`;
      } else if (s === 2) {
        content.innerHTML = `
          <div class="form-group">
            <label class="form-label">Stakeholder Type</label>
            <select class="form-select">
              ${PTIC_DATA.stakeholderTypes.map(t =>
                `<option ${t.id === type ? 'selected' : ''}>${t.label}</option>`
              ).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">About</label>
            <textarea class="form-textarea" placeholder="Tell others about yourself, your experience and what you're looking for...">${PTIC_DATA.currentUser.about}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Interests</label>
            <input class="form-input" type="text" placeholder="e.g. Biosecurity, Feed Efficiency, IoT..." value="${(PTIC_DATA.currentUser.interests || []).join(', ')}" />
            <div class="form-hint">Separate with commas</div>
          </div>`;
      } else if (s === 3) {
        content.innerHTML = `
          <div class="form-group">
            <label class="form-label">Company Name</label>
            <input class="form-input" type="text" placeholder="Your company or farm name" value="${PTIC_DATA.currentUser.company}" />
          </div>
          <div class="form-group">
            <label class="form-label">Your Role</label>
            <input class="form-input" type="text" placeholder="e.g. Owner, Manager, Director" value="${PTIC_DATA.currentUser.role}" />
          </div>
          <div class="form-group">
            <label class="form-label">Company Description</label>
            <textarea class="form-textarea" placeholder="Brief description of your company or operation...">${PTIC_DATA.currentUser.companyDesc}</textarea>
          </div>`;
      }
    };

    renderStep(1);

    document.getElementById('setup-next').addEventListener('click', () => {
      if (step < 3) { renderStep(step + 1); }
      else {
        // Complete setup
        sessionStorage.setItem('ptic_logged_in', 'true');
        Toast.success('Profile set up successfully!');
        Auth.showApp();
      }
    });

    document.getElementById('setup-back').addEventListener('click', () => {
      if (step > 1) renderStep(step - 1);
    });
  },
};

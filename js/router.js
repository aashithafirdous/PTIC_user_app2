// ============================================================
// PTIC – router.js
// Simple hash-based SPA router
// ============================================================

const Router = {
  routes: {},
  currentRoute: null,
  history: [],

  register(route, handler) {
    this.routes[route] = handler;
  },

  navigate(route, data = null) {
    // Close any open modals
    Modal.closeAll();
    // Store history
    this.history.push({ route: this.currentRoute, data: this.currentData });
    this.currentRoute = route;
    this.currentData = data;
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    // Run handler
    const handler = this.routes[route];
    if (handler) {
      handler(data);
    } else {
      console.warn('No handler for route:', route);
    }
    // Update nav
    App.updateNav(route);
    // Scroll to top
    const mc = document.getElementById('main-content');
    if (mc) mc.scrollTop = 0;
    window.scrollTo(0, 0);
  },

  back() {
    const prev = this.history.pop();
    if (prev && prev.route) {
      this.navigate(prev.route, prev.data);
    } else {
      this.navigate('home');
    }
  },

  showPage(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  },
};

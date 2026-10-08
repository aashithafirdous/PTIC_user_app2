// ============================================================
// PTIC – modals.js
// Reusable modal engine
// ============================================================

const Modal = {
  // Open a modal by ID
  open(id) {
    const el = document.getElementById(id);
    if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
  },

  // Close a modal by ID
  close(id) {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
  },

  // Close all modals
  closeAll() {
    document.querySelectorAll('.modal-overlay.open').forEach(el => {
      el.classList.remove('open');
    });
    document.body.style.overflow = '';
  },

  // Create and show a generic modal
  show({ id = 'generic-modal', title, body, confirmText = 'Confirm', cancelText = 'Cancel',
         confirmClass = 'btn-green', onConfirm, showCancel = true }) {
    // Remove existing generic modal
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = id;
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-box">
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
          <button class="modal-close" onclick="Modal.close('${id}')">${Icons.x(20)}</button>
        </div>
        <div class="modal-body">${body}</div>
        <div class="modal-footer">
          ${showCancel ? `<button class="btn btn-outline-gray" onclick="Modal.close('${id}')">${cancelText}</button>` : ''}
          <button class="btn ${confirmClass}" id="${id}-confirm">${confirmText}</button>
        </div>
      </div>`;
    document.body.appendChild(modal);

    // Close on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) Modal.close(id);
    });

    document.getElementById(`${id}-confirm`).addEventListener('click', () => {
      if (onConfirm) onConfirm();
    });

    // Animate in
    requestAnimationFrame(() => modal.classList.add('open'));
    document.body.style.overflow = 'hidden';
    return modal;
  },

  // Initialize all static modals (close on overlay click)
  initStatic() {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });
  },
};

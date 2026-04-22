(function initConfirmDialog() {
  let activeDialog = null;

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function focusPrimaryAction(dialog) {
    const primaryAction = dialog.querySelector('[data-confirm-primary]');
    if (primaryAction) {
      primaryAction.focus();
    }
  }

  function getDialogHost() {
    return document.querySelector('.app-stage') || document.getElementById('app') || document.body;
  }

  function resolveDialog(value) {
    if (!activeDialog) {
      return;
    }

    const { overlay, onResolve, previousBodyOverflow, previousHostOverflow, host } = activeDialog;
    activeDialog = null;

    document.body.style.overflow = previousBodyOverflow;
    host.style.overflow = previousHostOverflow;
    overlay.remove();
    onResolve(value);
  }

  function handleKeydown(event) {
    if (!activeDialog) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      resolveDialog(false);
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusables = Array.from(
      activeDialog.dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
    ).filter((element) => !element.disabled);

    if (focusables.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  window.showConfirmDialog = function showConfirmDialog(options = {}) {
    if (activeDialog) {
      resolveDialog(false);
    }

    const {
      eyebrow = 'Confirm action',
      title = 'Are you sure?',
      message = 'This action cannot be undone.',
      confirmLabel = 'Confirm',
      cancelLabel = 'Cancel',
      tone = 'danger',
    } = options;

    return new Promise((resolve) => {
      const host = getDialogHost();
      const overlay = document.createElement('div');
      overlay.className = 'confirm-dialog';

      const dialog = document.createElement('section');
      dialog.className = 'confirm-dialog__panel';
      dialog.setAttribute('role', 'alertdialog');
      dialog.setAttribute('aria-modal', 'true');
      dialog.setAttribute('aria-labelledby', 'confirm-dialog-title');
      dialog.setAttribute('aria-describedby', 'confirm-dialog-message');

      dialog.innerHTML = `
        <div class="confirm-dialog__halo" aria-hidden="true"></div>
        <div class="confirm-dialog__header">
          <p class="confirm-dialog__eyebrow">${escapeHtml(eyebrow)}</p>
          <h2 class="confirm-dialog__title" id="confirm-dialog-title">${escapeHtml(title)}</h2>
          <p class="confirm-dialog__message" id="confirm-dialog-message">${escapeHtml(message)}</p>
        </div>
        <div class="confirm-dialog__actions">
          <button type="button" class="confirm-dialog__button confirm-dialog__button--secondary" data-confirm-cancel>${escapeHtml(cancelLabel)}</button>
          <button type="button" class="confirm-dialog__button confirm-dialog__button--${escapeHtml(tone)}" data-confirm-primary>${escapeHtml(confirmLabel)}</button>
        </div>
      `;

      overlay.appendChild(dialog);

      const cancelButton = dialog.querySelector('[data-confirm-cancel]');
      const confirmButton = dialog.querySelector('[data-confirm-primary]');
      const previousBodyOverflow = document.body.style.overflow;
      const previousHostOverflow = host.style.overflow;

      cancelButton.addEventListener('click', () => resolveDialog(false));
      confirmButton.addEventListener('click', () => resolveDialog(true));
      overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
          resolveDialog(false);
        }
      });

      document.addEventListener('keydown', handleKeydown);

      activeDialog = {
        overlay,
        dialog,
        host,
        onResolve(value) {
          document.removeEventListener('keydown', handleKeydown);
          resolve(value);
        },
        previousBodyOverflow,
        previousHostOverflow,
      };

      document.body.style.overflow = 'hidden';
      host.style.overflow = 'hidden';
      host.appendChild(overlay);
      focusPrimaryAction(dialog);
    });
  };
})();

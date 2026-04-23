// src/scripts/utils/modal.js

const openModal = (modalId) => {
  const overlay = document.getElementById(modalId);
  if (!overlay) return;

  overlay.classList.add('modal--open');
  document.body.style.overflow = 'hidden';

  // Закриття по кліку на overlay
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal(modalId);
  });

  // Закриття по Escape
  const onEscape = (e) => {
    if (e.key === 'Escape') {
      closeModal(modalId);
      document.removeEventListener('keydown', onEscape);
    }
  };
  document.addEventListener('keydown', onEscape);
};

const closeModal = (modalId) => {
  const overlay = document.getElementById(modalId);
  if (!overlay) return;

  overlay.classList.remove('modal--open');
  document.body.style.overflow = '';
};

export { openModal, closeModal };

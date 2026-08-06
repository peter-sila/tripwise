export const showNotification = (type, message) => {
  if (!message) return;
  window.dispatchEvent(new CustomEvent('showNotification', {
    detail: {
      type: type === 'success' ? 'success' : 'error',
      message
    }
  }));
};

export const showSuccessNotification = (message) => showNotification('success', message);
export const showErrorNotification = (message) => showNotification('error', message);

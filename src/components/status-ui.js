export function createStatusUi() {
  const fallback = document.getElementById("fallback-note");

  return {
    showInitial() {},
    showDetected() {},
    showLost() {},
    hide() {},
    showFallback(message) {
      if (!fallback) {
        return;
      }

      fallback.textContent = message;
      fallback.classList.add("is-visible");
    }
  };
}

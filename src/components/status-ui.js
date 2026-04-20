export function createStatusUi() {
  const root = document.getElementById("status-ui");
  const title = document.getElementById("status-title");
  const copy = document.getElementById("status-copy");
  const fallback = document.getElementById("fallback-note");

  return {
    showInitial(message) {
      title.textContent = message;
      copy.textContent = "POPを画角に入れて検出を待ってください。";
      root.classList.remove("is-hidden", "is-compact");
    },
    showDetected(message) {
      title.textContent = message;
      copy.textContent = "認識中はキャラを再生成せず、そのまま追従表示します。";
      root.classList.remove("is-hidden");
      root.classList.add("is-compact");
    },
    showLost(message) {
      title.textContent = message;
      copy.textContent = "再び同じPOPを写すと、同じキャラ表示が戻ります。";
      root.classList.remove("is-hidden");
      root.classList.add("is-compact");
    },
    hide() {
      root.classList.add("is-hidden");
    },
    showFallback(message) {
      fallback.textContent = message;
      fallback.classList.add("is-visible");
    }
  };
}

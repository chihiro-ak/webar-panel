import { AR_CONFIG } from "./config/ar-config.js";
import { registerIdleMotionComponent } from "./components/idle-motion.js";
import { createCharacterEntity } from "./components/spawn-character.js";
import { createStatusUi } from "./components/status-ui.js";
import { loadImageSize } from "./utils/load-image-size.js";

const statusUi = createStatusUi();
const scene = document.getElementById("ar-scene");
const assetImage = document.getElementById("character-image");

registerIdleMotionComponent();
statusUi.showInitial(AR_CONFIG.ui.initialMessage);

setupScene().catch((error) => {
  console.error(error);
  statusUi.showFallback(
    "\u521d\u671f\u5316\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002trim\u6e08\u307f\u753b\u50cf\u3068 target \u30d5\u30a1\u30a4\u30eb\u306e\u914d\u7f6e\u3092\u78ba\u8a8d\u3057\u3066\u304f\u3060\u3055\u3044\u3002"
  );
});

async function setupScene() {
  const imageTarget = document.createElement("a-entity");
  imageTarget.setAttribute(
    "mindar-image-target",
    `targetIndex: ${AR_CONFIG.tracking.targetIndex}`
  );
  imageTarget.setAttribute("id", "image-target-anchor");
  scene.appendChild(imageTarget);

  assetImage.setAttribute("src", AR_CONFIG.assets.characterProcessedSrc);

  const sceneTrackingConfig = [
    `imageTargetSrc: ${AR_CONFIG.assets.targetMindSrc}`,
    `smoothing: ${AR_CONFIG.tracking.smoothing}`,
    `filterMinCF: ${AR_CONFIG.tracking.filterMinCF}`,
    `filterBeta: ${AR_CONFIG.tracking.filterBeta}`,
    `warmupTolerance: ${AR_CONFIG.tracking.warmupTolerance}`,
    `missTolerance: ${AR_CONFIG.tracking.missTolerance}`,
    "uiScanning: no",
    "uiLoading: no",
    "uiError: no",
    "maxTrack: 1"
  ].join("; ");

  scene.setAttribute("mindar-image", sceneTrackingConfig);

  const processedImage = await loadImageSize(AR_CONFIG.assets.characterProcessedSrc);

  let characterEntity = null;
  let hasSpawned = false;
  let hideUiTimerId = null;

  imageTarget.addEventListener("targetFound", () => {
    if (!hasSpawned) {
      characterEntity = createCharacterEntity({
        assetId: "character-image",
        imageWidth: processedImage.width,
        imageHeight: processedImage.height,
        visibleHeightMeters: AR_CONFIG.character.visibleHeightMeters,
        offset: AR_CONFIG.character.offset,
        idle: AR_CONFIG.character.idle
      });
      imageTarget.appendChild(characterEntity);
      hasSpawned = true;
    }

    if (characterEntity) {
      characterEntity.object3D.visible = true;
    }

    statusUi.showDetected(AR_CONFIG.ui.detectedMessage);

    window.clearTimeout(hideUiTimerId);
    hideUiTimerId = window.setTimeout(() => {
      statusUi.hide();
    }, 1800);
  });

  imageTarget.addEventListener("targetLost", () => {
    if (characterEntity) {
      characterEntity.object3D.visible = false;
    }

    window.clearTimeout(hideUiTimerId);
    statusUi.showLost(AR_CONFIG.ui.lostMessage);
  });

  scene.addEventListener("arReady", () => {
    statusUi.showInitial(AR_CONFIG.ui.initialMessage);
  });

  scene.addEventListener("arError", () => {
    statusUi.showFallback(
      "\u30ab\u30e1\u30e9\u8d77\u52d5\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002HTTPS \u307e\u305f\u306f\u540c\u4e00LAN\u78ba\u8a8d\u7528\u30b5\u30fc\u30d0\u30fc\u3067\u958b\u3044\u3066\u304f\u3060\u3055\u3044\u3002"
    );
  });
}

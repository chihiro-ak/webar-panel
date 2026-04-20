import { AR_CONFIG } from "./config/ar-config.js";
import { registerIdleMotionComponent } from "./components/idle-motion.js";
import { createCharacterEntity } from "./components/spawn-character.js";
import { createStatusUi } from "./components/status-ui.js";
import { loadImageSize } from "./utils/load-image-size.js";

const statusUi = createStatusUi();
const scene = document.getElementById("ar-scene");
const assetImage = document.getElementById("character-image");
const imageTarget = document.getElementById("image-target-anchor");

registerIdleMotionComponent();

setupScene().catch((error) => {
  console.error(error);
  statusUi.showFallback(
    "\u521d\u671f\u5316\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002trim\u6e08\u307f\u753b\u50cf\u3068 target \u30d5\u30a1\u30a4\u30eb\u306e\u914d\u7f6e\u3092\u78ba\u8a8d\u3057\u3066\u304f\u3060\u3055\u3044\u3002"
  );
});

async function setupScene() {
  assetImage.setAttribute("src", AR_CONFIG.assets.characterProcessedSrc);

  const processedImage = await loadImageSize(AR_CONFIG.assets.characterProcessedSrc);

  const characterEntity = createCharacterEntity({
    assetId: "character-image",
    imageWidth: processedImage.width,
    imageHeight: processedImage.height,
    visibleHeightMeters: AR_CONFIG.character.visibleHeightMeters,
    offset: AR_CONFIG.character.offset,
    idle: AR_CONFIG.character.idle
  });

  characterEntity.object3D.visible = false;
  imageTarget.appendChild(characterEntity);

  imageTarget.addEventListener("targetFound", () => {
    characterEntity.object3D.visible = true;
  });

  imageTarget.addEventListener("targetLost", () => {
    characterEntity.object3D.visible = false;
  });

  scene.addEventListener("arError", () => {
    statusUi.showFallback(
      "\u30ab\u30e1\u30e9\u8d77\u52d5\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002HTTPS \u307e\u305f\u306f\u540c\u4e00LAN\u78ba\u8a8d\u7528\u30b5\u30fc\u30d0\u30fc\u3067\u958b\u3044\u3066\u304f\u3060\u3055\u3044\u3002"
    );
  });
}

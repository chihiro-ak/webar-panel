export const AR_CONFIG = {
  assets: {
    targetMindSrc: "./public/assets/targets/compiled/targets.mind",
    targetPreviewSrc: "./public/assets/targets/source/target.png",
    characterSourceSrc:
      "./public/assets/char/source/Todoroki-Hajime_pr-img_02.png",
    characterProcessedSrc:
      "./public/assets/char/processed/Todoroki-Hajime_pr-img_02.trimmed.png"
  },
  character: {
    visibleHeightMeters: 2.232,
    offset: {
      x: 0.42,
      y: 0.02,
      z: 0.08
    },
    idle: {
      floatAmplitude: 0.02,
      floatSpeed: 1.15,
      yawAmplitude: 1.75,
      yawSpeed: 0.75
    }
  },
  tracking: {
    targetIndex: 0,
    smoothing: true,
    filterMinCF: 0.0001,
    filterBeta: 0.001,
    warmupTolerance: 8,
    missTolerance: 12
  },
  ui: {
    initialMessage: "卓上POPにカメラを向けてください",
    detectedMessage: "認識中: POPの横にキャラを表示しています",
    lostMessage: "POPをもう一度画角に入れると表示が戻ります"
  }
};

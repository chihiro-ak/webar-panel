#!/usr/bin/env node

const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const sourceCharacterPath = path.join(
  ROOT,
  "public",
  "assets",
  "char",
  "source",
  "Todoroki-Hajime_pr-img_02.png"
);
const processedCharacterPath = path.join(
  ROOT,
  "public",
  "assets",
  "char",
  "processed",
  "Todoroki-Hajime_pr-img_02.trimmed.png"
);
const metadataPath = path.join(
  ROOT,
  "public",
  "assets",
  "char",
  "processed",
  "Todoroki-Hajime_pr-img_02.trimmed.json"
);
const sourceTargetPath = path.join(
  ROOT,
  "public",
  "assets",
  "targets",
  "source",
  "target.png"
);
const compiledTargetPath = path.join(
  ROOT,
  "public",
  "assets",
  "targets",
  "compiled",
  "targets.mind"
);

async function ensureFileExists(filePath) {
  await fs.access(filePath);
}

async function trimCharacter() {
  const source = sharp(sourceCharacterPath);
  const { data, info } = await source
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let left = info.width;
  let top = info.height;
  let right = -1;
  let bottom = -1;

  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const alpha = data[(y * info.width + x) * 4 + 3];
      if (alpha === 0) {
        continue;
      }

      left = Math.min(left, x);
      top = Math.min(top, y);
      right = Math.max(right, x);
      bottom = Math.max(bottom, y);
    }
  }

  if (right < 0 || bottom < 0) {
    throw new Error("Character image appears fully transparent.");
  }

  const trimBox = {
    left,
    top,
    width: right - left + 1,
    height: bottom - top + 1
  };

  await sharp(sourceCharacterPath).extract(trimBox).png().toFile(processedCharacterPath);

  const metadata = {
    source: path.relative(ROOT, sourceCharacterPath).replaceAll("\\", "/"),
    processed: path.relative(ROOT, processedCharacterPath).replaceAll("\\", "/"),
    trimBox,
    sourceSize: {
      width: info.width,
      height: info.height
    },
    visibleSize: {
      width: trimBox.width,
      height: trimBox.height
    }
  };

  await fs.writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`, "utf8");
}

async function main() {
  await ensureFileExists(sourceCharacterPath);
  await ensureFileExists(sourceTargetPath);
  await ensureFileExists(compiledTargetPath);
  await trimCharacter();
  console.log("Prepared character and target assets.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

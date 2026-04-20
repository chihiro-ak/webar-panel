export function createCharacterEntity({
  assetId,
  imageWidth,
  imageHeight,
  visibleHeightMeters,
  offset,
  idle
}) {
  const aspectRatio = imageWidth / imageHeight;
  const widthMeters = visibleHeightMeters * aspectRatio;

  const entity = document.createElement("a-plane");
  entity.setAttribute("id", "spawned-character");
  entity.setAttribute("src", `#${assetId}`);
  entity.setAttribute("transparent", "true");
  entity.setAttribute("shader", "flat");
  entity.setAttribute("side", "double");
  entity.setAttribute("height", visibleHeightMeters);
  entity.setAttribute("width", widthMeters);
  entity.setAttribute("position", `${offset.x} ${visibleHeightMeters / 2 + offset.y} ${-offset.z}`);
  entity.setAttribute("material", "alphaTest: 0.01;");
  entity.setAttribute(
    "idle-motion",
    [
      `floatAmplitude: ${idle.floatAmplitude}`,
      `floatSpeed: ${idle.floatSpeed}`,
      `yawAmplitude: ${idle.yawAmplitude}`,
      `yawSpeed: ${idle.yawSpeed}`
    ].join("; ")
  );

  return entity;
}

const COMPONENT_NAME = "idle-motion";

export function registerIdleMotionComponent() {
  if (AFRAME.components[COMPONENT_NAME]) {
    return COMPONENT_NAME;
  }

  AFRAME.registerComponent(COMPONENT_NAME, {
    schema: {
      floatAmplitude: { type: "number", default: 0.02 },
      floatSpeed: { type: "number", default: 1.1 },
      yawAmplitude: { type: "number", default: 1.8 },
      yawSpeed: { type: "number", default: 0.75 }
    },

    init() {
      const { x, y, z } = this.el.object3D.position;
      const { x: pitch, y: yaw, z: roll } = this.el.object3D.rotation;

      this.basePosition = { x, y, z };
      this.baseRotation = { x: pitch, y: yaw, z: roll };
    },

    tick(time) {
      const seconds = time / 1000;
      const yOffset =
        Math.sin(seconds * this.data.floatSpeed * Math.PI * 2) *
        this.data.floatAmplitude;
      const yawOffset =
        Math.sin(seconds * this.data.yawSpeed * Math.PI * 2) *
        AFRAME.utils.math.degToRad(this.data.yawAmplitude);

      this.el.object3D.position.y = this.basePosition.y + yOffset;
      this.el.object3D.rotation.y = this.baseRotation.y + yawOffset;
    }
  });

  return COMPONENT_NAME;
}

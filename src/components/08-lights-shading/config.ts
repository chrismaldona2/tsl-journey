import type { Vector3Tuple } from "three";

export type LightShadingParams = {
  ambientLight: {
    color: string;
    intensity: number;
  };
  directionalLight: {
    color: string;
    intensity: number;
    position: Vector3Tuple;
    target: Vector3Tuple;
    specularPower: number;
  };
  pointLight: {
    color: string;
    intensity: number;
    position: Vector3Tuple;
    decay: number;
    specularPower: number;
  };
};

export const lightShadingConfig: LightShadingParams = {
  ambientLight: {
    color: "#ffffff",
    intensity: 0.03,
  },
  directionalLight: {
    color: "#1a1aff",
    intensity: 1,
    position: [12.8, 0, 1.5],
    target: [13, 0, 0],
    specularPower: 20,
  },
  pointLight: {
    color: "#ff1a1a",
    intensity: 1,
    position: [12.1, 0.8, 0],
    decay: 0.6,
    specularPower: 20,
  },
};

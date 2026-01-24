import type { Vector3Tuple } from "three";

export type HalftoneShadingSettings = {
  halftone: {
    repetition: number;
    direction: Vector3Tuple;
    color: string;
  };
  ambientLight: {
    color: string;
    intensity: number;
  };
  pointLight: {
    color: string;
    intensity: number;
    position: Vector3Tuple;
    decay: number;
    specularPower: number;
  };
};

export const HalftoneShadingConfig: HalftoneShadingSettings = {
  halftone: {
    repetition: 100,
    direction: [0, -1, 0],
    color: "purple",
  },
  ambientLight: {
    color: "#ffffff",
    intensity: 0.3,
  },
  pointLight: {
    color: "#ffffff",
    intensity: 1.5,
    position: [17.5, 0.25, 0],
    decay: 0.5,
    specularPower: 50,
  },
};

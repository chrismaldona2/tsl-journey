import type { Vector3Tuple } from "three";

type HalftonePassParams = {
  density: number;
  direction: Vector3Tuple;
  color: string;
  maskLow: number;
  maskHigh: number;
};

export type HalftoneShadingParams = {
  halftone: {
    shadows: HalftonePassParams;
    highlights: HalftonePassParams;
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

export const HalftoneShadingConfig: HalftoneShadingParams = {
  halftone: {
    shadows: {
      density: 100,
      direction: [0, -1, 0],
      color: "purple",
      maskLow: -0.8,
      maskHigh: 1.5,
    },
    highlights: {
      density: 120,
      direction: [0, 1, 0],
      color: "#ffffff",
      maskLow: 0.5,
      maskHigh: 1.0,
    },
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

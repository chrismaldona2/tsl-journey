import type { Vector2Tuple } from "three";

export type CoffeeSteamParams = {
  steamColor: string;
  riseSpeed: number;
  cloudScale: Vector2Tuple;
  erosion: number;
  twistAmplitude: number;
  twistNoiseScale: number;
  twistSpeed: number;
  windAmplitude: number;
  windSpeed: number;
  edgeFadeStart: number;
  edgeFadeDistance: number;
};

export const CoffeeSteamConfig: CoffeeSteamParams = {
  steamColor: "#bdbdbd",
  riseSpeed: 0.5,
  cloudScale: [0.5, 0.3],
  erosion: 0.35,
  twistAmplitude: 10,
  twistNoiseScale: 0.2,
  twistSpeed: 0.01,
  windAmplitude: 6,
  windSpeed: 0.025,
  edgeFadeStart: 0,
  edgeFadeDistance: 0.5,
};

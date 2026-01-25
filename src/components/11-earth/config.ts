import { type Vector3Tuple } from "three";

export type AtmosphereParams = {
  sunDirection: Vector3Tuple;
  atmosphereDayColor: string;
  atmosphereTwilightColor: string;
};

export type EarthParams = {
  thresholdLow: number;
  thresholdHigh: number;
  sunDirection: Vector3Tuple;
  cloudsColor: string;
  cloudsThresholdLow: number;
  cloudsThresholdHigh: number;
  fresnelPower: number;
  specularPower: number;
  specularColor: string;
} & AtmosphereParams;

export const earthConfig: EarthParams = {
  thresholdLow: -0.25,
  thresholdHigh: 0.5,
  sunDirection: [0, 0, 1],
  cloudsColor: "#ffffff",
  cloudsThresholdLow: 0.5,
  cloudsThresholdHigh: 1,
  atmosphereDayColor: "#00aaff",
  atmosphereTwilightColor: "#ff6600",
  fresnelPower: 3,
  specularPower: 40,
  specularColor: "#ffffff",
};

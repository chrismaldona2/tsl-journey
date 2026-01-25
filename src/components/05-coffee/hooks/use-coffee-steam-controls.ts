import { useControls } from "leva";
import { useRef } from "react";
import type { useCoffeeSteamMaterial } from "./use-coffee-steam-material";
import { CoffeeSteamConfig as config } from "../config";

type CoffeeSteamUniforms = ReturnType<
  typeof useCoffeeSteamMaterial
>["uniforms"];

export function useCoffeeSteamControls(uniforms: CoffeeSteamUniforms) {
  const uniformsRef = useRef(uniforms);

  useControls(
    "☕ 5 — Coffee Steam",
    {
      steamColor: {
        label: "Steam Color",
        value: config.steamColor,
        onChange: (v) => uniformsRef.current.steamColor.value.set(v),
      },
      riseSpeed: {
        label: "Rise Speed",
        value: config.riseSpeed,
        min: 0,
        max: 2,
        onChange: (v) => {
          uniformsRef.current.riseSpeed.value = v;
        },
      },
      cloudScale: {
        label: "Cloud Scale",
        value: config.cloudScale,
        joystick: false,
        onChange: (v) => uniformsRef.current.cloudScale.value.set(v.x, v.y),
      },
      erosion: {
        label: "Erosion",
        value: config.erosion,
        min: 0,
        max: 1,
        onChange: (v) => {
          uniformsRef.current.erosion.value = v;
        },
      },
      twistAmplitude: {
        label: "Twist Amplitude",
        value: config.twistAmplitude,
        min: 0,
        max: 20,
        onChange: (v) => {
          uniformsRef.current.twistAmplitude.value = v;
        },
      },
      twistNoiseScale: {
        label: "Twist Noise Scale",
        value: config.twistNoiseScale,
        min: 0,
        max: 2,
        onChange: (v) => {
          uniformsRef.current.twistNoiseScale.value = v;
        },
      },
      twistSpeed: {
        label: "Twist Speed",
        value: config.twistSpeed,
        min: 0,
        max: 0.1,
        onChange: (v) => {
          uniformsRef.current.twistSpeed.value = v;
        },
      },
      windAmplitude: {
        label: "Wind Amplitude",
        value: config.windAmplitude,
        min: 0,
        max: 20,
        onChange: (v) => {
          uniformsRef.current.windAmplitude.value = v;
        },
      },
      windSpeed: {
        label: "Wind Speed",
        value: config.windSpeed,
        min: 0,
        max: 0.5,
        onChange: (v) => {
          uniformsRef.current.windSpeed.value = v;
        },
      },

      edgeFadeStart: {
        label: "Edge Fade Start",
        value: config.edgeFadeStart,
        min: 0,
        max: 0.5,
        onChange: (v) => {
          uniformsRef.current.edgeFadeStart.value = v;
        },
      },
      edgeFadeDistance: {
        label: "Edge Fade Dist",
        value: config.edgeFadeDistance,
        min: 0,
        max: 1,
        onChange: (v) => {
          uniformsRef.current.edgeFadeDistance.value = v;
        },
      },
    },
    { collapsed: true },
  );
}

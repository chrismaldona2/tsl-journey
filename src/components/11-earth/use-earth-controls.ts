/* eslint-disable react-hooks/refs */
import { useControls } from "leva";
import { useRef } from "react";
import type useEarthMaterial from "./use-earth-material";
import { earthConfig as config } from "./config";
import { Spherical, Vector3, type Mesh } from "three";
import type useAtmosphereMaterial from "./use-atmosphere-material";

type EarthUniforms = ReturnType<typeof useEarthMaterial>["uniforms"];
type AtmosphereUniforms = ReturnType<typeof useAtmosphereMaterial>["uniforms"];

export default function useEarthControls(
  earthUniforms: EarthUniforms,
  atmosphereUniforms: AtmosphereUniforms,
) {
  const earthUniformsRef = useRef(earthUniforms);
  const atmosphereUniformsRef = useRef(atmosphereUniforms);

  const lightHelperRef = useRef<Mesh>(null);

  const tempSpherical = useRef(
    new Spherical().setFromVector3(new Vector3(...config.sunDirection)),
  );
  const tempVector = useRef(new Vector3(...config.sunDirection));

  useControls(
    "🌍 11 — Earth",
    {
      thresholdLow: {
        label: "Threshold Low",
        value: config.thresholdLow,
        min: -1,
        max: 1,
        step: 0.001,
        onChange: (v) => {
          earthUniformsRef.current.thresholdLow.value = v;
        },
      },
      thresholdHigh: {
        label: "Threshold High",
        value: config.thresholdHigh,
        min: -1,
        max: 1,
        step: 0.001,
        onChange: (v) => {
          earthUniformsRef.current.thresholdHigh.value = v;
        },
      },

      radius: {
        label: "Radius",
        value: tempSpherical.current.radius,
        min: 0,
        max: 2,
        onChange: (v) => {
          tempSpherical.current.radius = v;
          const newSunDirection = tempVector.current.setFromSpherical(
            tempSpherical.current,
          );

          earthUniformsRef.current.sunDirection.value.copy(newSunDirection);
          atmosphereUniformsRef.current.sunDirection.value.copy(
            newSunDirection,
          );

          if (lightHelperRef.current) {
            lightHelperRef.current.position.copy(newSunDirection);
          }
        },
      },

      phi: {
        label: "Phi",
        value: tempSpherical.current.phi,
        min: 0,
        max: Math.PI,
        onChange: (v) => {
          tempSpherical.current.phi = v;
          const newSunDirection = tempVector.current.setFromSpherical(
            tempSpherical.current,
          );

          earthUniformsRef.current.sunDirection.value.copy(newSunDirection);
          atmosphereUniformsRef.current.sunDirection.value.copy(
            newSunDirection,
          );

          if (lightHelperRef.current) {
            lightHelperRef.current.position.copy(newSunDirection);
          }
        },
      },

      theta: {
        label: "Tetha",
        value: tempSpherical.current.theta,
        min: -Math.PI,
        max: Math.PI,
        onChange: (v) => {
          tempSpherical.current.theta = v;
          const newSunDirection = tempVector.current.setFromSpherical(
            tempSpherical.current,
          );

          earthUniformsRef.current.sunDirection.value.copy(newSunDirection);
          atmosphereUniformsRef.current.sunDirection.value.copy(
            newSunDirection,
          );

          if (lightHelperRef.current) {
            lightHelperRef.current.position.copy(newSunDirection);
          }
        },
      },

      cloudsColor: {
        label: "Clouds Color",
        value: config.cloudsColor,
        onChange: (v) => {
          earthUniformsRef.current.cloudsColor.value.set(v);
        },
      },

      atmosphereDayColor: {
        label: "Atmosphere Day Color",
        value: config.atmosphereDayColor,
        onChange: (v) => {
          earthUniformsRef.current.atmosphereDayColor.value.set(v);
          atmosphereUniformsRef.current.atmosphereDayColor.value.set(v);
        },
      },
      atmosphereTwilightColor: {
        label: "Atmosphere Twilight Color",
        value: config.atmosphereTwilightColor,
        onChange: (v) => {
          earthUniformsRef.current.atmosphereTwilightColor.value.set(v);
          atmosphereUniformsRef.current.atmosphereTwilightColor.value.set(v);
        },
      },
    },
    { collapsed: true },
  );

  return { lightHelperRef };
}

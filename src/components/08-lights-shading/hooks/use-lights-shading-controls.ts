/* eslint-disable react-hooks/refs */
import { useControls, folder } from "leva";
import { useRef } from "react";
import type { useLightsShadingMaterial } from "./use-lights-shading-material";
import { type Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import { lightShadingConfig as config } from "../config";

export type LightsShadingUniforms = ReturnType<
  typeof useLightsShadingMaterial
>["uniforms"];

export function useLightsShadingControls(uniforms: LightsShadingUniforms) {
  const uniformsRef = useRef(uniforms);
  useControls(
    "✨ 8 — Lights Shading",
    {
      "Ambient Light": folder(
        {
          ambLightColor: {
            label: "Color",
            value: config.ambientLight.color,
            onChange: (v) =>
              uniformsRef.current.ambientLight.color.value.set(v),
          },
          ambLightIntensity: {
            label: "Intensity",
            value: config.ambientLight.intensity,
            min: 0,
            max: 1,
            step: 0.001,
            onChange: (v) => {
              uniformsRef.current.ambientLight.intensity.value = v;
            },
          },
        },
        { collapsed: true },
      ),

      "Directional Light": folder(
        {
          dirLightColor: {
            label: "Color",
            value: config.directionalLight.color,
            onChange: (v) => {
              uniformsRef.current.directionalLight.color.value.set(v);
            },
          },
          dirLightIntensity: {
            label: "Intensity",
            value: config.directionalLight.intensity,
            min: 0,
            max: 5,
            onChange: (v) => {
              uniformsRef.current.directionalLight.intensity.value = v;
            },
          },
          dirLightPos: {
            label: "Position",
            value: config.directionalLight.position,
            onChange: (v: typeof config.directionalLight.position) => {
              uniformsRef.current.directionalLight.position.value.set(...v);
            },
          },
          dirLightTar: {
            label: "Target",
            value: config.directionalLight.target,
            onChange: (v: typeof config.directionalLight.target) => {
              uniformsRef.current.directionalLight.target.value.set(...v);
            },
          },

          dirLightSpecular: {
            label: "Specular Power",
            value: config.directionalLight.specularPower,
            min: 1,
            max: 100,
            onChange: (v) => {
              uniformsRef.current.directionalLight.specularPower.value = v;
            },
          },
        },
        { collapsed: true },
      ),
      "Point Light": folder(
        {
          pointLightColor: {
            label: "Color",
            value: config.pointLight.color,
            onChange: (v) => {
              uniformsRef.current.pointLight.color.value.set(v);
            },
          },
          pointLightIntensity: {
            label: "Intensity",
            value: config.pointLight.intensity,
            min: 0,
            max: 5,
            onChange: (v) => {
              uniformsRef.current.pointLight.intensity.value = v;
            },
          },
          pointLightPos: {
            label: "Position",
            value: config.pointLight.position,
            onChange: (v: typeof config.pointLight.position) => {
              uniformsRef.current.pointLight.position.value.set(...v);
            },
          },

          pointLightDecay: {
            label: "Decay",
            value: config.pointLight.decay,
            min: 0,
            max: 2,
            onChange: (v) => {
              uniformsRef.current.pointLight.decay.value = v;
            },
          },
          pointLightSpecular: {
            label: "Specular Power",
            value: config.pointLight.specularPower,
            min: 1,
            max: 100,
            onChange: (v) => {
              uniformsRef.current.pointLight.specularPower.value = v;
            },
          },
        },
        { collapsed: true },
      ),
    },
    { collapsed: true },
  );

  const dirLgtHelperRef = useRef<Mesh>(null);
  const pointLgtHelperRef = useRef<Mesh>(null);

  useFrame(() => {
    if (!dirLgtHelperRef.current || !pointLgtHelperRef.current) return;

    dirLgtHelperRef.current.position.copy(
      uniformsRef.current.directionalLight.position.value,
    );
    pointLgtHelperRef.current.position.copy(
      uniformsRef.current.pointLight.position.value,
    );
  });

  return { dirLgtHelperRef, pointLgtHelperRef };
}

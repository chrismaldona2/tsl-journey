/* eslint-disable react-hooks/refs */
import { useControls, folder } from "leva";
import type useHalftoneShadingMaterial from "./use-halftone-shading-material";
import { useRef } from "react";
import { HalftoneShadingConfig as config } from "../config";

type HalftoneShadingUniforms = ReturnType<
  typeof useHalftoneShadingMaterial
>["uniforms"];

export default function useHalftoneShadingControls(
  uniforms: HalftoneShadingUniforms,
) {
  const uniformsRef = useRef(uniforms);

  useControls(
    "🌗 10 — Halftone Shading",
    {
      Halftone: folder(
        {
          Shadows: folder({
            shadowColor: {
              label: "Color",
              value: config.halftone.shadows.color,
              onChange: (v) => {
                uniformsRef.current.halftone.shadows.color.value.set(v);
              },
            },
            shadowDensity: {
              label: "Density",
              value: config.halftone.shadows.density,
              min: 1,
              max: 300,
              step: 1,
              onChange: (v) => {
                uniformsRef.current.halftone.shadows.density.value = v;
              },
            },
            shadowDirection: {
              label: "Direction",
              value: config.halftone.shadows.direction,
              onChange: (v: typeof config.halftone.shadows.direction) => {
                uniformsRef.current.halftone.shadows.direction.value.set(...v);
              },
            },
            shadowMaskLow: {
              label: "Mask Low",
              value: config.halftone.shadows.maskLow,
              min: -1.5,
              max: 1.5,
              step: 0.1,
              onChange: (v) => {
                uniformsRef.current.halftone.shadows.maskLow.value = v;
              },
            },
            shadowMaskHigh: {
              label: "Mask High",
              value: config.halftone.shadows.maskHigh,
              min: -1.5,
              max: 1.5,
              step: 0.1,
              onChange: (v) => {
                uniformsRef.current.halftone.shadows.maskHigh.value = v;
              },
            },
          }),

          Highlights: folder({
            highlightColor: {
              label: "Color",
              value: config.halftone.highlights.color,
              onChange: (v) => {
                uniformsRef.current.halftone.highlights.color.value.set(v);
              },
            },
            highlightDensity: {
              label: "Density",
              value: config.halftone.highlights.density,
              min: 1,
              max: 300,
              step: 1,
              onChange: (v) => {
                uniformsRef.current.halftone.highlights.density.value = v;
              },
            },
            highlightDirection: {
              label: "Direction",
              value: config.halftone.highlights.direction,
              onChange: (v: typeof config.halftone.highlights.direction) => {
                uniformsRef.current.halftone.highlights.direction.value.set(
                  ...v,
                );
              },
            },
            highlightMaskLow: {
              label: "Mask Low",
              value: config.halftone.highlights.maskLow,
              min: -1.5,
              max: 1.5,
              step: 0.1,
              onChange: (v) => {
                uniformsRef.current.halftone.highlights.maskLow.value = v;
              },
            },
            highlightMaskHigh: {
              label: "Mask High",
              value: config.halftone.highlights.maskHigh,
              min: -1.5,
              max: 1.5,
              step: 0.1,
              onChange: (v) => {
                uniformsRef.current.halftone.highlights.maskHigh.value = v;
              },
            },
          }),
        },
        { collapsed: false },
      ),

      Lights: folder(
        {
          "Ambient Light": folder({
            ambientColor: {
              label: "Color",
              value: config.ambientLight.color,
              onChange: (v) => {
                uniformsRef.current.ambientLight.color.value.set(v);
              },
            },
            ambientIntensity: {
              label: "Intensity",
              value: config.ambientLight.intensity,
              min: 0,
              max: 2,
              step: 0.1,
              onChange: (v) => {
                uniformsRef.current.ambientLight.intensity.value = v;
              },
            },
          }),

          "Point Light": folder({
            pointColor: {
              label: "Color",
              value: config.pointLight.color,
              onChange: (v) => {
                uniformsRef.current.pointLight.color.value.set(v);
              },
            },
            pointIntensity: {
              label: "Intensity",
              value: config.pointLight.intensity,
              min: 0,
              max: 10,
              step: 0.1,
              onChange: (v) => {
                uniformsRef.current.pointLight.intensity.value = v;
              },
            },
            pointPosition: {
              label: "Position",
              value: config.pointLight.position,
              onChange: (v: typeof config.pointLight.position) => {
                uniformsRef.current.pointLight.position.value.set(...v);
              },
            },
            pointDecay: {
              label: "Decay",
              value: config.pointLight.decay,
              min: 0,
              max: 5,
              step: 0.1,
              onChange: (v) => {
                uniformsRef.current.pointLight.decay.value = v;
              },
            },
            pointSpecular: {
              label: "Specular Power",
              value: config.pointLight.specularPower,
              min: 1,
              max: 200,
              step: 1,
              onChange: (v) => {
                uniformsRef.current.pointLight.specularPower.value = v;
              },
            },
          }),
        },
        { collapsed: true },
      ),
    },
    { collapsed: true },
  );
}

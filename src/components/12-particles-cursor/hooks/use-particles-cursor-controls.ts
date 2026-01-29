import { useControls } from "leva";
import type useParticlesCursorMaterial from "./use-particles-cursor-material";
import { particlesCursorConfig as config } from "../config";
import { useEffect, useRef } from "react";

type HookReturn = ReturnType<typeof useParticlesCursorMaterial>;
type ParticlesCursorUniforms = NonNullable<HookReturn>["uniforms"];

export function useParticlesCursorControls(uniforms?: ParticlesCursorUniforms) {
  const uniformsRef = useRef(uniforms);
  useEffect(() => {
    uniformsRef.current = uniforms; // Uniforms can be undefined at the first render if the 'glow texture' or the canvas take time to initialize, so we update the ref if the 'uniforms' prop change
  }, [uniforms]);

  useControls("🖱️ 12 — Particles Cursor", {
    particleSize: {
      label: "Particle Size",
      value: config.particleSize,
      min: 0,
      max: 1,
      step: 0.001,
      onChange: (v) => {
        if (uniformsRef.current) {
          uniformsRef.current.particleSize.value = v;
        }
      },
    },
    displacementIntensity: {
      label: "Displacement Intensity",
      value: config.displacementIntensity,
      min: 0,
      max: 2,
      step: 0.001,
      onChange: (v) => {
        if (uniformsRef.current)
          uniformsRef.current.displacementIntensity.value = v;
      },
    },
    colorPower: {
      label: "Color Power",
      value: config.colorPower,
      min: 1,
      max: 8,
      step: 1,
      onChange: (v) => {
        if (uniformsRef.current) uniformsRef.current.colorPower.value = v;
      },
    },
    gridSpacing: {
      label: "Grid Spacing",
      value: config.gridSpacing,
      min: 0,
      max: 0.1,
      step: 0.0001,
      onChange: (v) => {
        if (uniformsRef.current) uniformsRef.current.gridSpacing.value = v;
      },
    },
  });
}

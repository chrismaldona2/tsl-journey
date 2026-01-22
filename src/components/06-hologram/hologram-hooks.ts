import { useControls } from "leva";
import { useMemo, useRef } from "react";
import {
  uniform,
  color,
  positionWorld,
  time,
  dot,
  normalWorld,
  cameraPosition,
  smoothstep,
  vec3,
  positionLocal,
  sin,
  div,
} from "three/tsl";
import { random2D } from "../../shaders/random";

export function useHologramMaterial() {
  return useMemo(() => {
    /* Uniforms */
    const baseColor = uniform(color("#70c1ff"));
    const scanlineSpeed = uniform(0.02);
    const scanlineDensity = uniform(50);
    const scanlineSharpness = uniform(2);
    const fresnelPower = uniform(2);
    const fresnelIntensity = uniform(1.25);
    const falloffParams = uniform(0.8);
    const glitchAmplitude = uniform(0.5);
    const glitchThreshold = uniform(0.3);

    /* Position Node Setup */
    // Glitch
    const glitchTime = time.sub(positionLocal.y);
    const glitchFrequence = div(
      sin(glitchTime)
        .add(sin(glitchTime.mul(3.45)))
        .add(sin(glitchTime.mul(8.76))),
      3,
    );
    const glithStrength = glitchFrequence
      .smoothstep(glitchThreshold, 1.0)
      .mul(glitchAmplitude);
    const glitchX = random2D(positionLocal.xz.add(time))
      .sub(0.5)
      .mul(glithStrength);
    const glitchZ = random2D(positionLocal.zx.add(time))
      .sub(0.5)
      .mul(glithStrength);

    const glitchOffset = vec3(glitchX, 0, glitchZ);

    const positionNode = positionLocal.add(glitchOffset);

    /* Color Node Setup */
    const colorNode = baseColor;

    /* Opacity Node Setup */
    // Stripes
    const stripesPattern = positionWorld.y
      .sub(time.mul(scanlineSpeed))
      .mul(scanlineDensity)
      .mod(1)
      .pow(scanlineSharpness);

    // Fresnel
    const worldViewDirection = positionWorld.sub(cameraPosition).normalize();
    const fresnel = dot(worldViewDirection, normalWorld)
      .abs()
      .negate()
      .add(1)
      .pow(fresnelPower);

    // Falloff
    const falloff = smoothstep(falloffParams, 0.0, fresnel);

    const opacityNode = stripesPattern
      .mul(fresnel)
      .add(fresnel.mul(fresnelIntensity))
      .mul(falloff);

    return {
      nodes: {
        colorNode,
        opacityNode,
        positionNode,
      },
      uniforms: {
        baseColor,
        scanlineSpeed,
        scanlineDensity,
        scanlineSharpness,
        fresnelPower,
        fresnelIntensity,
        falloffParams,
        glitchAmplitude,
        glitchThreshold,
      },
    };
  }, []);
}

type HologramUniforms = ReturnType<typeof useHologramMaterial>["uniforms"];

export function useHologramControls(uniforms: HologramUniforms) {
  const uniformsRef = useRef(uniforms);

  useControls(
    "🔮 6 — Hologram",
    {
      baseColor: {
        label: "Color",
        value: "#70c1ff",
        onChange: (v) => uniformsRef.current.baseColor.value.set(v),
      },
      scanlineSpeed: {
        label: "Scan Speed",
        value: 0.02,
        min: -0.1,
        max: 0.2,
        step: 0.001,
        onChange: (v) => (uniformsRef.current.scanlineSpeed.value = v),
      },
      scanlineDensity: {
        label: "Scan Density",
        value: 50,
        min: 1,
        max: 150,
        onChange: (v) => (uniformsRef.current.scanlineDensity.value = v),
      },
      scanlineSharpness: {
        label: "Scan Sharpness",
        value: 2,
        min: 1,
        max: 10,
        onChange: (v) => (uniformsRef.current.scanlineSharpness.value = v),
      },
      fresnelPower: {
        label: "Fresnel Power",
        value: 2,
        min: 0,
        max: 10,
        onChange: (v) => (uniformsRef.current.fresnelPower.value = v),
      },
      fresnelIntensity: {
        label: "Fresnel Boost",
        value: 1.25,
        min: 0,
        max: 5,
        onChange: (v) => (uniformsRef.current.fresnelIntensity.value = v),
      },
      falloffParams: {
        label: "Core Falloff",
        value: 0.8,
        min: 0,
        max: 1,
        step: 0.01,
        onChange: (v) => (uniformsRef.current.falloffParams.value = v),
      },
      glitchAmplitude: {
        label: "Glitch Strength",
        value: 0.5,
        min: 0,
        max: 5,
        onChange: (v) => (uniformsRef.current.glitchAmplitude.value = v),
      },
      glitchThreshold: {
        label: "Glitch Freq",
        value: 0.3,
        min: 0,
        max: 1,
        step: 0.01,
        onChange: (v) => (uniformsRef.current.glitchThreshold.value = v),
      },
    },
    { collapsed: true },
  );
}

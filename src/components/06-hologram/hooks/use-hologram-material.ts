import { random2D } from "@/shaders/random";
import { useMemo } from "react";
import {
  uniform,
  color,
  positionLocal,
  div,
  sin,
  vec3,
  positionWorld,
  cameraPosition,
  dot,
  normalWorld,
  smoothstep,
  time,
} from "three/tsl";
import { type HologramParams, HologramConfig as config } from "../config";
import type { UniformSet } from "@/types/uniforms";

export function useHologramMaterial() {
  return useMemo(() => {
    /* Uniforms */
    const uniforms: UniformSet<HologramParams> = {
      color: uniform(color(config.color)),
      scanlineDensity: uniform(config.scanlineDensity),
      scanlineSharpness: uniform(config.scanlineSharpness),
      scanlineSpeed: uniform(config.scanlineSpeed),
      fresnelIntensity: uniform(config.fresnelIntensity),
      fresnelFalloff: uniform(config.fresnelFalloff),
      fresnelPower: uniform(config.fresnelPower),
      glitchAmplitude: uniform(config.glitchAmplitude),
      glitchThreshold: uniform(config.glitchThreshold),
    };

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
      .smoothstep(uniforms.glitchThreshold, 1.0)
      .mul(uniforms.glitchAmplitude);
    const glitchX = random2D(positionLocal.xz.add(time))
      .sub(0.5)
      .mul(glithStrength);
    const glitchZ = random2D(positionLocal.zx.add(time))
      .sub(0.5)
      .mul(glithStrength);

    const glitchOffset = vec3(glitchX, 0, glitchZ);

    const positionNode = positionLocal.add(glitchOffset);

    /* Color Node Setup */
    const colorNode = uniforms.color;

    /* Opacity Node Setup */
    // Stripes
    const stripesPattern = positionWorld.y
      .sub(time.mul(uniforms.scanlineSpeed))
      .mul(uniforms.scanlineDensity)
      .mod(1)
      .pow(uniforms.scanlineSharpness);

    // Fresnel
    const worldViewDirection = positionWorld.sub(cameraPosition).normalize();
    const fresnel = dot(worldViewDirection, normalWorld)
      .abs()
      .negate()
      .add(1)
      .pow(uniforms.fresnelPower);

    // Falloff
    const falloff = smoothstep(uniforms.fresnelFalloff, 0.0, fresnel);

    const opacityNode = stripesPattern
      .mul(fresnel)
      .add(fresnel.mul(uniforms.fresnelIntensity))
      .mul(falloff);

    return {
      nodes: {
        colorNode,
        opacityNode,
        positionNode,
      },
      uniforms,
    };
  }, []);
}

/* eslint-disable react-hooks/purity */
import { useMemo, useEffect } from "react";
import { Spherical, Vector3, InstancedBufferAttribute } from "three";
import {
  instancedBufferAttribute,
  uv,
  vec2,
  mix,
  texture,
  uniform,
  color,
} from "three/tsl";
import { fireworkConfig as config, type FireworkParams } from "../config";
import { useRandomFireworkTex } from "./use-random-firework-tex";
import gsap from "gsap";
import {
  getExplosionFactor,
  getFallingOffset,
  getScalingFactor,
  getTwinklingFactor,
} from "../nodes";
import type { UniformSet } from "@/types/uniforms";

/*
 *
 * "CPU" refers to the data (initial positions and sizes) generation strategy, not the rendering or animation.
 *
 */
type UseFireworkCPUProps = {
  params?: Partial<FireworkParams>;
  onAnimationComplete?: () => void;
};

export function useFireworkCPU({
  params,
  onAnimationComplete,
}: UseFireworkCPUProps) {
  const sparkTexture = useRandomFireworkTex();

  const { nodes, uniforms } = useMemo(() => {
    const merged = { ...config, ...params };
    const uniforms: UniformSet<
      Omit<FireworkParams, "fullGPU" | "particleCount">
    > = {
      insideColor: uniform(color(merged.insideColor)),
      outsideColor: uniform(color(merged.outsideColor)),
      colorBias: uniform(merged.colorBias),
      particleSize: uniform(merged.particleSize),
      explosionRadius: uniform(merged.explosionRadius),
      explosionEasing: uniform(merged.explosionEasing),
      fallEasing: uniform(merged.fallEasing),
      twinkleAmplitude: uniform(merged.twinkleAmplitude),
      twinkleFrequency: uniform(merged.twinkleFrequency),
      progress: uniform(merged.progress),
    };

    /*
     *
     * Data Generation
     *
     */
    const particleCount = merged.particleCount;

    const arrays = {
      positions: new Float32Array(particleCount * 3),
      sizes: new Float32Array(particleCount),
      timeMultipliers: new Float32Array(particleCount),
    };
    const temps = {
      spherical: new Spherical(),
      vec: new Vector3(),
    };
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const sPos = temps.spherical.set(
        uniforms.explosionRadius.value * (0.75 + Math.random() * 0.25),
        Math.random() * Math.PI,
        Math.random() * Math.PI * 2,
      );
      const vPos = temps.vec.setFromSpherical(sPos);
      arrays.positions[i3] = vPos.x;
      arrays.positions[i3 + 1] = vPos.y;
      arrays.positions[i3 + 2] = vPos.z;
      arrays.sizes[i] =
        (Math.random() * 0.7 + 0.3) * uniforms.particleSize.value;
      arrays.timeMultipliers[i] = 1 + Math.random();
    }
    const attributes = {
      position: new InstancedBufferAttribute(arrays.positions, 3),
      size: new InstancedBufferAttribute(arrays.sizes, 1),
      timeMultiplier: new InstancedBufferAttribute(arrays.timeMultipliers, 1),
    };

    const position = instancedBufferAttribute(attributes.position);
    const size = instancedBufferAttribute(attributes.size);

    /*
     *
     * Animations Timing
     *
     */
    const timeMultiplier = instancedBufferAttribute(attributes.timeMultiplier);
    const animationProgress = uniforms.progress.mul(timeMultiplier);

    /*
     *
     * Position Animation
     *
     */
    const explosion = getExplosionFactor({
      progress: animationProgress,
      easing: uniforms.explosionEasing,
    });
    const fallingOffset = getFallingOffset({
      progress: animationProgress,
      easing: uniforms.fallEasing,
    });
    const positionNode = position.mul(explosion).add(fallingOffset);

    /*
     *
     * Size Animation
     *
     */
    const scaling = getScalingFactor({ progress: animationProgress });
    const twinkling = getTwinklingFactor({
      progress: animationProgress,
      freq: uniforms.twinkleFrequency,
      amplitude: uniforms.twinkleAmplitude,
    });
    const scaleNode = size.mul(scaling).mul(twinkling);

    /*
     *
     * Color Asignment
     *
     */
    const distanceToCenter = uv()
      .distance(vec2(0.5))
      .add(uniforms.colorBias)
      .clamp(0, 1);
    const colorNode = mix(
      uniforms.insideColor,
      uniforms.outsideColor,
      distanceToCenter,
    );

    /*
     *
     * Alpha Asignment
     *
     */
    const opacityNode = texture(sparkTexture, uv()).r.step(0.1);

    return {
      nodes: {
        positionNode,
        scaleNode,
        colorNode,
        opacityNode,
      },
      uniforms,
    };
  }, [params, sparkTexture]);

  useEffect(() => {
    if (!uniforms.progress) return;

    const tween = gsap.to(uniforms.progress, {
      value: 1,
      duration: 3,
      ease: "linear",
      onComplete: () => onAnimationComplete?.(),
    });

    return () => {
      tween.kill();
    };
  }, [uniforms, onAnimationComplete]);

  return nodes;
}

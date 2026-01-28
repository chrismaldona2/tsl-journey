/* eslint-disable react-hooks/purity */
import { useMemo, useEffect } from "react";
import {
  instanceIndex,
  float,
  uint,
  PI,
  vec3,
  sin,
  cos,
  uv,
  vec2,
  mix,
  texture,
  hash,
  color,
  uniform,
} from "three/tsl";
import { useRandomFireworkTex } from "./use-random-firework-tex";
import {
  getExplosionFactor,
  getFallingOffset,
  getScalingFactor,
  getTwinklingFactor,
} from "../nodes";
import gsap from "gsap";
import { fireworkConfig as config, type FireworkParams } from "../config";
import type { UniformSet } from "@/types/uniforms";

type UseFireworkGPUProps = {
  params?: Partial<FireworkParams>;
  onAnimationComplete?: () => void;
};

export function useFireworkGPU({
  params,
  onAnimationComplete,
}: UseFireworkGPUProps) {
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

    const seed = Math.floor(Math.random() * 10000);
    const i = instanceIndex;

    /*
     *
     * Data Generation
     *
     */
    const radius = uniforms.explosionRadius.mul(
      hash(i.add(uint(0 + seed)))
        .mul(0.25)
        .add(0.75),
    );
    const phi = hash(i.add(uint(1 + seed))).mul(PI);
    const theta = hash(i.add(uint(2 + seed)))
      .mul(PI)
      .mul(2);

    const position = vec3(
      radius.mul(sin(phi)).mul(sin(theta)),
      radius.mul(cos(phi)),
      radius.mul(sin(phi)).mul(cos(theta)),
    );
    const size = hash(i.add(uint(3 + seed)))
      .mul(0.7)
      .add(0.3)
      .mul(uniforms.particleSize);

    /*
     *
     * Animations Timing
     *
     */
    const timeMultiplier = float(1).add(hash(i.add(4 + seed)));
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

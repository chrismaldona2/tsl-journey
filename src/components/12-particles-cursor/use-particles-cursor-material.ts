import type { UniformSet } from "@/types/uniforms";
import { useTexture } from "@react-three/drei";
import { useMemo } from "react";
import { Fn } from "three/src/nodes/TSL.js";
import {
  Discard,
  hash,
  instanceIndex,
  PI2,
  texture,
  uniform,
  uv,
  vec2,
  vec3,
} from "three/tsl";
import {
  particlesCursorConfig as config,
  type ParticlesCursorParams,
} from "./config";
import type { CanvasTexture } from "three";

export default function useParticlesCursorMaterial(
  displacementTexture?: CanvasTexture,
) {
  const dogsTex = useTexture("/textures/dogs.png");

  return useMemo(() => {
    const uniforms: UniformSet<Omit<ParticlesCursorParams, "particleCount">> = {
      gridSize: uniform(config.gridSize),
      gridSpacing: uniform(config.gridSpacing),
      particleSize: uniform(config.particleSize),
      colorPower: uniform(config.colorPower),
      displacementIntensity: uniform(config.displacementIntensity),
    };

    const i = instanceIndex.toFloat();
    const grid = uniforms.gridSize.toFloat();
    const x = i.mod(grid);
    const y = i.div(grid).floor();

    /*
     * Textures
     */
    const gridUv = vec2(x.div(grid), y.div(grid));
    const displacementTex = texture(displacementTexture, gridUv);
    const pictureTex = texture(dogsTex, gridUv);

    /*
     * Positioning
     */
    const half = grid.sub(1).div(2);
    const centeredX = x.sub(half);
    const centeredY = y.sub(half);
    const randomDisplaceIntensity = hash(i);
    const randomAngleIntensity = hash(i.add(1)).mul(PI2);
    const displacementTexIntensity = displacementTex.r.smoothstep(0.1, 0.4);

    const displacement = vec3(
      randomAngleIntensity.cos().mul(uniforms.displacementIntensity.mul(0.8)),
      randomAngleIntensity.sin().mul(uniforms.displacementIntensity.mul(0.8)),
      1,
    )
      .normalize()
      .mul(displacementTexIntensity)
      .mul(uniforms.displacementIntensity)
      .mul(randomDisplaceIntensity);

    const positionNode = vec3(
      centeredX.mul(uniforms.gridSpacing),
      centeredY.mul(uniforms.gridSpacing),
      0,
    ).add(displacement);

    /*
     * Shape / Color
     */
    const getColor = Fn(() => {
      const distanceToCenter = uv().distance(0.5);
      Discard(distanceToCenter.greaterThan(0.5));

      return vec3(pictureTex.pow(uniforms.colorPower));
    });

    const colorNode = getColor();

    /*
     * Size
     */
    const scaleNode = vec2(uniforms.particleSize).mul(pictureTex.r);

    return {
      nodes: {
        positionNode,
        colorNode,
        scaleNode,
      },
    };
  }, [displacementTexture, dogsTex]);
}

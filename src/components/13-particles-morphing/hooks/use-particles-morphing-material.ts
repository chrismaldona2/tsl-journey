/* eslint-disable react-hooks/purity */
import type { UniformSet } from "@/types/uniforms";
import { useMemo } from "react";
import {
  attribute,
  float,
  mix,
  mx_noise_float,
  smoothstep,
  uniform,
  uv,
  vec3,
} from "three/tsl";
import {
  particlesMorphingConfig as config,
  type ParticlesMorphingParams,
} from "../config";
import { useAssetsGLB } from "@/hooks/use-assets-glb";
import { InstancedBufferAttribute, DynamicDrawUsage } from "three";

export function useParticlesMorphingMaterial() {
  const models = useAssetsGLB();

  const material = useMemo(() => {
    /*
     * Geometry Buffers (The Source Library)
     */
    const geometries = [models.robot.geometry, models.portal_gun.geometry];
    const maxParticleCount = Math.max(
      ...geometries.map((g) => g.attributes.position.count),
    );

    const geometryBuffers: Float32Array[] = [];
    geometries.forEach((geometry) => {
      const oldPositionArray = geometry.attributes.position.array;
      const vertexCount = geometry.attributes.position.count;
      const newPositionArray = new Float32Array(maxParticleCount * 3);

      for (let i = 0; i < maxParticleCount; i++) {
        const i3 = i * 3;
        if (i < vertexCount) {
          newPositionArray[i3] = oldPositionArray[i3];
          newPositionArray[i3 + 1] = oldPositionArray[i3 + 1];
          newPositionArray[i3 + 2] = oldPositionArray[i3 + 2];
        } else {
          const randomIndex = Math.floor(Math.random() * vertexCount);
          newPositionArray[i3] = oldPositionArray[randomIndex * 3];
          newPositionArray[i3 + 1] = oldPositionArray[randomIndex * 3 + 1];
          newPositionArray[i3 + 2] = oldPositionArray[randomIndex * 3 + 2];
        }
      }
      geometryBuffers.push(newPositionArray);
    });

    const sizeBuffer = new Float32Array(maxParticleCount);
    for (let i = 0; i < maxParticleCount; i++) {
      sizeBuffer[i] = Math.random();
    }

    const activeArrayA = new Float32Array(maxParticleCount * 3);
    const activeArrayB = new Float32Array(maxParticleCount * 3);

    activeArrayA.set(geometryBuffers[0]);
    activeArrayB.set(geometryBuffers[1]);

    const posA = new InstancedBufferAttribute(activeArrayA, 3);
    const posB = new InstancedBufferAttribute(activeArrayB, 3);

    posA.setUsage(DynamicDrawUsage);
    posB.setUsage(DynamicDrawUsage);

    const attributes = {
      posA: posA,
      posB: posB,
      size: new InstancedBufferAttribute(sizeBuffer, 1),
    };

    /*
     * Uniforms
     */
    const uniforms: UniformSet<ParticlesMorphingParams> = {
      progress: uniform(config.progress),
      animationDuration: uniform(config.animationDuration),
    };

    /*
     * Positioning (TSL)
     */
    const posANode = attribute("posA", "vec3");
    const posBNode = attribute("posB", "vec3");

    const noiseA = mx_noise_float(posBNode).smoothstep(-1, 1);
    const noiseB = mx_noise_float(posANode).smoothstep(-1, 1);
    const finalNoise = mix(noiseA, noiseB, uniforms.progress);

    const delay = uniforms.animationDuration.oneMinus().mul(finalNoise);
    const animationEnd = delay.add(uniforms.animationDuration);
    const randomizedProgress = smoothstep(
      delay,
      animationEnd,
      uniforms.progress,
    );

    const positionNode = mix(posANode, posBNode, randomizedProgress);

    /*
     * Scaling
     */
    const size = attribute("aSize", "float");
    const scaleNode = float(0.035).mul(size);

    /*
     * Colors
     */
    const colorNode = vec3(finalNoise);

    /*
     * Transparency
     */
    const alpha = float(0.05).div(uv().distance(0.5)).sub(0.1);
    const opacityNode = alpha;

    return {
      nodes: {
        colorNode,
        positionNode,
        scaleNode,
        opacityNode,
      },
      uniforms,
      maxParticleCount,
      attributes,
      geometryBuffers,
    };
  }, [models]);

  return material;
}

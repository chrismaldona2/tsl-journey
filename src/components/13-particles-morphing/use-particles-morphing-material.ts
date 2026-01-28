/* eslint-disable react-hooks/purity */
import type { UniformSet } from "@/types/uniforms";
import { useMemo, useRef } from "react";
import {
  float,
  instanceIndex,
  mix,
  mx_noise_float,
  smoothstep,
  storage,
  uniform,
  uv,
  vec3,
} from "three/tsl";
import {
  particlesMorphingConfig as config,
  type ParticlesMorphingParams,
} from "./config";
import { useAssetsGLB } from "@/hooks/use-assets-glb";
import { StorageInstancedBufferAttribute } from "three/webgpu";
import { useControls } from "leva";

export default function useParticlesMorphingMaterial() {
  const models = useAssetsGLB();

  const material = useMemo(() => {
    /*
     * Geometry Buffers
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
    const positionStorageAttributes = geometryBuffers.map(
      (buf) => new StorageInstancedBufferAttribute(buf, 3),
    );

    const sizeBuffer = new Float32Array(maxParticleCount);
    for (let i = 0; i < maxParticleCount; i++) {
      sizeBuffer[i] = Math.random();
    }
    const sizeStorageAttribute = new StorageInstancedBufferAttribute(
      sizeBuffer,
      1,
    );

    /*
     * Uniforms
     */
    const uniforms: UniformSet<ParticlesMorphingParams> = {
      progress: uniform(config.progress),
      animationDuration: uniform(config.animationDuration),
    };

    /*
     * Positioning
     */
    const posStorageBufferA = storage(
      positionStorageAttributes[0],
      "vec3",
      maxParticleCount,
    );
    const posStorageBufferB = storage(
      positionStorageAttributes[1],
      "vec3",
      maxParticleCount,
    );

    const posA = posStorageBufferA.element(instanceIndex);
    const posB = posStorageBufferB.element(instanceIndex);

    const noiseA = mx_noise_float(posB).smoothstep(-1, 1);
    const noiseB = mx_noise_float(posA).smoothstep(-1, 1);
    const finalNoise = mix(noiseA, noiseB, uniforms.progress);

    const delay = uniforms.animationDuration.oneMinus().mul(finalNoise);
    const animationEnd = delay.add(uniforms.animationDuration);
    const randomizedProgress = smoothstep(
      delay,
      animationEnd,
      uniforms.progress,
    );

    const positionNode = mix(posA, posB, randomizedProgress);

    /*
     * Scaling
     */
    const sizeStorageBuffer = storage(
      sizeStorageAttribute,
      "float",
      maxParticleCount,
    );
    const size = sizeStorageBuffer.element(instanceIndex);
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
    };
  }, [models]);

  const uniformsRef = useRef(material.uniforms);
  useControls("🧬 13 — Particles Morphing", {
    progress: {
      value: config.progress,
      min: 0,
      max: 1,
      step: 0.001,
      onChange: (v) => {
        uniformsRef.current.progress.value = v;
      },
    },
  });

  return material;
}

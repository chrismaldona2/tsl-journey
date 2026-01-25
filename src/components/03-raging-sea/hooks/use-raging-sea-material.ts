import type { UniformSet } from "@/types/uniforms";
import { useTexture } from "@react-three/drei";
import { useMemo } from "react";
import {
  uniform,
  color,
  vec2,
  positionLocal,
  vec3,
  mix,
  smoothstep,
  texture,
  uv,
  min,
} from "three/tsl";
import { getWaveElevation } from "../nodes";
import { RagingSeaConfig as config, type RagingSeaParams } from "../config";

export function useRagingSeaMaterial() {
  const foamTexture = useTexture("/textures/foam.webp");

  return useMemo(() => {
    const uniforms: UniformSet<RagingSeaParams> = {
      surfaceColor: uniform(color(config.surfaceColor)),
      depthColor: uniform(color(config.depthColor)),
      colorOffset: uniform(config.colorOffset),
      colorMultiplier: uniform(config.colorMultiplier),
      foamColor: uniform(color(config.foamColor)),
      foamThreshold: uniform(config.foamThreshold),
      foamSmoothness: uniform(config.foamSmoothness),
      waveFrequency: uniform(vec2(...config.waveFrequency)),
      waveAmplitude: uniform(config.waveAmplitude),
      waveSpeed: uniform(config.waveSpeed),
      noiseIterations: uniform(config.noiseIterations),
      noiseFrequency: uniform(config.noiseFrequency),
      noiseStrength: uniform(config.noiseStrength),
      edgeCut: uniform(config.edgeCut),
    };

    /* Waves Generation */
    const waveElevation = getWaveElevation({
      position: positionLocal,
      waveFrequency: uniforms.waveFrequency,
      waveAmplitude: uniforms.waveAmplitude,
      waveSpeed: uniforms.waveSpeed,
      noiseIterations: uniforms.noiseIterations,
      noiseFrequency: uniforms.noiseFrequency,
      noiseStrength: uniforms.noiseStrength,
    });
    const positionNode = positionLocal.add(vec3(0, 0, waveElevation));

    /* Water Color */
    const colorMixFactor = waveElevation
      .add(uniforms.colorOffset)
      .mul(uniforms.colorMultiplier);
    const waterColor = mix(
      uniforms.depthColor,
      uniforms.surfaceColor,
      colorMixFactor.smoothstep(0, 1),
    );
    /* Foam */
    const heightMask = smoothstep(
      uniforms.foamThreshold,
      uniforms.foamThreshold.add(uniforms.foamSmoothness),
      waveElevation,
    );
    const foamMask = texture(foamTexture, uv()).r.mul(heightMask);
    const colorNode = mix(waterColor, uniforms.foamColor, foamMask);

    /* Borders Fade */
    const coords = uv();
    const distToEdge = min(
      coords.x.min(coords.x.oneMinus()),
      coords.y.min(coords.y.oneMinus()),
    );
    const opacityNode = smoothstep(0, uniforms.edgeCut, distToEdge);

    return {
      nodes: { colorNode, positionNode, opacityNode },
      uniforms,
    };
  }, [foamTexture]);
}

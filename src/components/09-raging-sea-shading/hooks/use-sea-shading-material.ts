import { useTexture } from "@react-three/drei";
import { useMemo } from "react";
import {
  uniform,
  color,
  vec2,
  vec3,
  positionLocal,
  modelWorldMatrix,
  smoothstep,
  texture,
  uv,
  mix,
  cameraPosition,
  min,
  cross,
  vec4,
} from "three/tsl";
import { getWaveElevation } from "../../03-raging-sea/sea-nodes";
import { SeaShadingConfig as config } from "../config";
import { pointLight } from "../../../shaders/lights";

export function useSeaShadingMaterial() {
  const foamTexture = useTexture("/textures/foam.webp");

  return useMemo(() => {
    const uniforms = {
      water: {
        surfaceColor: uniform(color(config.water.surfaceColor)),
        depthColor: uniform(color(config.water.depthColor)),
        colorOffset: uniform(config.water.colorOffset),
        colorMultiplier: uniform(config.water.colorMultiplier),
        foamColor: uniform(color(config.water.foamColor)),
        foamThreshold: uniform(config.water.foamThreshold),
        foamSmoothness: uniform(config.water.foamSmoothness),
        waveFrequency: uniform(vec2(...config.water.waveFrequency)),
        waveAmplitude: uniform(config.water.waveAmplitude),
        waveSpeed: uniform(config.water.waveSpeed),
        noiseIterations: uniform(config.water.noiseIterations),
        noiseFrequency: uniform(config.water.noiseFrequency),
        noiseStrength: uniform(config.water.noiseStrength),
        edgeCut: uniform(config.water.edgeCut),
        neighborShift: uniform(config.water.neighborShift),
      },
      pointLight: {
        color: uniform(color(config.pointLight.color)),
        intensity: uniform(config.pointLight.intensity),
        position: uniform(vec3(...config.pointLight.position)),
        decay: uniform(config.pointLight.decay),
        specularPower: uniform(config.pointLight.specularPower),
      },
    };

    /* Waves Generation */
    const elevation = getWaveElevation({
      position: positionLocal,
      waveFrequency: uniforms.water.waveFrequency,
      waveAmplitude: uniforms.water.waveAmplitude,
      waveSpeed: uniforms.water.waveSpeed,
      noiseIterations: uniforms.water.noiseIterations,
      noiseFrequency: uniforms.water.noiseFrequency,
      noiseStrength: uniforms.water.noiseStrength,
    });
    const positionNode = positionLocal.add(vec3(0, 0, elevation));

    /* Normals Computation */
    const neighborShift = uniforms.water.neighborShift;

    const baseAPosition = positionLocal.add(vec3(neighborShift, 0, 0));
    const AElevation = getWaveElevation({
      position: baseAPosition,
      waveFrequency: uniforms.water.waveFrequency,
      waveAmplitude: uniforms.water.waveAmplitude,
      waveSpeed: uniforms.water.waveSpeed,
      noiseIterations: uniforms.water.noiseIterations,
      noiseFrequency: uniforms.water.noiseFrequency,
      noiseStrength: uniforms.water.noiseStrength,
    });
    const finalAPosition = baseAPosition.add(vec3(0, 0, AElevation));

    const baseBPosition = positionLocal.add(vec3(0, neighborShift, 0));
    const BElevation = getWaveElevation({
      position: baseBPosition,
      waveFrequency: uniforms.water.waveFrequency,
      waveAmplitude: uniforms.water.waveAmplitude,
      waveSpeed: uniforms.water.waveSpeed,
      noiseIterations: uniforms.water.noiseIterations,
      noiseFrequency: uniforms.water.noiseFrequency,
      noiseStrength: uniforms.water.noiseStrength,
    });
    const finalBPosition = baseBPosition.add(vec3(0, 0, BElevation));

    const toA = finalAPosition.sub(positionNode).normalize();
    const toB = finalBPosition.sub(positionNode).normalize();
    const computedNormalLocal = cross(toA, toB);
    const computedNormalWorld = modelWorldMatrix
      .mul(vec4(computedNormalLocal, 0))
      .xyz.normalize();

    /* Foam */
    const heightMask = smoothstep(
      uniforms.water.foamThreshold,
      uniforms.water.foamThreshold.add(uniforms.water.foamSmoothness),
      elevation,
    );
    const foamMask = texture(foamTexture, uv()).r.mul(heightMask);

    /* Color */
    const colorMixFactor = elevation
      .add(uniforms.water.colorOffset)
      .mul(uniforms.water.colorMultiplier);
    const waterColor = mix(
      uniforms.water.depthColor,
      uniforms.water.surfaceColor,
      colorMixFactor.smoothstep(0, 1),
    );

    /* Shading */
    const positionWorld = modelWorldMatrix.mul(positionNode).xyz;
    const viewDirection = cameraPosition.sub(positionWorld).normalize();
    const pointLgt = pointLight({
      lightPosition: uniforms.pointLight.position,
      lightColor: uniforms.pointLight.color,
      lightIntensity: uniforms.pointLight.intensity,
      lightDecay: uniforms.pointLight.decay,
      position: positionWorld,
      normal: computedNormalWorld,
      viewDirection,
      specularPower: uniforms.pointLight.specularPower,
    });
    const lights = vec3(0).add(pointLgt);

    const colorNode = mix(waterColor, uniforms.water.foamColor, foamMask).mul(
      lights,
    );

    // const colorNode = computedNormalWorld;

    /* Borders Fade */
    const coords = uv();
    const distToEdge = min(
      coords.x.min(coords.x.oneMinus()),
      coords.y.min(coords.y.oneMinus()),
    );
    const opacityNode = smoothstep(0, uniforms.water.edgeCut, distToEdge);

    return {
      nodes: { colorNode, positionNode, opacityNode },
      uniforms,
    };
  }, [foamTexture]);
}

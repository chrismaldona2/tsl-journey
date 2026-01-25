import { useMemo } from "react";
import {
  uniform,
  color,
  vec3,
  positionWorld,
  normalWorld,
  cameraPosition,
  texture,
  uv,
} from "three/tsl";
import {
  HalftoneShadingConfig as config,
  type HalftoneShadingParams,
} from "../config";
import { SRGBColorSpace } from "three";
import { useTexture } from "@react-three/drei";
import { halftoneOverlay } from "../nodes";
import { ambientLight, pointLight } from "@/shaders/lights";
import type { UniformSet } from "@/types/uniforms";

export default function useHalftoneShadingMaterial() {
  const carTexture = useTexture("/textures/car.png", (tex) => {
    tex.colorSpace = SRGBColorSpace;
  });

  return useMemo(() => {
    const uniforms: UniformSet<HalftoneShadingParams> = {
      halftone: {
        shadows: {
          density: uniform(config.halftone.shadows.density),
          direction: uniform(vec3(...config.halftone.shadows.direction)),
          color: uniform(color(config.halftone.shadows.color)),
          maskLow: uniform(config.halftone.shadows.maskLow),
          maskHigh: uniform(config.halftone.shadows.maskHigh),
        },
        highlights: {
          density: uniform(config.halftone.highlights.density),
          direction: uniform(vec3(...config.halftone.highlights.direction)),
          color: uniform(color(config.halftone.highlights.color)),
          maskLow: uniform(config.halftone.highlights.maskLow),
          maskHigh: uniform(config.halftone.highlights.maskHigh),
        },
      },
      ambientLight: {
        color: uniform(color(config.ambientLight.color)),
        intensity: uniform(config.ambientLight.intensity),
      },
      pointLight: {
        color: uniform(color(config.pointLight.color)),
        intensity: uniform(config.pointLight.intensity),
        position: uniform(vec3(...config.pointLight.position)),
        decay: uniform(config.pointLight.decay),
        specularPower: uniform(config.pointLight.specularPower),
      },
    };

    /*
     *
     * Lights Shading
     *
     */
    // Ambient Light
    const ambientLgt = ambientLight({
      lightIntensity: uniforms.ambientLight.intensity,
      lightColor: uniforms.ambientLight.color,
    });
    // Point Light
    const viewDirection = cameraPosition.sub(positionWorld).normalize();
    const pointLgt = pointLight({
      lightPosition: uniforms.pointLight.position,
      lightColor: uniforms.pointLight.color,
      lightIntensity: uniforms.pointLight.intensity,
      lightDecay: uniforms.pointLight.decay,
      position: positionWorld,
      normal: normalWorld,
      viewDirection,
      specularPower: uniforms.pointLight.specularPower,
    });
    const lights = vec3(0).add(ambientLgt).add(pointLgt);
    const litColor = texture(carTexture, uv()).mul(lights);

    /*
     *
     * Halftone Effect
     *
     */
    const withShadows = halftoneOverlay({
      baseColor: litColor,
      dotColor: uniforms.halftone.shadows.color,
      density: uniforms.halftone.shadows.density,
      direction: uniforms.halftone.shadows.direction,
      maskLow: uniforms.halftone.shadows.maskLow,
      maskHigh: uniforms.halftone.shadows.maskHigh,
      normal: normalWorld,
    });
    const withHighlights = halftoneOverlay({
      baseColor: withShadows,
      dotColor: uniforms.halftone.highlights.color,
      density: uniforms.halftone.highlights.density,
      direction: uniforms.halftone.highlights.direction,
      maskLow: uniforms.halftone.highlights.maskLow,
      maskHigh: uniforms.halftone.highlights.maskHigh,
      normal: normalWorld,
    });

    // Final Color
    const colorNode = withHighlights;

    return {
      nodes: {
        colorNode,
      },
      uniforms,
    };
  }, [carTexture]);
}

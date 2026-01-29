import type { UniformSet } from "@/types/uniforms";
import { useMemo } from "react";
import {
  normalWorld,
  positionWorld,
  cameraPosition,
  dot,
  color,
  uniform,
  vec3,
  mix,
} from "three/tsl";
import { type AtmosphereParams, earthConfig as config } from "../config";

export default function useAtmosphereMaterial() {
  return useMemo(() => {
    const uniforms: UniformSet<AtmosphereParams> = {
      sunDirection: uniform(vec3(...config.sunDirection)),
      atmosphereDayColor: uniform(color(config.atmosphereDayColor)),
      atmosphereTwilightColor: uniform(color(config.atmosphereTwilightColor)),
    };

    const normals = normalWorld.negate().normalize();
    const sunDirection = uniforms.sunDirection.normalize();
    const viewDirection = positionWorld.sub(cameraPosition).normalize();
    const sunOrientation = dot(sunDirection, normals);

    /*
     * Atmosphere
     */
    const atmosphereDayFactor = sunOrientation.smoothstep(-0.5, 1);
    const atmosphereColorMix = mix(
      uniforms.atmosphereTwilightColor,
      uniforms.atmosphereDayColor,
      atmosphereDayFactor,
    );
    const colorNode = atmosphereColorMix;

    /*
     * Alpha
     */
    const edgeAlpha = dot(viewDirection, normals).smoothstep(0, 0.5);
    const dayAlpha = sunOrientation.smoothstep(-0.5, 0);
    const opacityNode = edgeAlpha.mul(dayAlpha);

    return {
      nodes: {
        colorNode,
        opacityNode,
      },
      uniforms,
    };
  }, []);
}

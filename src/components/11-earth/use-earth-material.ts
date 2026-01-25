import type { UniformSet } from "@/types/uniforms";
import { useTexture } from "@react-three/drei";
import { useMemo } from "react";
import { SRGBColorSpace } from "three";
import { earthConfig as config, type EarthParams } from "./config";
import {
  cameraPosition,
  color,
  dot,
  mix,
  normalWorld,
  positionWorld,
  reflect,
  texture,
  uniform,
  uv,
  vec3,
} from "three/tsl";

export default function useEarthMaterial() {
  const [dayTex, nightTex] = useTexture(
    ["/textures/earth/day.jpg", "/textures/earth/night.jpg"],
    (textures) => {
      textures.forEach((tex) => {
        tex.colorSpace = SRGBColorSpace;
        tex.anisotropy = 8;
      });
    },
  );

  const specularCloudsTex = useTexture(
    "/textures/earth/specularClouds.jpg",
    (tex) => {
      tex.anisotropy = 8;
    },
  );

  return useMemo(() => {
    const uniforms: UniformSet<EarthParams> = {
      thresholdLow: uniform(config.thresholdLow),
      thresholdHigh: uniform(config.thresholdHigh),
      sunDirection: uniform(vec3(...config.sunDirection)),
      cloudsColor: uniform(color(config.cloudsColor)),
      cloudsThresholdLow: uniform(config.cloudsThresholdLow),
      cloudsThresholdHigh: uniform(config.cloudsThresholdHigh),
      atmosphereDayColor: uniform(color(config.atmosphereDayColor)),
      atmosphereTwilightColor: uniform(color(config.atmosphereTwilightColor)),
      fresnelPower: uniform(config.fresnelPower),
      specularPower: uniform(config.specularPower),
      specularColor: uniform(color(config.specularColor)),
    };

    const sunDirection = uniforms.sunDirection.normalize();
    const normalDir = normalWorld.normalize();
    const viewDirection = positionWorld.sub(cameraPosition).normalize();
    const sunOrientation = dot(sunDirection, normalDir);

    const specularCloudsT = texture(specularCloudsTex, uv());

    /*
     * Day - Night cycle
     */
    const day = texture(dayTex, uv());
    const night = texture(nightTex, uv()).add(vec3(0.01, 0.01, 0.025));
    const dayFactor = sunOrientation.smoothstep(
      uniforms.thresholdLow,
      uniforms.thresholdHigh,
    );
    const dayNightMix = mix(night, day, dayFactor);

    /*
     * Clouds
     */
    const cloudsFactor = specularCloudsT.g
      .smoothstep(uniforms.cloudsThresholdLow, uniforms.cloudsThresholdHigh)
      .mul(dayFactor.add(0.05));
    const cloudsMix = mix(dayNightMix, uniforms.cloudsColor, cloudsFactor);

    /*
     * Atmosphere
     */
    const atmosphereDayFactor = sunOrientation.smoothstep(-0.5, 1);
    const atmosphereColorMix = mix(
      uniforms.atmosphereTwilightColor,
      uniforms.atmosphereDayColor,
      atmosphereDayFactor,
    );

    /*
     * Fresnel
     */
    const fresnelFactor = dot(viewDirection, normalWorld)
      .add(1)
      .pow(uniforms.fresnelPower);

    /*
     * Specular Reflection
     */
    const reflection = reflect(sunDirection.negate(), normalWorld);
    const specularMask = specularCloudsT.r;
    const specular = dot(reflection, viewDirection)
      .negate()
      .max(0)
      .pow(uniforms.specularPower)
      .mul(specularMask);
    const specularColor = mix(
      uniforms.specularColor,
      atmosphereColorMix,
      fresnelFactor,
    );

    const colorNode = mix(
      cloudsMix,
      atmosphereColorMix,
      fresnelFactor.mul(dayFactor),
    ).add(specular.mul(specularColor));

    return {
      nodes: {
        colorNode,
      },
      uniforms,
    };
  }, [dayTex, nightTex, specularCloudsTex]);
}

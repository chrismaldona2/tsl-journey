import type { UniformSet } from "@/types/uniforms";
import { useTexture } from "@react-three/drei";
import { useMemo } from "react";
import { RepeatWrapping } from "three";
import {
  uniform,
  color,
  vec2,
  uv,
  texture,
  rotate,
  positionLocal,
  vec3,
  min,
  oneMinus,
  time,
} from "three/tsl";
import { CoffeeSteamConfig as config, type CoffeeSteamParams } from "../config";

export function useCoffeeSteamMaterial() {
  const perlinTexture = useTexture("/textures/perlin.png", (t) => {
    t.wrapS = RepeatWrapping;
    t.wrapT = RepeatWrapping;
  });

  return useMemo(() => {
    /* Uniforms */
    const uniforms: UniformSet<CoffeeSteamParams> = {
      steamColor: uniform(color(config.steamColor)),
      riseSpeed: uniform(config.riseSpeed),
      cloudScale: uniform(vec2(...config.cloudScale)),
      erosion: uniform(config.erosion),
      twistAmplitude: uniform(config.twistAmplitude),
      twistNoiseScale: uniform(config.twistNoiseScale),
      twistSpeed: uniform(config.twistSpeed),
      windAmplitude: uniform(config.windAmplitude),
      windSpeed: uniform(config.windSpeed),
      edgeFadeStart: uniform(config.edgeFadeStart),
      edgeFadeDistance: uniform(config.edgeFadeDistance),
    };

    /* Position Node Setup */
    // Twist
    const twistNoiseUV = vec2(
      0.5,
      uv().y.mul(uniforms.twistNoiseScale).sub(time.mul(uniforms.twistSpeed)),
    );
    const twistNoiseVal = texture(perlinTexture, twistNoiseUV).r;
    const twistAngle = twistNoiseVal.mul(uniforms.twistAmplitude);
    const twist = rotate(positionLocal, vec3(0, twistAngle, 0));

    // Wind
    const windNoiseX = texture(
      perlinTexture,
      vec2(0.25, time.mul(uniforms.windSpeed)),
    ).r.sub(0.5);
    const windNoiseZ = texture(
      perlinTexture,
      vec2(0.75, time.mul(uniforms.windSpeed)),
    ).r.sub(0.5);

    const windForce = uv().y.pow(2).mul(uniforms.windAmplitude);
    const windOffset = vec3(windNoiseX, 0, windNoiseZ).mul(windForce);

    const positionNode = twist.add(windOffset);

    /* Opacity Node Setup */
    // Edge Fading
    const distX = min(uv().x, oneMinus(uv().x));
    const distY = min(uv().y, oneMinus(uv().y));
    const distToEdge = min(distX, distY);

    const edgeFade = distToEdge.smoothstep(
      uniforms.edgeFadeStart,
      uniforms.edgeFadeStart.add(uniforms.edgeFadeDistance),
    );

    // Steam Cloud Texture
    const flowUV = uv()
      .sub(vec2(0, time.mul(uniforms.riseSpeed)))
      .mul(uniforms.cloudScale);
    const steamPattern = texture(perlinTexture, flowUV).r;

    const opacityNode = steamPattern
      .smoothstep(uniforms.erosion, 1.0)
      .mul(edgeFade);

    return {
      nodes: {
        colorNode: uniforms.steamColor,
        opacityNode,
        positionNode,
      },
      uniforms,
    };
  }, [perlinTexture]);
}

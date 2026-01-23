import { useMemo } from "react";
import {
  uniform,
  color,
  vec3,
  cameraPosition,
  positionWorld,
  normalWorld,
} from "three/tsl";
import { ambientLight, directionalLight, pointLight } from "../nodes";
import { LightShadingConfig as config } from "../config";

export function useLightsShadingMaterial() {
  return useMemo(() => {
    const uniforms = {
      ambientLight: {
        color: uniform(color(config.ambientLight.color)),
        intensity: uniform(config.ambientLight.intensity),
      },
      directionalLight: {
        color: uniform(color(config.directionalLight.color)),
        intensity: uniform(config.directionalLight.intensity),
        position: uniform(vec3(...config.directionalLight.position)),
        target: uniform(vec3(...config.directionalLight.target)),
        specularPower: uniform(config.directionalLight.specularPower),
      },
      pointLight: {
        color: uniform(color(config.pointLight.color)),
        intensity: uniform(config.pointLight.intensity),
        position: uniform(vec3(...config.pointLight.position)),
        decay: uniform(config.pointLight.decay),
        specularPower: uniform(config.pointLight.specularPower),
      },
    };

    const viewDirection = cameraPosition.sub(positionWorld).normalize();

    const ambientLgt = ambientLight({
      lightColor: uniforms.ambientLight.color,
      lightIntensity: uniforms.ambientLight.intensity,
    });

    const directionalLgt = directionalLight({
      lightColor: uniforms.directionalLight.color,
      lightIntensity: uniforms.directionalLight.intensity,
      lightPosition: uniforms.directionalLight.position,
      lightTarget: uniforms.directionalLight.target,
      normal: normalWorld,
      viewDirection,
      specularPower: uniforms.directionalLight.specularPower,
    });

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

    const lights = vec3(0).add(pointLgt).add(directionalLgt).add(ambientLgt);

    const colorNode = color("#ffffff").mul(lights);

    return {
      nodes: {
        colorNode,
      },
      uniforms,
    };
  }, []);
}

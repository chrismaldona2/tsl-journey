import { useMemo } from "react";
import {
  uniform,
  color,
  vec3,
  cameraPosition,
  positionWorld,
  normalWorld,
} from "three/tsl";
import { ambientLight, directionalLight, pointLight } from "./nodes";
import { folder, useControls } from "leva";

export function useLightsShadingMaterial() {
  return useMemo(() => {
    const uniforms = {
      mesh: {
        color: uniform(color("#ffffff")),
      },
      ambientLight: {
        color: uniform(color("#ffffff")),
        intensity: uniform(0.03),
      },
      directionalLight: {
        color: uniform(color(0.1, 0.1, 1)),
        position: uniform(vec3(0.75, 0, 1.5)),
        intensity: uniform(1),
        specularPower: uniform(20),
      },
      pointLight: {
        position: uniform(vec3(0, 1, -0.2)),
        color: uniform(color(1, 0.1, 0.1)),
        intensity: uniform(1),
        decay: uniform(0.6),
        specularPower: uniform(20),
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

    const colorNode = uniforms.mesh.color.mul(lights);

    return {
      nodes: {
        colorNode,
      },
      uniforms,
    };
  }, []);
}

type LightsShadingUniforms = ReturnType<
  typeof useLightsShadingMaterial
>["uniforms"];

export function useLightsShadingControls(uniforms: LightsShadingUniforms) {
  return useControls("✨ 9 — Lights Shading", {
    "Ambient Light": folder({
      ambLightColor: {
        label: "Color",
        value: "#ffffff",
        onChange: (v) => {
          uniforms.ambientLight.color.value.set(v);
        },
      },
    }),
  });
}

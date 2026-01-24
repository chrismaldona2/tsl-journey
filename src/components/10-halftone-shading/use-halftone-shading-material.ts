import { useMemo } from "react";
import {
  uniform,
  color,
  vec3,
  screenCoordinate,
  positionWorld,
  normalWorld,
  cameraPosition,
  float,
  screenSize,
  vec2,
  screenDPR,
} from "three/tsl";
import { HalftoneShadingConfig as config } from "./config";
import { ambientLight, pointLight } from "../../shaders/lights";

export default function useHalftoneShadingMaterial() {
  return useMemo(() => {
    const uniforms = {
      halftone: {
        repetitions: uniform(config.halftone.repetition),
        direction: uniform(vec3(...config.halftone.direction)),
        color: uniform(color(config.halftone.color)),
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

    /*
     *
     * Halftone Effect
     *
     */
    // Intensity (Points Size)
    const halftoneDir = uniforms.halftone.direction.normalize();
    const normalDir = normalWorld.normalize();
    const shadowIntensity = normalDir.dot(halftoneDir).smoothstep(-0.8, 1.5);

    // Grid Pattern
    const uv = screenCoordinate.xy.div(screenSize.y.mul(screenDPR));
    const grid = uv.mul(uniforms.halftone.repetitions).mod(1);

    const points = grid
      .distance(vec2(0.5))
      .step(float(0.5).mul(shadowIntensity))
      .oneMinus();

    // Final Color
    const litColor = color("green").mul(lights);
    const colorNode = litColor.mix(uniforms.halftone.color, points);

    return {
      nodes: {
        colorNode,
      },
      uniforms,
    };
  }, []);
}

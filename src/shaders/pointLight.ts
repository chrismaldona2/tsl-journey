import { Fn } from "three/tsl";
import { Node } from "three/webgpu";

export const pointLight = Fn(
  ({
    lightPosition,
    lightColor,
    lightIntensity,
    lightDecay,
    position,
    normal,
    viewDirection,
    specularPower,
  }: {
    lightPosition: Node;
    lightColor: Node;
    lightIntensity: Node;
    lightDecay: Node;
    position: Node;
    normal: Node;
    viewDirection: Node;
    specularPower: Node;
  }) => {
    const n = normal.normalize();

    const lightDelta = lightPosition.sub(position);

    const lightDistance = lightDelta.length();
    const decay = lightDistance.mul(lightDecay).oneMinus().max(0);

    const lightDirection = lightDelta.normalize();

    const reflection = lightDirection.negate().reflect(n);

    const specular = reflection
      .dot(viewDirection)
      .saturate()
      .pow(specularPower);

    const shading = lightDirection.dot(n).saturate();

    return shading.add(specular).mul(lightIntensity.mul(lightColor).mul(decay));
  },
);

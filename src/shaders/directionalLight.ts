import { Fn } from "three/tsl";
import { Node } from "three/webgpu";

export const directionalLight = Fn(
  ({
    lightColor,
    lightIntensity,
    lightPosition,
    lightTarget,
    normal,
    viewDirection,
    specularPower,
  }: {
    lightColor: Node;
    lightIntensity: Node;
    lightPosition: Node;
    lightTarget: Node;
    normal: Node;
    viewDirection: Node;
    specularPower: Node;
  }) => {
    const n = normal.normalize();

    const lightDirection = lightPosition.sub(lightTarget).normalize();

    const reflection = lightDirection.negate().reflect(n);
    const specular = reflection
      .dot(viewDirection)
      .saturate()
      .pow(specularPower);

    const shading = lightDirection.dot(n).saturate();

    return shading.add(specular).mul(lightIntensity.mul(lightColor));
  },
);

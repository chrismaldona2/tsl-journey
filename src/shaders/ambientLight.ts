import { Fn } from "three/tsl";
import type { Node } from "three/webgpu";

export const ambientLight = Fn(
  ({
    lightColor,
    lightIntensity,
  }: {
    lightColor: Node;
    lightIntensity: Node;
  }) => {
    return lightColor.mul(lightIntensity);
  },
);

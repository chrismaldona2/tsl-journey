import {
  float,
  Fn,
  mix,
  screenCoordinate,
  screenDPR,
  screenSize,
} from "three/tsl";
import type { Node } from "three/webgpu";

export const halftoneOverlay = Fn(
  ({
    baseColor,
    dotColor,
    density,
    direction,
    maskLow,
    maskHigh,
    normal,
  }: {
    baseColor: Node;
    dotColor: Node;
    density: Node;
    direction: Node;
    maskLow: Node;
    maskHigh: Node;
    normal: Node;
  }) => {
    const alignment = normal.normalize().dot(direction.normalize());

    const intensity = alignment.smoothstep(maskLow, maskHigh);

    const screenUv = screenCoordinate.xy.div(screenSize.y.mul(screenDPR));

    const grid = screenUv.mul(density).mod(1);

    const dotPattern = grid
      .distance(0.5)
      .step(float(0.5).mul(intensity))
      .oneMinus();

    return mix(baseColor, dotColor, dotPattern);
  },
);

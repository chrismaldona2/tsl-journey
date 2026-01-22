import { Fn, min, remapClamp, sin, vec3 } from "three/tsl";
import { Node } from "three/webgpu";

export const getExplosionFactor = Fn(
  ({ progress, easing }: { progress: Node; easing: Node }) => {
    const p = remapClamp(progress, 0, 0.1, 0, 1);
    return p.oneMinus().pow(easing).oneMinus();
  },
);

export const getFallingOffset = Fn(
  ({ progress, easing }: { progress: Node; easing: Node }) => {
    const p = remapClamp(progress, 0.1, 1, 0, 1);
    return vec3(0, p.oneMinus().pow(easing).oneMinus().mul(0.2).negate(), 0);
  },
);

export const getScalingFactor = Fn(({ progress }: { progress: Node }) => {
  const sizeOpening = remapClamp(progress, 0, 0.125, 0, 1);
  const sizeClosing = remapClamp(progress, 0.125, 1, 1, 0);
  return min(sizeOpening, sizeClosing);
});

export const getTwinklingFactor = Fn(
  ({
    progress,
    freq,
    amplitude,
  }: {
    progress: Node;
    freq: Node;
    amplitude: Node;
  }) => {
    const p = remapClamp(progress, 0.2, 0.8, 0, 1);
    return sin(progress.mul(freq))
      .mul(amplitude)
      .add(amplitude)
      .mul(p)
      .oneMinus();
  },
);

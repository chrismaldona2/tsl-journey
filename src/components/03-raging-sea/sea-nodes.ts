import { Fn } from "three/src/nodes/TSL.js";
import { abs, Loop, mx_noise_float, sin, time, vec3 } from "three/tsl";
import { Node } from "three/webgpu";

export const getWaveElevation = Fn(
  ({
    position,
    waveFrequency,
    waveAmplitude,
    waveSpeed,
    noiseIterations,
    noiseFrequency,
    noiseStrength,
  }: {
    position: Node;
    waveFrequency: Node;
    waveAmplitude: Node;
    waveSpeed: Node;
    noiseIterations: Node;
    noiseFrequency: Node;
    noiseStrength: Node;
  }) => {
    const waveX = sin(position.x.mul(waveFrequency.x).add(time.mul(waveSpeed)));
    const waveY = sin(position.y.mul(waveFrequency.y).add(time.mul(waveSpeed)));
    const elevation = waveX.mul(waveY).mul(waveAmplitude).toVar();

    /* Noise */
    Loop(noiseIterations, ({ i }) => {
      const index = i.add(1);

      const raw = mx_noise_float(
        vec3(position.xy.mul(noiseFrequency.mul(index)), time.mul(0.2)),
      );
      const turbulence = abs(raw).mul(noiseStrength.div(index));

      elevation.subAssign(turbulence);
    });

    return elevation;
  },
);

import { useControls } from "leva";
import { useMemo } from "react";
import {
  vec3,
  uv,
  sub,
  oneMinus,
  min,
  max,
  floor,
  fract,
  sin,
  dot,
  vec2,
  distance,
  div,
  float,
  rotateUV,
  atan,
  abs,
  mx_noise_float,
  color,
  length,
} from "three/tsl";

export function usePatternMaterial(selectedPattern: number = 1) {
  return useMemo(() => {
    /* Colors */
    const colorNode = (() => {
      switch (selectedPattern) {
        case 1: {
          return vec3(uv().x, uv().y, 1);
        }
        case 2: {
          return vec3(uv().x, uv().y, 0);
        }
        case 3: {
          const s = uv().x;
          return vec3(s);
        }
        case 4: {
          const s = uv().y;
          return vec3(s);
        }
        case 5: {
          const s = sub(1, uv().y);
          return vec3(s);
        }
        case 6: {
          const s = uv().y.mul(5);
          return vec3(s);
        }
        case 7: {
          const s = uv().y.mul(10).add(0.01).mod(1);
          return vec3(s);
        }
        case 8: {
          const s = uv().y.mul(10).add(0.01).mod(1).step(0.5);
          return vec3(s);
        }
        case 9: {
          const s = uv().y.mul(10).add(0.01).mod(1).step(0.8);
          return vec3(s);
        }
        case 10: {
          const s = oneMinus(uv().x.mul(10).sub(0.01).mod(1).step(0.15));
          return vec3(s);
        }
        case 11: {
          const x = uv().x.mul(10).mod(1).step(0.8);
          const y = uv().y.mul(10).mod(1).step(0.8);
          const s = x.add(y);
          return vec3(s.clamp(0, 1));
        }
        case 12: {
          const x = uv().x.mul(10).mod(1).step(0.8);
          const y = uv().y.mul(10).mod(1).step(0.8);
          const s = x.mul(y);
          return vec3(s);
        }

        case 13: {
          const x = uv().x.mul(10).mod(1).step(0.4);
          const y = uv().y.mul(10).mod(1).step(0.8);
          const s = x.mul(y);
          return vec3(s);
        }

        case 14: {
          const x = uv()
            .x.mul(10)
            .mod(1)
            .step(0.4)
            .mul(uv().y.mul(10).mod(1).step(0.8));

          const y = uv()
            .y.mul(10)
            .mod(1)
            .step(0.4)
            .mul(uv().x.mul(10).mod(1).step(0.8));

          const s = x.add(y);
          return vec3(s);
        }

        case 15: {
          const x = uv()
            .x.mul(10)
            .mod(1)
            .step(0.4)
            .mul(uv().y.mul(10).add(0.2).mod(1).step(0.8));

          const y = uv()
            .x.mul(10)
            .add(0.2)
            .mod(1)
            .step(0.8)
            .mul(uv().y.mul(10).mod(1).step(0.4));

          const s = x.add(y);
          return vec3(s);
        }

        case 16: {
          const s = uv().x.sub(0.5).abs();
          return vec3(s);
        }
        case 17: {
          const x = uv().x.sub(0.5).abs();
          const y = uv().y.sub(0.5).abs();
          const s = min(x, y);
          return vec3(s);
        }
        case 18: {
          const x = uv().x.sub(0.5).abs();
          const y = uv().y.sub(0.5).abs();
          const s = max(x, y);
          return vec3(s);
        }
        case 19: {
          const x = uv().x.sub(0.5).abs();
          const y = uv().y.sub(0.5).abs();
          const s = max(x, y).step(0.2);
          return vec3(s);
        }
        case 20: {
          const x = uv().x.sub(0.5).abs();
          const y = uv().y.sub(0.5).abs();
          const innerSquare = oneMinus(max(x, y).step(0.25));
          const outerFrame = max(x, y).step(0.2);
          const s = outerFrame.mul(innerSquare);
          return vec3(s);
        }

        case 21: {
          const s = floor(uv().x.mul(10)).div(10);
          return vec3(s);
        }

        case 22: {
          const x = floor(uv().x.mul(10)).div(10);
          const y = floor(uv().y.mul(10)).div(10);
          const s = x.mul(y);
          return vec3(s);
        }

        case 23: {
          const s = fract(
            sin(dot(uv(), vec2(12.9898, 78.233))).mul(43758.5453123)
          );
          return vec3(s);
        }

        case 24: {
          const gridUv = vec2(
            floor(uv().x.mul(10)).div(10),
            floor(uv().y.mul(10)).div(10)
          );
          const s = fract(
            sin(dot(gridUv, vec2(12.9898, 78.233))).mul(43758.5453123)
          );
          return vec3(s);
        }

        case 25: {
          const gridUv = vec2(
            floor(uv().x.mul(10)).div(10),
            floor(uv().y.mul(10).add(uv().x.mul(5))).div(10)
          );

          const s = fract(
            sin(dot(gridUv, vec2(12.9898, 78.233))).mul(43758.5453123)
          );

          return vec3(s);
        }

        case 26: {
          return vec3(length(uv()));
        }

        case 27: {
          return vec3(distance(uv(), vec2(0.5)));
        }

        case 28: {
          return vec3(oneMinus(distance(uv(), vec2(0.5))));
        }

        case 29: {
          return vec3(div(0.015, distance(uv(), vec2(0.5))));
        }

        case 30: {
          const stretchedUv = vec2(
            uv().x.mul(0.2).add(0.4),
            uv().y.mul(0.5).add(0.25)
          );

          const strength = float(0.015).div(distance(stretchedUv, vec2(0.5)));

          return vec3(strength);
        }

        case 31: {
          const x = float(0.015).div(
            distance(
              vec2(uv().x.mul(0.2).add(0.4), uv().y.mul(0.5).add(0.25)),
              vec2(0.5)
            )
          );
          const y = float(0.015).div(
            distance(
              vec2(uv().y.mul(0.2).add(0.4), uv().x.mul(0.5).add(0.25)),
              vec2(0.5)
            )
          );
          return vec3(x.mul(y));
        }

        case 32: {
          const rotatedUv = rotateUV(uv(), float(Math.PI / 4), vec2(0.5));

          const x = float(0.015).div(
            distance(
              vec2(
                rotatedUv.x.mul(0.2).add(0.4),
                rotatedUv.y.mul(0.5).add(0.25)
              ),
              vec2(0.5)
            )
          );
          const y = float(0.015).div(
            distance(
              vec2(
                rotatedUv.y.mul(0.2).add(0.4),
                rotatedUv.x.mul(0.5).add(0.25)
              ),
              vec2(0.5)
            )
          );
          return vec3(x.mul(y));
        }

        case 33: {
          return vec3(distance(uv(), 0.5).step(0.25));
        }

        case 34: {
          return vec3(distance(uv(), 0.5).sub(0.25).abs());
        }

        case 35: {
          return vec3(distance(uv(), 0.5).sub(0.25).abs().step(0.01));
        }

        case 36: {
          return vec3(oneMinus(distance(uv(), 0.5).sub(0.25).abs().step(0.01)));
        }

        case 37: {
          const wave = sin(uv().x.mul(30)).mul(0.1);
          const wavedUv = uv().add(vec2(0, wave));
          const circle = oneMinus(
            distance(wavedUv, 0.5).sub(0.25).abs().step(0.01)
          );
          return vec3(circle);
        }

        case 38: {
          const waveX = sin(uv().x.mul(30)).mul(0.1);
          const waveY = sin(uv().y.mul(30)).mul(0.1);
          const wavedUv = uv().add(vec2(waveY, waveX));
          const circle = oneMinus(
            distance(wavedUv, 0.5).sub(0.25).abs().step(0.01)
          );
          return vec3(circle);
        }

        case 39: {
          const waveX = sin(uv().x.mul(100)).mul(0.1);
          const waveY = sin(uv().y.mul(100)).mul(0.1);
          const wavedUv = uv().add(vec2(waveY, waveX));
          const circle = oneMinus(
            distance(wavedUv, 0.5).sub(0.25).abs().step(0.01)
          );
          return vec3(circle);
        }

        case 40: {
          const angle = atan(uv().y, uv().x);
          return vec3(angle);
        }

        case 41: {
          const offsetUv = uv().sub(0.5);
          const angle = atan(offsetUv.y, offsetUv.x);
          return vec3(angle);
        }

        case 42: {
          const offsetUv = uv().sub(0.5);
          const angle = atan(offsetUv.y, offsetUv.x)
            .div(Math.PI * 2)
            .add(0.5);
          return vec3(angle);
        }

        case 43: {
          const offsetUv = uv().sub(0.5);
          const angle = atan(offsetUv.y, offsetUv.x)
            .div(Math.PI * 2)
            .add(0.5)
            .mul(20)
            .mod(1);
          return vec3(angle);
        }

        case 44: {
          const offsetUv = uv().sub(0.5);
          const angle = sin(
            atan(offsetUv.y, offsetUv.x)
              .div(Math.PI * 2)
              .add(0.5)
              .mul(100)
          );
          return vec3(angle);
        }

        case 45: {
          const offsetUv = uv().sub(0.5);
          const radius = sin(
            atan(offsetUv.y, offsetUv.x)
              .div(Math.PI * 2)
              .add(0.5)
              .mul(100)
          );
          const circle = oneMinus(
            abs(
              distance(uv(), 0.5).sub(float(0.25).add(radius.mul(0.01)))
            ).step(0.015)
          );
          return vec3(circle);
        }

        case 46: {
          return vec3(mx_noise_float(uv().mul(10)));
        }

        case 47: {
          return vec3(mx_noise_float(uv().mul(10)).step(0));
        }

        case 48: {
          return vec3(mx_noise_float(uv().mul(10)).mul(3).abs().oneMinus());
        }

        case 49: {
          return vec3(sin(mx_noise_float(uv().mul(10)).mul(20)));
        }

        case 50: {
          return vec3(sin(mx_noise_float(uv().mul(10)).mul(20)).step(0.9)).mix(
            0,
            uv().add(vec3(0, 0, 1))
          );
        }

        default:
          return color(0x000000);
      }
    })();

    return {
      nodes: {
        colorNode,
      },
    };
  }, [selectedPattern]);
}

const PatternList = Array.from({ length: 50 }, (_, i) => i + 1);

export function usePatternsControl() {
  const { selectedPattern } = useControls(
    "🏁 2 — Patterns",
    {
      selectedPattern: {
        label: "Selected",
        value: 1,
        options: PatternList,
        step: 1,
      },
    },
    { collapsed: true }
  );

  return { selectedPattern };
}

import type { UniformNode } from "three/webgpu";
import type { Color, Vector2, Vector3, Vector4 } from "three";

type MappedValue<T> = T extends number
  ? number
  : T extends boolean
    ? boolean
    : T extends string
      ? Color
      : T extends [number, number]
        ? Vector2
        : T extends [number, number, number]
          ? Vector3
          : T extends [number, number, number, number]
            ? Vector4
            : unknown;

export type UniformSet<T> = {
  [K in keyof T]: T[K] extends object
    ? T[K] extends ReadonlyArray<unknown>
      ? UniformNode<MappedValue<T[K]>> // Arrays -> UniformNode<Vector3>
      : UniformSet<T[K]> // Objects -> Recurse
    : UniformNode<MappedValue<T[K]>>; // Primitives -> UniformNode<number/Color>
};

import { Vector3, type Vector3Tuple } from "three";

type PositionProp =
  | number
  | Vector3
  | [number, number, number]
  | readonly [number, number, number]
  | Readonly<Vector3>
  | undefined;

export function toVector3Tuple(
  position: PositionProp,
  fallback: Vector3Tuple = [0, 0, 0],
): Vector3Tuple {
  if (position == null) return fallback;

  if (Array.isArray(position)) {
    if (position.length !== 3)
      throw new Error("position tuple must have length 3");

    const [x, y, z] = position;
    if (
      typeof x !== "number" ||
      typeof y !== "number" ||
      typeof z !== "number"
    ) {
      throw new Error("position tuple must contain numbers");
    }

    return [x, y, z];
  }

  if (position instanceof Vector3) {
    return [position.x, position.y, position.z];
  }

  if (typeof position === "number") {
    return [position, position, position];
  }

  return fallback;
}

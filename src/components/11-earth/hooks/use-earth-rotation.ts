import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

export function useEarthRotation() {
  const ref = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.set(0, clock.elapsedTime * 0.05, 0);
  });

  return ref;
}

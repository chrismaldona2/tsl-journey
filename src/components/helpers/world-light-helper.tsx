import { createPortal, useThree, type ThreeElements } from "@react-three/fiber";
import type { RefObject } from "react";
import type { Mesh } from "three";

type MeshProps = ThreeElements["mesh"];
type MeshBasicNodeMaterialProps = ThreeElements["meshBasicNodeMaterial"];

type WorldLightHelperProps = {
  ref?: RefObject<Mesh | null>;
  position?: MeshProps["position"];
  scale?: MeshProps["scale"];
  color?: MeshBasicNodeMaterialProps["color"];
};

export default function WorldLightHelper({
  ref,
  position,
  scale,
  color,
}: WorldLightHelperProps) {
  const scene = useThree((s) => s.scene);

  return createPortal(
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicNodeMaterial colorNode={color} />
    </mesh>,
    scene,
  );
}

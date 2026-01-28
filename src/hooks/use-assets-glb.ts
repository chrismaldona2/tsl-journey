import { useGLTF } from "@react-three/drei";
import type { Mesh } from "three";

type AssetsGLB = {
  nodes: {
    car: Mesh;
    koi: Mesh;
    portal_gun: Mesh;
    skull: Mesh;
    whale: Mesh;
    coffee: Mesh;
    dino: Mesh;
    robot: Mesh;
  };
};

export function useAssetsGLB() {
  const glb = useGLTF("/models/assets.glb", "/draco/") as unknown as AssetsGLB;

  return glb.nodes;
}

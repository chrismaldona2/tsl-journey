import { MeshBasicNodeMaterial } from "three/webgpu";
import type { MaterialNode } from "@react-three/fiber";

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshBasicNodeMaterial: MaterialNode<
      MeshBasicNodeMaterial,
      typeof MeshBasicNodeMaterial
    >;
  }
}

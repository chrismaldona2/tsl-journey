import { ThreeElements } from "@react-three/fiber";
import Label from "../label";
import { useHologramControls, useHologramMaterial } from "./hologram-hooks";
import { useGLTF } from "@react-three/drei";
import { DoubleSide, Mesh } from "three";

export default function Hologram(props: ThreeElements["group"]) {
  const { nodes: gltfNodes } = useGLTF("/models/dino.glb", "/draco/");
  const { nodes, uniforms } = useHologramMaterial();
  useHologramControls(uniforms);

  return (
    <group {...props}>
      <Label>6</Label>

      <mesh
        scale={0.17}
        position-y={-0.45}
        geometry={(gltfNodes.dino as Mesh).geometry}
      >
        <meshBasicNodeMaterial
          side={DoubleSide}
          depthWrite={false}
          transparent={true}
          {...nodes}
        />
      </mesh>
    </group>
  );
}

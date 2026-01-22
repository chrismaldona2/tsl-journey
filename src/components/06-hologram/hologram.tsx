import { type ThreeElements } from "@react-three/fiber";
import { useHologramControls, useHologramMaterial } from "./hologram-hooks";
import { useGLTF } from "@react-three/drei";
import { DoubleSide, Mesh } from "three";

export default function Hologram(props: ThreeElements["group"]) {
  const dino = useGLTF("/models/dino.glb", "/draco/").nodes.dino as Mesh;
  const { nodes, uniforms } = useHologramMaterial();
  useHologramControls(uniforms);

  return (
    <group {...props}>
      <mesh scale={0.17} position-y={-0.45} geometry={dino.geometry}>
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

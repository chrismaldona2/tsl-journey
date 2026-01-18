"use client";
import { useGLTF } from "@react-three/drei";
import { ThreeElements } from "@react-three/fiber";
import { DoubleSide, Mesh } from "three";
import Label from "../label";
import { useCoffeeSteamControls, useCoffeeSteamMaterial } from "./coffee-hooks";

export default function Coffee(props: ThreeElements["group"]) {
  const { nodes: gltfNodes, materials } = useGLTF("/models/coffee.glb");

  const { nodes, uniforms } = useCoffeeSteamMaterial();
  useCoffeeSteamControls(uniforms);

  return (
    <group {...props}>
      <Label>5</Label>

      {/* Coffee Cup */}
      <mesh
        geometry={(gltfNodes.baked as Mesh).geometry}
        material={materials.baked}
        scale={0.15}
      />

      {/* Coffee Steam */}
      <mesh position-y={0.3} scale={[0.225, 0.6, 0.225]}>
        <planeGeometry args={[1, 1, 64, 64]} />
        <meshBasicNodeMaterial
          side={DoubleSide}
          depthWrite={false}
          transparent
          {...nodes}
        />
      </mesh>
    </group>
  );
}

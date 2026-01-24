import { useGLTF } from "@react-three/drei";
import { type ThreeElements } from "@react-three/fiber";
import type { Mesh } from "three";
import useHalftoneShadingMaterial from "./use-halftone-shading-material";

export default function HalftoneShading(props: ThreeElements["group"]) {
  const model = useGLTF("/models/car.glb", "/draco/").nodes.car as Mesh;
  const { nodes } = useHalftoneShadingMaterial();

  return (
    <group {...props}>
      <mesh position-y={-0.2} geometry={model.geometry}>
        <meshBasicNodeMaterial {...nodes} />
      </mesh>

      <mesh scale={0.3} position={[1.5, -0.2, 0]}>
        <sphereGeometry />
        <meshBasicMaterial {...nodes} />
      </mesh>
    </group>
  );
}

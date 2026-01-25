import { useGLTF } from "@react-three/drei";
import { type ThreeElements } from "@react-three/fiber";
import type { Mesh } from "three";
import useHalftoneShadingMaterial from "./hooks/use-halftone-shading-material";
import useHalftoneShadingControls from "./hooks/use-halftone-shading-controls";

export default function HalftoneShading(props: ThreeElements["group"]) {
  const model = useGLTF("/models/car.glb", "/draco/").nodes.car as Mesh;
  const { nodes, uniforms } = useHalftoneShadingMaterial();
  useHalftoneShadingControls(uniforms);

  return (
    <group {...props}>
      <mesh position-y={-0.2} geometry={model.geometry}>
        <meshBasicNodeMaterial {...nodes} />
      </mesh>
    </group>
  );
}

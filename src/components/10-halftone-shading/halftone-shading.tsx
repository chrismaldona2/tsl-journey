import { type ThreeElements } from "@react-three/fiber";
import useHalftoneShadingMaterial from "./hooks/use-halftone-shading-material";
import useHalftoneShadingControls from "./hooks/use-halftone-shading-controls";
import { useAssetsGLB } from "@/hooks/use-assets-glb";

export default function HalftoneShading(props: ThreeElements["group"]) {
  const { car } = useAssetsGLB();
  const { nodes, uniforms } = useHalftoneShadingMaterial();
  useHalftoneShadingControls(uniforms);

  return (
    <group {...props}>
      <mesh position-y={-0.2} geometry={car.geometry}>
        <meshBasicNodeMaterial {...nodes} />
      </mesh>
    </group>
  );
}

import { type ThreeElements } from "@react-three/fiber";
import { DoubleSide } from "three";
import { useRagingSeaMaterial } from "./hooks/use-raging-sea-material";
import { useRagingSeaControls } from "./hooks/use-raging-sea-controls";

export default function Sea(props: ThreeElements["group"]) {
  const { nodes, uniforms } = useRagingSeaMaterial();
  useRagingSeaControls(uniforms);

  return (
    <group {...props}>
      <mesh rotation-x={-Math.PI / 2} position-y={-0.1}>
        <planeGeometry args={[1.5, 1.5, 50, 50]} />
        <meshBasicNodeMaterial side={DoubleSide} transparent {...nodes} />
      </mesh>
    </group>
  );
}

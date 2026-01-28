import { type ThreeElements } from "@react-three/fiber";
import { DoubleSide } from "three";
import { useHologramControls } from "./hooks/use-hologram-controls";
import { useHologramMaterial } from "./hooks/use-hologram-material";
import { useAssetsGLB } from "@/hooks/use-assets-glb";

export default function Hologram(props: ThreeElements["group"]) {
  const { dino } = useAssetsGLB();
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

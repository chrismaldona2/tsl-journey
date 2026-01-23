import { type ThreeElements } from "@react-three/fiber";
import { DoubleSide } from "three";
import { useSeaControls, useSeaMaterial } from "./sea-hooks";

export default function Sea(props: ThreeElements["group"]) {
  const { nodes, uniforms } = useSeaMaterial();
  useSeaControls(uniforms);

  return (
    <group {...props}>
      <mesh rotation-x={-Math.PI / 2} position-y={-0.1}>
        <planeGeometry args={[1.5, 1.5, 50, 50]} />
        <meshBasicNodeMaterial side={DoubleSide} transparent {...nodes} />
      </mesh>
    </group>
  );
}

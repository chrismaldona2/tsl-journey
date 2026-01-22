import { type ThreeElements } from "@react-three/fiber";
import { DoubleSide } from "three";
import { usePatternMaterial, usePatternsControl } from "./pattern-hooks";

export default function Patterns(props: ThreeElements["group"]) {
  const { selectedPattern } = usePatternsControl();
  const { nodes } = usePatternMaterial(selectedPattern);

  return (
    <group {...props}>
      <mesh>
        <planeGeometry />
        <meshBasicNodeMaterial
          key={selectedPattern}
          side={DoubleSide}
          {...nodes}
        />
      </mesh>
    </group>
  );
}

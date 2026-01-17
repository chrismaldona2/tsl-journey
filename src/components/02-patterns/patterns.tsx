"use client";
import { ThreeElements } from "@react-three/fiber";
import Label from "../label";
import { DoubleSide } from "three";
import { usePatternMaterial, usePatternsControl } from "./pattern-hooks";

export default function Patterns(props: ThreeElements["group"]) {
  const { selectedPattern } = usePatternsControl();
  const { nodes } = usePatternMaterial(selectedPattern);

  return (
    <group {...props}>
      <Label>2</Label>
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

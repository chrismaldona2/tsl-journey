import { type ThreeElements } from "@react-three/fiber";
import { DoubleSide } from "three";
import WorldLightHelper from "../helpers/world-light-helper";
import { useSeaShadingControls } from "./hooks/use-sea-shading-controls";
import { useSeaShadingMaterial } from "./hooks/use-sea-shading-material";

export default function SeaShading(props: ThreeElements["group"]) {
  const { nodes, uniforms } = useSeaShadingMaterial();
  const { pointLgtHelperRef } = useSeaShadingControls(uniforms);

  return (
    <group {...props}>
      <mesh rotation-x={-Math.PI / 2} position-y={-0.1}>
        <planeGeometry args={[1.5, 1.5, 50, 50]} />
        <meshBasicNodeMaterial side={DoubleSide} transparent {...nodes} />
      </mesh>

      <WorldLightHelper
        ref={pointLgtHelperRef}
        color={uniforms.pointLight.color}
        scale={0.1}
      />
    </group>
  );
}

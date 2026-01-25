import type { ThreeElements } from "@react-three/fiber";
import useEarthMaterial from "./use-earth-material";
import useEarthControls from "./use-earth-controls";
import { useMemo } from "react";
import { BackSide, SphereGeometry } from "three";
import useAtmosphereMaterial from "./use-atmosphere-material";

export default function Earth(props: ThreeElements["group"]) {
  const earthMaterial = useEarthMaterial();
  const atmosphereMaterial = useAtmosphereMaterial();

  const { lightHelperRef } = useEarthControls(
    earthMaterial.uniforms,
    atmosphereMaterial.uniforms,
  );

  const geometry = useMemo(() => new SphereGeometry(1, 48, 48), []);

  return (
    <group {...props}>
      {/* Earth */}
      <mesh position-y={-0.2} geometry={geometry} scale={0.5}>
        <meshBasicNodeMaterial {...earthMaterial.nodes} />
      </mesh>

      {/* Fake Volumetric Atmosphere */}
      <mesh position-y={-0.2} geometry={geometry} scale={0.51}>
        <meshBasicNodeMaterial
          transparent
          side={BackSide}
          {...atmosphereMaterial.nodes}
        />
      </mesh>

      {/* Debug Helper */}
      <mesh ref={lightHelperRef} scale={0.05}>
        <meshBasicMaterial color="white" />
        <icosahedronGeometry args={[1, 2]} />
      </mesh>
    </group>
  );
}

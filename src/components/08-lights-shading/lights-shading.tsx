import { useFrame, type ThreeElements } from "@react-three/fiber";
import { useRef } from "react";
import { type Mesh } from "three";
import { useLightsShadingMaterial } from "./hooks/use-lights-shading-material";
import { useLightsShadingControls } from "./hooks/use-lights-shading-controls";
import WorldLightHelper from "../helpers/world-light-helper";
import { useAssetsGLB } from "@/hooks/use-assets-glb";

export default function LightsShading(props: ThreeElements["group"]) {
  const { koi, whale } = useAssetsGLB();
  const { nodes, uniforms } = useLightsShadingMaterial();
  const { dirLgtHelperRef, pointLgtHelperRef } =
    useLightsShadingControls(uniforms);

  const koiRef = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (!koiRef.current) return;

    koiRef.current.rotation.y = clock.elapsedTime * 0.25;
  });

  return (
    <group {...props}>
      <mesh ref={koiRef} geometry={koi.geometry}>
        <meshBasicNodeMaterial {...nodes} />
      </mesh>

      <mesh geometry={whale.geometry} position-x={1.5}>
        <meshBasicNodeMaterial {...nodes} />
      </mesh>

      {/* Helpers */}
      <WorldLightHelper
        ref={dirLgtHelperRef}
        color={uniforms.directionalLight.color}
        scale={0.15}
      />
      <WorldLightHelper
        ref={pointLgtHelperRef}
        color={uniforms.pointLight.color}
        scale={0.075}
      />
    </group>
  );
}

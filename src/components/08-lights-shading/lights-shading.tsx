// @refresh reset
import { useGLTF } from "@react-three/drei";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { useRef } from "react";
import { DoubleSide, Vector3, type Mesh } from "three";

import {
  useLightsShadingControls,
  useLightsShadingMaterial,
} from "./lights-shading-hooks";

type FishesGLBNodes = {
  koi: Mesh;
  whale: Mesh;
};

const vec = new Vector3();

export default function LightsShading(props: ThreeElements["group"]) {
  const models = useGLTF("/models/fishes.glb", "/draco/")
    .nodes as FishesGLBNodes;

  const { nodes, uniforms } = useLightsShadingMaterial();
  useLightsShadingControls(uniforms);

  const koiRef = useRef<Mesh>(null);
  const pointLightHelper = useRef<Mesh>(null);
  const directionalLightHelper = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (
      !koiRef.current ||
      !pointLightHelper.current ||
      !directionalLightHelper.current
    )
      return;

    uniforms.pointLight.position.value.copy(
      pointLightHelper.current.getWorldPosition(vec),
    );

    uniforms.directionalLight.position.value.copy(
      directionalLightHelper.current.getWorldPosition(vec),
    );

    koiRef.current.rotation.y = clock.elapsedTime * 0.25;
  });

  return (
    <group {...props}>
      <mesh ref={koiRef} geometry={models.koi.geometry}>
        <meshBasicNodeMaterial {...nodes} />
      </mesh>

      <mesh geometry={models.whale.geometry} position-x={1.5}>
        <meshBasicNodeMaterial {...nodes} />
      </mesh>

      {/* Helpers */}
      <mesh
        ref={pointLightHelper}
        position={uniforms.pointLight.position.value}
      >
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshBasicNodeMaterial colorNode={uniforms.pointLight.color} />
      </mesh>
      <mesh
        ref={directionalLightHelper}
        position={uniforms.directionalLight.position.value}
      >
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicNodeMaterial
          side={DoubleSide}
          colorNode={uniforms.directionalLight.color}
        />
      </mesh>
    </group>
  );
}

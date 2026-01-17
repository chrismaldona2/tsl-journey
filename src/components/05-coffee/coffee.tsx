"use client";
import { useGLTF, useTexture } from "@react-three/drei";
import { ThreeElements } from "@react-three/fiber";
import { DoubleSide, Mesh, RepeatWrapping } from "three";
import Label from "../label";
import { useMemo } from "react";
import {
  min,
  oneMinus,
  texture,
  time,
  uniform,
  uv,
  vec2,
  vec3,
} from "three/tsl";

export default function Coffee(props: ThreeElements["group"]) {
  const { nodes: gltfNodes, materials } = useGLTF("/bakedModel.glb");
  const perlinTexture = useTexture("/perlin.png", (t) => {
    t.wrapS = RepeatWrapping;
    t.wrapT = RepeatWrapping;
  });

  const { nodes } = useMemo(() => {
    const coords = uv()
      .sub(vec2(0, time.mul(0.5)))
      .mul(vec2(0.5, 0.3));

    const noise = texture(perlinTexture, coords).r;
    const colorNode = vec3(1, 1, 1);

    const distToHorizontalEdge = min(uv().x, oneMinus(uv().x));
    const distToVerticalEdges = min(uv().y, oneMinus(uv().y));
    const distToEdges = min(distToHorizontalEdge, distToVerticalEdges);

    const fadeThreshold = uniform(0.0);
    const fadeSmoothness = uniform(0.5);
    const edgeFade = distToEdges.smoothstep(
      fadeThreshold,
      fadeThreshold.add(fadeSmoothness)
    );
    const opacityNode = noise.smoothstep(0.35, 1.0).mul(edgeFade);

    return {
      nodes: {
        colorNode,
        opacityNode,
      },
    };
  }, [perlinTexture]);

  return (
    <group {...props}>
      <Label>5</Label>

      {/* Coffee Cup */}
      <mesh
        geometry={(gltfNodes.baked as Mesh).geometry}
        material={materials.baked}
        scale={0.15}
      />

      {/* Coffee Steam */}
      <mesh position-y={0.3} scale={[0.225, 0.6, 0.225]}>
        <planeGeometry args={[1, 1, 64, 64]} />
        <meshBasicNodeMaterial side={DoubleSide} transparent {...nodes} />
      </mesh>
    </group>
  );
}

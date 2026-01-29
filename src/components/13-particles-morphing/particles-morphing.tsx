import type { ThreeElements } from "@react-three/fiber";
import { AdditiveBlending } from "three";
import { useParticlesMorphingMaterial } from "./hooks/use-particles-morphing-material";
import useParticlesMorphingControls from "./hooks/use-particles-morphing-controls";

export default function ParticlesMorphing(props: ThreeElements["group"]) {
  const { nodes, maxParticleCount, uniforms, attributes, geometryBuffers } =
    useParticlesMorphingMaterial();

  useParticlesMorphingControls(uniforms, attributes, geometryBuffers);

  return (
    <group {...props}>
      <instancedMesh args={[undefined, undefined, maxParticleCount]}>
        <planeGeometry args={[1, 1]}>
          <primitive object={attributes.posA} attach="attributes-posA" />
          <primitive object={attributes.posB} attach="attributes-posB" />
          <primitive object={attributes.size} attach="attributes-aSize" />
        </planeGeometry>

        <spriteNodeMaterial
          blending={AdditiveBlending}
          depthWrite={false}
          {...nodes}
        />
      </instancedMesh>
    </group>
  );
}

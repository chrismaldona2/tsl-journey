import type { ThreeElements } from "@react-three/fiber";
import useParticlesMorphingMaterial from "./use-particles-morphing-material";
import { AdditiveBlending } from "three";

export default function ParticlesMorphing(props: ThreeElements["group"]) {
  const { nodes, maxParticleCount } = useParticlesMorphingMaterial();

  return (
    <group {...props}>
      <sprite count={maxParticleCount}>
        <spriteNodeMaterial
          blending={AdditiveBlending}
          depthWrite={false}
          {...nodes}
        />
      </sprite>
    </group>
  );
}

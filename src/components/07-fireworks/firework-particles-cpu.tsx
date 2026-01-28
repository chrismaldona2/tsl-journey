import { type Vector3Tuple } from "three";
import { useFireworkCPU } from "./hooks/use-firework-cpu";
import { fireworkConfig, type FireworkParams } from "./config";

type FireworkParticlesCPUProps = {
  position: Vector3Tuple;
  params?: Partial<FireworkParams>;
  onComplete?: () => void;
};

export default function FireworkParticlesCPU({
  position,
  onComplete,
  params,
}: FireworkParticlesCPUProps) {
  const nodes = useFireworkCPU({ onAnimationComplete: onComplete, params });

  return (
    <sprite
      count={params?.particleSize ?? fireworkConfig.particleCount}
      position={position}
    >
      <spriteNodeMaterial depthWrite={false} transparent {...nodes} />
    </sprite>
  );
}

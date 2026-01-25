import type { Vector3Tuple } from "three";
import { useFireworkGPU } from "./hooks/use-firework-gpu";
import { fireworkConfig, type FireworkParams } from "./config";

type FireworkParticlesCPUProps = {
  position?: Vector3Tuple;
  params?: Partial<FireworkParams>;
  onComplete?: () => void;
};

export default function FireworkParticlesGPU({
  position = [0, 0, 0],
  params,
  onComplete,
}: FireworkParticlesCPUProps) {
  const nodes = useFireworkGPU({ onAnimationComplete: onComplete, params });

  return (
    <sprite
      count={params?.particleCount ?? fireworkConfig.particleCount}
      position={position}
    >
      <pointsNodeMaterial depthWrite={false} transparent={true} {...nodes} />
    </sprite>
  );
}

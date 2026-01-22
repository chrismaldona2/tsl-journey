import type { Vector3Tuple } from "three";
import { useFireworkGPU } from "./hooks/use-firework-gpu";
import { FireworkDefaultSettings, type FireworkSettings } from "./config";

type FireworkParticlesCPUProps = {
  position?: Vector3Tuple;
  settings?: Partial<FireworkSettings>;
  onComplete?: () => void;
};

export default function FireworkParticlesGPU({
  position = [0, 0, 0],
  settings = FireworkDefaultSettings,
  onComplete,
}: FireworkParticlesCPUProps) {
  const nodes = useFireworkGPU({ onAnimationComplete: onComplete, settings });

  return (
    <sprite count={settings.particleCount} position={position}>
      <pointsNodeMaterial depthWrite={false} transparent={true} {...nodes} />
    </sprite>
  );
}

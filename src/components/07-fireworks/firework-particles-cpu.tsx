import { type Vector3Tuple } from "three";
import { useFireworkCPU } from "./hooks/use-firework-cpu";
import { FireworkDefaultSettings, type FireworkSettings } from "./config";

type FireworkParticlesCPUProps = {
  position: Vector3Tuple;
  settings?: Partial<FireworkSettings>;
  onComplete?: () => void;
};

export default function FireworkParticlesCPU({
  position,
  onComplete,
  settings = FireworkDefaultSettings,
}: FireworkParticlesCPUProps) {
  const nodes = useFireworkCPU({ onAnimationComplete: onComplete, settings });

  return (
    <sprite count={settings.particleCount} position={position}>
      <pointsNodeMaterial depthWrite={false} transparent {...nodes} />
    </sprite>
  );
}

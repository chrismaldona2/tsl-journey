import { type ThreeElements } from "@react-three/fiber";
import { Suspense } from "react";
import { useFireworkTrigger } from "./hooks/use-firework-trigger";
import FireworkParticlesGPU from "./firework-particles-gpu";
import FireworkParticlesCPU from "./firework-particles-cpu";
import useFireworkControls from "./hooks/use-firework-controls";

const FIREWORK_CURSOR = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewport="0 0 32 32" style="fill:black;font-size:24px;"><text y="50%">💥</text></svg>') 16 16, auto`;

export default function Fireworks(props: ThreeElements["group"]) {
  const fireworkSettings = useFireworkControls();
  const { fireworkQueue, triggerFirework, removeFirework } =
    useFireworkTrigger(fireworkSettings);

  return (
    <group {...props}>
      <mesh
        name="FireworkTrigger"
        scale={1.2}
        onClick={triggerFirework}
        onPointerEnter={() => {
          document.body.style.cursor = FIREWORK_CURSOR;
        }}
        onPointerLeave={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <boxGeometry />
        <meshBasicNodeMaterial color="#e1ac77" wireframe />
      </mesh>

      <Suspense fallback={null}>
        {fireworkQueue.map(({ id, position, settings }) => {
          const Component = settings?.fullGPU
            ? FireworkParticlesGPU
            : FireworkParticlesCPU;

          return (
            <Component
              key={id}
              position={position}
              settings={settings}
              onComplete={() => removeFirework(id)}
            />
          );
        })}
      </Suspense>
    </group>
  );
}

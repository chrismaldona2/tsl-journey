import { useFrame, type ThreeElements } from "@react-three/fiber";
import useParticlesMaterial from "./use-particles-cursor-material";
import { particlesCursorConfig as config } from "./config";
import { useMemo, useRef } from "react";
import { UITunnel } from "../helpers/tunnels";
import { CanvasTexture, DoubleSide, Vector2 } from "three";

const canvasSize = 128;
const displacementMap = new CanvasTexture(document.createElement("canvas"));

export default function ParticlesCursor(props: ThreeElements["group"]) {
  const canvas2D = useRef<HTMLCanvasElement>(null);

  const canvasCursor = useRef(new Vector2(9999, 9999));
  const canvasCursorPrevious = useRef(new Vector2(9999, 9999));

  const glowTexture = useMemo(() => {
    const img = new Image();
    img.src = "/textures/glow.png";
    return img;
  }, []);

  useFrame(() => {
    if (!canvas2D.current) return;

    const ctx = canvas2D.current.getContext("2d");
    if (!ctx) return;

    /*
     * Fade Effect
     */
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 0.02;
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    /*
     * Glow Draw
     */
    const cursor = canvasCursor.current;
    const cursorPrevious = canvasCursorPrevious.current;
    const cursorDistance = cursorPrevious.distanceTo(cursor);

    const alpha = Math.min(cursorDistance * 0.1, 1);
    cursorPrevious.copy(cursor);

    const glowSize = canvasSize * 0.25;
    ctx.globalCompositeOperation = "lighten";
    ctx.globalAlpha = alpha;
    ctx.drawImage(
      glowTexture,
      cursor.x - glowSize / 2,
      cursor.y - glowSize / 2,
      glowSize,
      glowSize,
    );

    displacementMap.image = canvas2D.current;
    displacementMap.needsUpdate = true;
  });

  const { nodes } = useParticlesMaterial(displacementMap);

  return (
    <group scale={0.8} position-y={-0.15} {...props}>
      {/* Particles */}
      <sprite count={config.particleCount}>
        <spriteNodeMaterial {...nodes} />
      </sprite>

      {/* Interactive Plane */}
      <mesh
        onPointerMove={({ uv }) => {
          if (!uv) return;
          canvasCursor.current.set(uv.x * canvasSize, (1 - uv.y) * canvasSize);
        }}
        visible={false}
      >
        <planeGeometry args={[1.92, 1.92]} />
        <meshBasicNodeMaterial side={DoubleSide} color="red" />
      </mesh>

      {/* 2D Canvas */}
      <UITunnel.In>
        <canvas
          ref={canvas2D}
          width={128}
          height={128}
          className="fixed bottom-0 left-0 size-52 z-9999999"
          style={{ display: "none" }}
        />
      </UITunnel.In>
    </group>
  );
}

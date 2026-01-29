import { useRef, useMemo, useEffect, useCallback } from "react";
import { CanvasTexture, Vector2 } from "three";
import { particlesCursorConfig as config } from "../config";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useControls } from "leva";

/*
 * Prevents trailing artifacts on first render by putting the default position off-screen
 */
const hiddenCursorPos = 9999;

export function useParticlesCursorCanvas() {
  /*
   * Cursor Position Tracking
   */
  const canvasCursorPos = useRef(new Vector2(hiddenCursorPos, hiddenCursorPos));
  const smoothedCursorPos = useRef(
    new Vector2(hiddenCursorPos, hiddenCursorPos),
  );
  const canvasCursorPrevPos = useRef(
    new Vector2(hiddenCursorPos, hiddenCursorPos),
  );

  /*
   * Texture used to paint the cursor path in the canvas
   */
  const glowTexture = useMemo(() => {
    const img = new Image();
    img.src = "/textures/glow.png";
    return img;
  }, []);

  /*
   * Canvas setup
   */
  const resourcesRef = useRef<{
    context: CanvasRenderingContext2D;
    texture: CanvasTexture;
  } | null>(null);
  if (resourcesRef.current === null) {
    const canvas = document.createElement("canvas");
    canvas.width = config.canvasSize;
    canvas.height = config.canvasSize;

    canvas.style.position = "fixed";
    canvas.style.bottom = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "9999";
    canvas.style.width = "200px";
    canvas.style.height = "200px";

    const context = canvas.getContext("2d")!;
    const texture = new CanvasTexture(canvas);

    resourcesRef.current = { context, texture };
  }

  /*
   * Displacement texture disposal on unmount
   */
  useEffect(() => {
    return () => {
      resourcesRef.current?.texture.dispose();
    };
  }, []);

  /*
   * 2D Canvas Painting Logic
   */
  const settingsRef = useRef(config);
  useFrame((_, delta) => {
    const resources = resourcesRef.current;
    if (!resources) return;

    const { context, texture } = resources;
    const { cursorRadius, cursorFollowSpeed } = settingsRef.current;

    /*
     * Fade Effect
     */
    context.globalCompositeOperation = "source-over";
    context.globalAlpha = 0.02;
    context.fillRect(0, 0, config.canvasSize, config.canvasSize);

    /*
     * Glow Draw
     */
    const cursor = canvasCursorPos.current;
    const lerpFactor = 1 - Math.exp(-cursorFollowSpeed * delta);
    const smoothedCursor = smoothedCursorPos.current.lerp(cursor, lerpFactor);
    const cursorPrevious = canvasCursorPrevPos.current;
    const cursorDistance = cursorPrevious.distanceTo(smoothedCursor);

    const alpha = Math.min(cursorDistance * 0.1, 1);
    cursorPrevious.copy(smoothedCursor);

    const glowSize = config.canvasSize * cursorRadius;
    context.globalCompositeOperation = "lighten";
    context.globalAlpha = alpha;
    context.drawImage(
      glowTexture,
      smoothedCursor.x - glowSize / 2,
      smoothedCursor.y - glowSize / 2,
      glowSize,
      glowSize,
    );

    texture.needsUpdate = true;
  });

  /*
   * 2D Canvas appending to the DOM for debugging
   */
  const { debug } = useControls("🖱️ 12 — Particles Cursor", {
    debug: {
      label: "Show Debug Canvas",
      value: false,
    },
    cursorRadius: {
      label: "Cursor Radius",
      value: config.cursorRadius,
      min: 0.05,
      max: 1.0,
      onChange: (v) => {
        settingsRef.current.cursorRadius = v;
      },
    },
    cursorLag: {
      label: "Cursor Follow Speed",
      value: config.cursorFollowSpeed,
      min: 0.01,
      max: 10,
      onChange: (v) => {
        settingsRef.current.cursorFollowSpeed = v;
      },
    },
  });

  useEffect(() => {
    if (!resourcesRef.current) return;

    const canvas = resourcesRef.current.context.canvas;
    if (debug) {
      document.body.appendChild(canvas);
    } else {
      if (document.body.contains(canvas)) document.body.removeChild(canvas);
    }

    return () => {
      if (document.body.contains(canvas)) document.body.removeChild(canvas);
    };
  }, [debug]);

  /*
   * Updates target position based on mesh UV coordinates
   */
  const handleCursorMovement = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (!e.uv) return;

    const targetX = e.uv.x * config.canvasSize;
    const targetY = (1 - e.uv.y) * config.canvasSize;

    /*
     * Snap cursor to position on first entry to avoid trailing artifacts
     */
    if (canvasCursorPos.current.x === hiddenCursorPos) {
      smoothedCursorPos.current.set(targetX, targetY);
      canvasCursorPrevPos.current.set(targetX, targetY);
    }

    canvasCursorPos.current.set(targetX, targetY);
  }, []);

  return { resourcesRef, handleCursorMovement };
}

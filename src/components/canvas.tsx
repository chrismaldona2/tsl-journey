"use client";
import { useIsClient } from "@/hooks/useIsClient";
import { Canvas as FiberCanvas, extend } from "@react-three/fiber";
import { MeshBasicNodeMaterial, WebGPURenderer } from "three/webgpu";
import { OrbitControls, Stats } from "@react-three/drei";
import Scene from "./scene";

extend({
  MeshBasicNodeMaterial: MeshBasicNodeMaterial,
});

export default function Canvas() {
  const isClient = useIsClient();
  if (!isClient) return null;

  return (
    <FiberCanvas
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100dvh",
      }}
      gl={async (props) => {
        const renderer = new WebGPURenderer({
          canvas: props.canvas as HTMLCanvasElement,
          powerPreference: "high-performance",
          antialias: true,
          stencil: false,
          alpha: true,
        });
        await renderer.init();
        return renderer;
      }}
      camera={{ position: [8, 1, 2.5] }}
    >
      <Stats />
      <Scene />
      <OrbitControls makeDefault target={[8, 0, 0]} />
    </FiberCanvas>
  );
}

import { Canvas as FiberCanvas, extend } from "@react-three/fiber";
import {
  MeshBasicNodeMaterial,
  PointsNodeMaterial,
  SpriteNodeMaterial,
  WebGPURenderer,
} from "three/webgpu";
import { OrbitControls } from "@react-three/drei";
import type { ReactNode } from "react";

extend({
  MeshBasicNodeMaterial: MeshBasicNodeMaterial,
  PointsNodeMaterial: PointsNodeMaterial,
  SpriteNodeMaterial: SpriteNodeMaterial,
});

export default function Canvas({ children }: { children: ReactNode }) {
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
      camera={{ position: [20.5, 1, 2.5] }}
    >
      <OrbitControls makeDefault target={[19.8, 0, 0]} />
      {children}
    </FiberCanvas>
  );
}

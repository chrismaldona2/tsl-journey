import { useTexture } from "@react-three/drei";
import { type ThreeElements } from "@react-three/fiber";
import { DoubleSide, SRGBColorSpace } from "three";
import { useCoffeeSteamControls } from "./hooks/use-coffee-steam-controls";
import { useCoffeeSteamMaterial } from "./hooks/use-coffee-steam-material";
import { useAssetsGLB } from "@/hooks/use-assets-glb";

export default function Coffee(props: ThreeElements["group"]) {
  const { coffee } = useAssetsGLB();
  const bakedTexture = useTexture("/textures/baked_coffee.png", (tex) => {
    tex.colorSpace = SRGBColorSpace;
    tex.flipY = false;
  });

  const { nodes, uniforms } = useCoffeeSteamMaterial();
  useCoffeeSteamControls(uniforms);

  return (
    <group {...props}>
      {/* Coffee Cup */}
      <mesh geometry={coffee.geometry}>
        <meshBasicNodeMaterial map={bakedTexture} />
      </mesh>

      {/* Coffee Steam */}
      <mesh position-y={0.3} scale={[0.225, 0.6, 0.225]}>
        <planeGeometry args={[1, 1, 64, 64]} />
        <meshBasicNodeMaterial
          side={DoubleSide}
          depthWrite={false}
          transparent
          {...nodes}
        />
      </mesh>
    </group>
  );
}

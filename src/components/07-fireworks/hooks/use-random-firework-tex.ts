/* eslint-disable react-hooks/purity */
import { useTexture } from "@react-three/drei";
import { useMemo } from "react";
import type { Texture } from "three";
import { fireworkTextures } from "../config";

export function useRandomFireworkTex(): Texture {
  const textures = useTexture(fireworkTextures);

  return useMemo(() => {
    return textures[Math.floor(Math.random() * textures.length)];
  }, [textures]);
}

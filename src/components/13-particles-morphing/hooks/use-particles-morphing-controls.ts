import { button, useControls } from "leva";
import { useRef } from "react";
import gsap from "gsap";
import type { useParticlesMorphingMaterial } from "./use-particles-morphing-material";

type ParticlesMorphingMaterialResult = ReturnType<
  typeof useParticlesMorphingMaterial
>;

export default function useParticlesMorphingControls(
  uniforms: ParticlesMorphingMaterialResult["uniforms"],
  attributes: ParticlesMorphingMaterialResult["attributes"],
  geometryBuffers: ParticlesMorphingMaterialResult["geometryBuffers"],
) {
  const uniformsRef = useRef(uniforms);
  const attributesRef = useRef(attributes);

  const currentIndex = useRef(0);
  const isAnimating = useRef(false);

  const [, set] = useControls("🧬 13 — Particles Morphing", () => ({
    progress: {
      label: "Animation Progress",
      value: 0,
      min: 0,
      max: 1,
      step: 0.001,
      onChange: (v) => {
        if (uniformsRef.current) {
          uniformsRef.current.progress.value = v;
        }
      },
      transient: false,
    },
  }));

  const triggerMorph = (targetIndex: number) => {
    if (
      !attributesRef.current ||
      !uniformsRef.current ||
      currentIndex.current === targetIndex ||
      isAnimating.current
    )
      return;

    isAnimating.current = true;

    attributesRef.current.posA.array.set(geometryBuffers[currentIndex.current]);
    attributesRef.current.posA.needsUpdate = true;

    attributesRef.current.posB.array.set(geometryBuffers[targetIndex]);
    attributesRef.current.posB.needsUpdate = true;

    uniformsRef.current.progress.value = 0;
    set({ progress: 0 });

    const proxy = { value: 0 };
    gsap.to(proxy, {
      value: 1,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: () => {
        set({ progress: proxy.value });
      },
      onComplete: () => {
        currentIndex.current = targetIndex;
        isAnimating.current = false;
      },
    });
  };

  useControls("🧬 13 — Particles Morphing", () => ({
    /*
     * Disabled the linter for these specific lines because
     * Leva buttons only fire on click, not during render ↓
     */
    "Morph to Robot": button(() => triggerMorph(0)),
    "Morph to Gun": button(() => triggerMorph(1)),
    "Morph to Skull": button(() => triggerMorph(2)),
  }));
}

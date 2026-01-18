"use client";
import { type ThreeElements } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { DoubleSide } from "three";
import {
  attribute,
  positionLocal,
  sin,
  time,
  uniform,
  uv,
  vec3,
} from "three/tsl";
import Label from "../label";
import { useControls } from "leva";

const segments = 40;
const vertexCount = (segments + 1) * (segments + 1);

export default function Test(props: ThreeElements["group"]) {
  /* Material setup */
  const { nodes, uniforms, randomBuffer } = useMemo(() => {
    const waveFrequency = uniform(10);
    const waveSpeed = uniform(0.2);
    const randomFactor = uniform(0.1);

    /* Position Node */
    // Random spikes
    const randomBuffer = new Float32Array(vertexCount);
    for (let i = 0; i < vertexCount; i++) {
      // eslint-disable-next-line react-hooks/purity
      randomBuffer[i] = Math.random();
    }
    const aRandom = attribute("aRandom", "float");
    // Wave animation
    const wave = sin(
      positionLocal.x.add(time.mul(waveSpeed)).mul(waveFrequency),
    ).mul(0.1);
    // Random spikes + Wave animation
    const positionNode = positionLocal.add(
      vec3(0.0, 0.0, wave.add(aRandom.mul(randomFactor))),
    );

    /* Colors */
    const colorNode = vec3(uv().x, uv().y.mul(aRandom), 1);

    return {
      nodes: {
        colorNode,
        positionNode,
      },
      uniforms: {
        waveFrequency,
        waveSpeed,
        randomFactor,
      },
      randomBuffer,
    };
  }, []);

  /* Debug Controls */
  const uniformsRefs = useRef(uniforms);
  useControls(
    "🧪 1 — Test",
    {
      waveFrequency: {
        label: "Wave Frequency",
        value: uniformsRefs.current.waveFrequency.value,
        onChange: (v) => {
          uniformsRefs.current.waveFrequency.value = v;
        },
      },
      waveSpeed: {
        label: "Wave Speed",
        value: uniformsRefs.current.waveSpeed.value,
        onChange: (v) => {
          uniformsRefs.current.waveSpeed.value = v;
        },
      },
      randomFactor: {
        label: "Random Factor",
        value: uniformsRefs.current.randomFactor.value,
        onChange: (v) => {
          uniformsRefs.current.randomFactor.value = v;
        },
      },
    },
    { collapsed: true },
  );

  return (
    <group {...props}>
      <Label>1</Label>
      <mesh>
        <planeGeometry args={[1, 1, segments, segments]}>
          <bufferAttribute
            args={[randomBuffer, 1]}
            attach="attributes-aRandom"
          />
        </planeGeometry>
        <meshBasicNodeMaterial side={DoubleSide} {...nodes} />
      </mesh>
    </group>
  );
}

import { useTexture } from "@react-three/drei";
import { useControls } from "leva";
import { useMemo, useRef } from "react";
import { RepeatWrapping } from "three";
import {
  uniform,
  color,
  vec2,
  texture,
  uv,
  time,
  positionLocal,
  vec3,
  min,
  oneMinus,
  rotate,
} from "three/tsl";

export function useCoffeeSteamMaterial() {
  const perlinTexture = useTexture("/textures/perlin.png", (t) => {
    t.wrapS = RepeatWrapping;
    t.wrapT = RepeatWrapping;
  });

  return useMemo(() => {
    /* Uniforms */
    const steamColor = uniform(color("#bdbdbd"));
    const riseSpeed = uniform(0.5);
    const cloudScale = uniform(vec2(0.5, 0.3));
    const erosion = uniform(0.35);
    const twistSpeed = uniform(0.01);
    const twistNoiseScale = uniform(0.2);
    const twistAmplitude = uniform(10);
    const windSpeed = uniform(0.025);
    const windAmplitude = uniform(6);
    const edgeFadeStart = uniform(0.0);
    const edgeFadeDistance = uniform(0.5);

    /* Position Node Setup */
    // Twist
    const twistNoiseUV = vec2(
      0.5,
      uv().y.mul(twistNoiseScale).sub(time.mul(twistSpeed)),
    );
    const twistNoiseVal = texture(perlinTexture, twistNoiseUV).r;
    const twistAngle = twistNoiseVal.mul(twistAmplitude);
    const twist = rotate(positionLocal, vec3(0, twistAngle, 0));

    // Wind
    const windNoiseX = texture(
      perlinTexture,
      vec2(0.25, time.mul(windSpeed)),
    ).r.sub(0.5);
    const windNoiseZ = texture(
      perlinTexture,
      vec2(0.75, time.mul(windSpeed)),
    ).r.sub(0.5);

    const windForce = uv().y.pow(2).mul(windAmplitude);
    const windOffset = vec3(windNoiseX, 0, windNoiseZ).mul(windForce);

    const positionNode = twist.add(windOffset);

    /* Opacity Node Setup */
    // Edge Fading
    const distX = min(uv().x, oneMinus(uv().x));
    const distY = min(uv().y, oneMinus(uv().y));
    const distToEdge = min(distX, distY);

    const edgeFade = distToEdge.smoothstep(
      edgeFadeStart,
      edgeFadeStart.add(edgeFadeDistance),
    );

    // Steam Cloud Texture
    const flowUV = uv()
      .sub(vec2(0, time.mul(riseSpeed)))
      .mul(cloudScale);
    const steamPattern = texture(perlinTexture, flowUV).r;

    const opacityNode = steamPattern.smoothstep(erosion, 1.0).mul(edgeFade);

    return {
      nodes: {
        colorNode: steamColor,
        opacityNode,
        positionNode,
      },
      uniforms: {
        steamColor,
        riseSpeed,
        cloudScale,
        erosion,
        twistSpeed,
        twistNoiseScale,
        twistAmplitude,
        windSpeed,
        windAmplitude,
        edgeFadeStart,
        edgeFadeDistance,
      },
    };
  }, [perlinTexture]);
}

type CoffeeSteamUniforms = ReturnType<
  typeof useCoffeeSteamMaterial
>["uniforms"];

export function useCoffeeSteamControls(uniforms: CoffeeSteamUniforms) {
  const uniformsRef = useRef(uniforms);

  useControls(
    "☕ 5 — Coffee Steam",
    {
      steamColor: {
        label: "Color",
        value: "#ffffff",
        onChange: (v) => uniformsRef.current.steamColor.value.set(v),
      },
      riseSpeed: {
        label: "Rise Speed",
        value: 0.5,
        min: 0,
        max: 2,
        onChange: (v) => (uniformsRef.current.riseSpeed.value = v),
      },
      cloudScale: {
        label: "Cloud Scale",
        value: { x: 0.5, y: 0.3 },
        joystick: false,
        onChange: (v) => uniformsRef.current.cloudScale.value.set(v.x, v.y),
      },
      erosion: {
        label: "Erosion",
        value: 0.35,
        min: 0,
        max: 1,
        onChange: (v) => (uniformsRef.current.erosion.value = v),
      },
      twistSpeed: {
        label: "Twist Speed",
        value: 0.01,
        min: 0,
        max: 0.1,
        onChange: (v) => (uniformsRef.current.twistSpeed.value = v),
      },
      twistNoiseScale: {
        label: "Twist Frequency",
        value: 0.2,
        min: 0,
        max: 2,
        onChange: (v) => (uniformsRef.current.twistNoiseScale.value = v),
      },
      twistAmplitude: {
        label: "Twist Amplitude",
        value: 10,
        min: 0,
        max: 20,
        onChange: (v) => (uniformsRef.current.twistAmplitude.value = v),
      },
      windSpeed: {
        label: "Wind Speed",
        value: 0.025,
        min: 0,
        max: 0.5,
        onChange: (v) => (uniformsRef.current.windSpeed.value = v),
      },
      windAmplitude: {
        label: "Wind Amplitude",
        value: 6,
        min: 0,
        max: 20,
        onChange: (v) => (uniformsRef.current.windAmplitude.value = v),
      },
      edgeFadeStart: {
        label: "Edge Fade Start",
        value: 0.0,
        min: 0,
        max: 0.5,
        onChange: (v) => (uniformsRef.current.edgeFadeStart.value = v),
      },
      edgeFadeDistance: {
        label: "Edge Fade Dist",
        value: 0.5,
        min: 0,
        max: 1,
        onChange: (v) => (uniformsRef.current.edgeFadeDistance.value = v),
      },
    },
    { collapsed: true },
  );
}

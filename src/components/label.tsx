import { Html } from "@react-three/drei";
import { HtmlProps } from "@react-three/drei/web/Html";
import { useState } from "react";

export default function Label(props: HtmlProps) {
  const [hidden, setHidden] = useState(false);

  return null;

  return (
    <Html
      position-y={0.7}
      className="text-[0.5rem] text-white font-bold transition-all duration-300"
      onOcclude={setHidden}
      transform
      occlude
      center
      style={{
        opacity: hidden ? 0 : 1,
      }}
      {...props}
    />
  );
}

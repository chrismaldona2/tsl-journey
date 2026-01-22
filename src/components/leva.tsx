import { Leva as LevaControls } from "leva";

export default function Leva() {
  return (
    <LevaControls
      theme={{
        sizes: {
          rootWidth: "350px",
        },
      }}
      collapsed
    />
  );
}

import { Stats } from "@react-three/drei";
import Canvas from "./components/canvas";
import Scene from "./components/scene";
import Leva from "./components/leva";

function App() {
  return (
    <>
      <Leva />
      <Canvas>
        <Scene />
        <Stats />
      </Canvas>
    </>
  );
}

export default App;

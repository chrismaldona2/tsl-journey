import Test from "./01-test/test";
import Patterns from "./02-patterns/patterns";
import Sea from "./03-raging-sea/sea";
import Coffee from "./05-coffee/coffee";
import Hologram from "./06-hologram/hologram";
import Fireworks from "./07-fireworks/fireworks";
import LightsShading from "./08-lights-shading/lights-shading";
import SeaShading from "./09-raging-sea-shading/sea-shading";
import HalftoneShading from "./10-halftone-shading/halftone-shading";
import Earth from "./11-earth/earth";

const SketchesGap = 2;

export default function Scene() {
  return (
    <>
      <Test position-x={SketchesGap * 0} />
      <Patterns position-x={SketchesGap * 1} />
      <Sea position-x={SketchesGap * 2} />
      <Coffee position-x={SketchesGap * 3} />
      <Hologram position-x={SketchesGap * 4} />
      <Fireworks position-x={SketchesGap * 5} />
      <LightsShading position-x={SketchesGap * 6} />
      <SeaShading position-x={SketchesGap * 7.8} />
      <HalftoneShading position-x={SketchesGap * 8.8} />
      <Earth position-x={SketchesGap * 9.8} />
    </>
  );
}

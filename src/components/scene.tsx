"use client";
import Test from "./01-test/test";
import Patterns from "./02-patterns/patterns";
import Sea from "./03-raging-sea/sea";
import Coffee from "./05-coffee/coffee";

const SketchesGap = 2;

export default function Scene() {
  return (
    <>
      <Test position-x={SketchesGap * 0} />
      <Patterns position-x={SketchesGap * 1} />
      <Sea position-x={SketchesGap * 2} />
      <Coffee position-x={SketchesGap * 3} />
    </>
  );
}

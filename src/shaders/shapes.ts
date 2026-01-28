import { Fn, float, vec3, sin, cos } from "three/tsl";
import { Node } from "three/webgpu";

export const getSphereShape = Fn(
  ({ index, count, radius }: { index: Node; count: Node; radius: Node }) => {
    const goldenAngle = float(2.3999632);

    const y = float(1.0).sub(index.div(count.sub(1.0)).mul(2.0));

    const radiusAtY = float(1.0).sub(y.mul(y)).sqrt();
    const theta = index.mul(goldenAngle);

    const x = cos(theta).mul(radiusAtY);
    const z = sin(theta).mul(radiusAtY);

    return vec3(x, y, z).mul(radius);
  },
);

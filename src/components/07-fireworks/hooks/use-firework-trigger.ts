import type { ThreeEvent } from "@react-three/fiber";
import { useState, useCallback } from "react";
import type { Vector3Tuple } from "three";
import { toVector3Tuple } from "../../../lib/vector";
import type { FireworkSettings } from "../config";

type FireworkInstance = {
  id: number;
  position: Vector3Tuple;
  settings?: Partial<FireworkSettings>;
};

export function useFireworkTrigger(fireworkSettings?: FireworkSettings) {
  const [fireworkQueue, setFireworkQueue] = useState<FireworkInstance[]>([]);

  const triggerFirework = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      const clickPoint = e.point.clone();
      const parent = e.object.parent;

      if (parent) {
        parent.worldToLocal(clickPoint);
      }

      const id = Math.floor(Math.random() * 1000000);
      const position = toVector3Tuple(clickPoint);
      setFireworkQueue((prev) => [
        ...prev,
        { id, position, settings: fireworkSettings },
      ]);
    },
    [fireworkSettings],
  );

  const removeFirework = useCallback(
    (id: number) => {
      const isInQueue = fireworkQueue.find((x) => x.id === id);
      if (!isInQueue) return;
      setFireworkQueue((prev) => prev.filter((x) => x.id !== id));
    },
    [fireworkQueue],
  );

  return { fireworkQueue, triggerFirework, removeFirework };
}

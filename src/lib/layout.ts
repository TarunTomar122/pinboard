import { Pin } from "@/types";

interface Point {
  x: number;
  y: number;
}

export function forceLayout(
  pins: Pin[],
  viewportCenter: Point = { x: 500, y: 400 }
): Map<string, Point> {
  const positions = new Map<string, Point>();
  const velocities = new Map<string, Point>();

  // Initialize positions from current pin positions
  for (const pin of pins) {
    positions.set(pin.id, { x: pin.x, y: pin.y });
    velocities.set(pin.id, { x: 0, y: 0 });
  }

  const REPULSION = 50000;
  const ATTRACTION = 0.005;
  const CENTER_GRAVITY = 0.01;
  const DAMPING = 0.8;
  const MIN_DIST = 280;
  const ITERATIONS = 80;

  for (let iter = 0; iter < ITERATIONS; iter++) {
    const forces = new Map<string, Point>();
    for (const pin of pins) {
      forces.set(pin.id, { x: 0, y: 0 });
    }

    // Repulsion between all pairs
    for (let i = 0; i < pins.length; i++) {
      for (let j = i + 1; j < pins.length; j++) {
        const a = positions.get(pins[i].id)!;
        const b = positions.get(pins[j].id)!;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
        const force = REPULSION / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        const fa = forces.get(pins[i].id)!;
        const fb = forces.get(pins[j].id)!;
        fa.x += fx;
        fa.y += fy;
        fb.x -= fx;
        fb.y -= fy;
      }
    }

    // Attraction for shared tags
    for (let i = 0; i < pins.length; i++) {
      for (let j = i + 1; j < pins.length; j++) {
        const shared = pins[i].tags.filter((t) =>
          pins[j].tags.includes(t)
        ).length;
        if (shared === 0) continue;
        const a = positions.get(pins[i].id)!;
        const b = positions.get(pins[j].id)!;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MIN_DIST) continue;
        const force = ATTRACTION * shared * (dist - MIN_DIST);
        const fx = (dx / Math.max(dist, 1)) * force;
        const fy = (dy / Math.max(dist, 1)) * force;

        const fa = forces.get(pins[i].id)!;
        const fb = forces.get(pins[j].id)!;
        fa.x += fx;
        fa.y += fy;
        fb.x -= fx;
        fb.y -= fy;
      }
    }

    // Center gravity
    for (const pin of pins) {
      const pos = positions.get(pin.id)!;
      const f = forces.get(pin.id)!;
      f.x += (viewportCenter.x - pos.x) * CENTER_GRAVITY;
      f.y += (viewportCenter.y - pos.y) * CENTER_GRAVITY;
    }

    // Apply forces
    for (const pin of pins) {
      const pos = positions.get(pin.id)!;
      const vel = velocities.get(pin.id)!;
      const f = forces.get(pin.id)!;

      vel.x = (vel.x + f.x) * DAMPING;
      vel.y = (vel.y + f.y) * DAMPING;
      pos.x += vel.x;
      pos.y += vel.y;
    }
  }

  // Snap to grid
  for (const pin of pins) {
    const pos = positions.get(pin.id)!;
    pos.x = Math.round(pos.x / 20) * 20;
    pos.y = Math.round(pos.y / 20) * 20;
  }

  return positions;
}

// Utilities for calculating points (same as your original code)
const MIN_RADIUS = 7.5;
const MAX_RADIUS = 15;
const DEPTH = 2;
const FIXED_COLOR = "#cbbd93"; // Fixed color for the balls
const NUM_POINTS = 2500;

const calculateColor = (): string => {
  return FIXED_COLOR; // Return the fixed color
};

const randomFromInterval = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

interface Point {
  idx: number;
  position: [number, number, number];
  color: string;
}

export const pointsInner: Point[] = Array.from({ length: NUM_POINTS }, (v, k) => k + 1).map((num) => {
  const randomRadius = randomFromInterval(MIN_RADIUS, MAX_RADIUS);
  const randomAngle = Math.random() * Math.PI * 2;
  const x = Math.cos(randomAngle) * randomRadius;
  const y = Math.sin(randomAngle) * randomRadius;
  const z = randomFromInterval(-DEPTH, DEPTH);
  return {
    idx: num,
    position: [x, y, z],
    color: calculateColor(),
  };
});

export const pointsOuter: Point[] = Array.from({ length: NUM_POINTS / 4 }, (v, k) => k + 1).map((num) => {
  const randomRadius = randomFromInterval(MIN_RADIUS / 2, MAX_RADIUS * 2);
  const angle = Math.random() * Math.PI * 2;
  const x = Math.cos(angle) * randomRadius;
  const y = Math.sin(angle) * randomRadius;
  const z = randomFromInterval(-DEPTH * 10, DEPTH * 10);
  return {
    idx: num,
    position: [x, y, z],
    color: calculateColor(),
  };
});
/** Kind of obstacle; decides which action the player needs. */
export type ObstacleType = 'floor' | 'ceiling' | 'middle';

/** A single hand-placed obstacle: what arrives and when. */
export interface ObstacleSpawn {
  type: ObstacleType;
  timeSec: number;
}

/** Hand-placed obstacles for testing until levels are generated from audio. */
export const TEST_LEVEL: readonly ObstacleSpawn[] = [
  // Warm-up: one of each type, plenty of time to react.
  { type: 'floor', timeSec: 2 },
  { type: 'ceiling', timeSec: 4 },
  { type: 'middle', timeSec: 6 },

  // Same pattern, shorter gaps.
  { type: 'floor', timeSec: 7.5 },
  { type: 'ceiling', timeSec: 9 },
  { type: 'middle', timeSec: 10.5 },

  // Same type twice in a row.
  { type: 'floor', timeSec: 12 },
  { type: 'floor', timeSec: 13.25 },
  { type: 'ceiling', timeSec: 14.5 },
  { type: 'ceiling', timeSec: 15.75 },
  { type: 'middle', timeSec: 17 },
  { type: 'middle', timeSec: 18 },

  // Mixed and tight, close to the minimum gap.
  { type: 'ceiling', timeSec: 19.5 },
  { type: 'floor', timeSec: 20.5 },
  { type: 'middle', timeSec: 21.5 },
  { type: 'floor', timeSec: 22.5 },
  { type: 'ceiling', timeSec: 23.5 },
  { type: 'middle', timeSec: 24.5 },
];

/** Length of one pass through TEST_LEVEL; the level repeats after this. */
export const TEST_LEVEL_DURATION_SEC = 25;

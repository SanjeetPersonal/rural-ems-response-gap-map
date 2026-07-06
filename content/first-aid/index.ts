import type { FirstAidCondition } from "./types";
import { farmInjury } from "./farm-injury";
import { snakeBite } from "./snake-bite";
import { severeBleeding } from "./severe-bleeding";
import { cardiacArrest } from "./cardiac-arrest";
import { allergicReaction } from "./allergic-reaction";
import { heatStroke } from "./heat-stroke";

export type { FirstAidCondition };

export const FIRST_AID_CONDITIONS: FirstAidCondition[] = [
  cardiacArrest,
  severeBleeding,
  farmInjury,
  snakeBite,
  allergicReaction,
  heatStroke,
];

export function getConditionBySlug(slug: string): FirstAidCondition | undefined {
  return FIRST_AID_CONDITIONS.find((c) => c.slug === slug);
}

import { RESPONSE_BUCKETS } from "@/shared/model-constants";

/**
 * Builds a MapLibre `step` expression mapping the estMinutes property to a
 * bucket color, kept in sync with shared/model-constants.ts (the same
 * source used by the legend and the methodology page) so the map, legend,
 * and copy can never show conflicting bucket boundaries.
 */
export function buildChoroplethExpression(): unknown[] {
  const expr: unknown[] = ["step", ["get", "estMinutes"], RESPONSE_BUCKETS[0].color];
  for (let i = 1; i < RESPONSE_BUCKETS.length; i++) {
    expr.push(RESPONSE_BUCKETS[i - 1].maxMinutes, RESPONSE_BUCKETS[i].color);
  }
  return expr;
}

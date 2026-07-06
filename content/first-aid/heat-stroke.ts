import type { FirstAidCondition } from "./types";

export const heatStroke: FirstAidCondition = {
  slug: "heat-stroke",
  title: "Heat Stroke",
  shortDescription: "A life-threatening emergency from overheating -- common during fieldwork, haying, or outdoor labor in hot weather.",
  whenToCall911: "Immediately for confusion, slurred speech, hot/dry or clammy skin, seizure, or loss of consciousness after heat exposure -- heat stroke is a medical emergency, not something to \"walk off.\"",
  steps: [
    "Call 911 -- heat stroke can cause organ damage the longer body temperature stays elevated.",
    "Move the person to shade or a cooler area immediately.",
    "Remove excess clothing and any unnecessary gear.",
    "Cool the person as fast as possible: apply cool, wet cloths or ice packs to the neck, armpits, and groin, or douse/spray them with cool water and fan them. If a tub or trough of cool water is available, immersing the torso can cool even faster.",
    "If they're alert and able to swallow, give small sips of cool water. Do not force fluids if they're confused or not fully alert.",
    "Keep checking responsiveness and breathing until help arrives. Continue active cooling the entire time -- don't stop once they seem a little better.",
    "If they become unresponsive and stop breathing normally, begin CPR (see the Cardiac Arrest guide).",
  ],
  warnings: [
    "Do not give the person alcohol, caffeine, or fever-reducing medication (like acetaminophen or ibuprofen) -- these don't help and can be harmful in heat stroke.",
    "Heat stroke is different from heat exhaustion (which has cool, sweaty skin and a clearer mind). When in doubt, treat it as heat stroke and call 911 -- the cost of overreacting is far lower than the cost of underreacting.",
  ],
};

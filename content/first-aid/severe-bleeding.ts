import type { FirstAidCondition } from "./types";

export const severeBleeding: FirstAidCondition = {
  slug: "severe-bleeding",
  title: "Severe Bleeding",
  shortDescription: "Life-threatening bleeding from a cut, puncture, or traumatic injury.",
  whenToCall911: "Immediately for any bleeding that is spurting, soaking through dressings, or won't stop with firm pressure.",
  steps: [
    "Call 911 first, or have someone else call while you begin care.",
    "If available, put on gloves or use a barrier (plastic bag, clean cloth) between your hands and the wound.",
    "Apply firm, direct pressure on the wound with a clean cloth, gauze, or your hand. Do not remove the cloth if it soaks through -- add more on top and keep pressing.",
    "If the wound is on an arm or leg and bleeding doesn't stop with direct pressure, apply a tourniquet 2-3 inches above the wound (never on a joint) and note the time it was applied.",
    "Keep the person lying down. Raise the injured area above heart level if possible and if it doesn't worsen a fracture.",
    "Keep the person warm with a blanket or coat -- blood loss leads to shock, which is worsened by cold.",
    "Keep talking to the person and monitor if they stay alert. If they become unresponsive, check breathing and be ready to start CPR (see the Cardiac Arrest guide).",
  ],
  warnings: [
    "Do not remove an object that is impaled in the wound -- stabilize it in place with padding and control bleeding around it instead.",
    "Don't peek under a dressing to check the wound -- this disrupts clot formation. Keep adding layers instead.",
  ],
};

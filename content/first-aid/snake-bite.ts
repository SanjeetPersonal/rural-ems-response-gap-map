import type { FirstAidCondition } from "./types";

export const snakeBite: FirstAidCondition = {
  slug: "snake-bite",
  title: "Snake Bite",
  shortDescription: "What to do for a venomous or suspected venomous snake bite while waiting for help.",
  whenToCall911: "Immediately for any bite from a snake you can't positively identify as harmless, or any bite with swelling, severe pain, or a known venomous species in your area.",
  steps: [
    "Call 911 and describe the snake if you safely saw it (color, pattern, size) -- do not try to catch, kill, or handle it, including a dead one; a reflex bite can still inject venom.",
    "Move the person away from the snake's striking range, but otherwise keep them as still and calm as possible. Movement speeds venom spread through the body.",
    "Keep the bitten limb at or slightly below heart level.",
    "Remove rings, watches, and tight clothing near the bite before swelling starts.",
    "Wash the bite gently with soap and water if available. Cover it loosely with a clean, dry dressing.",
    "Note the time of the bite if you can -- this helps responders and hospital staff.",
    "Keep the person calm and still; carry or drive them out only if 911/EMS truly cannot reach the location -- otherwise wait for responders to bring them out safely.",
  ],
  warnings: [
    "Do NOT cut the wound, apply a tourniquet, try to suck out venom, apply ice, or give the person alcohol or caffeine -- all of these are outdated and can make outcomes worse.",
    "Do not wait to see if symptoms develop before calling for help. Venomous bites can worsen quickly, and antivenom works best given early.",
  ],
};

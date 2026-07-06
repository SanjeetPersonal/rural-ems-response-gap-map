import type { FirstAidCondition } from "./types";

export const cardiacArrest: FirstAidCondition = {
  slug: "cardiac-arrest",
  title: "Cardiac Arrest (CPR & AED)",
  shortDescription: "The person is unresponsive and not breathing normally, or only gasping.",
  whenToCall911: "Immediately -- then start CPR right away. Every minute without CPR/defibrillation lowers the chance of survival.",
  steps: [
    "Check responsiveness: tap the person's shoulder and shout. If there's no response, call 911 (or have someone else call) and ask for the AED to be brought if one is nearby.",
    "Check breathing for no more than 10 seconds. Gasping is NOT normal breathing -- treat it as cardiac arrest.",
    "Start chest compressions: push hard and fast in the center of the chest, at least 2 inches deep, at 100-120 compressions per minute (about the tempo of the song 'Stayin' Alive').",
    "Let the chest fully rise between compressions. Minimize interruptions.",
    "If an AED arrives, turn it on and follow its voice prompts -- it will tell you exactly where to place the pads and when to stand clear. It will not shock someone who doesn't need it.",
    "If you're trained in rescue breaths, give 2 breaths after every 30 compressions. If not, hands-only CPR (compressions only, no breaths) is still highly effective and recommended for untrained bystanders.",
    "Keep going until EMS arrives and takes over, the person starts breathing normally, or you are physically unable to continue.",
  ],
  warnings: [
    "Don't be afraid of doing CPR wrong -- doing hands-only compressions is far better than doing nothing while waiting for help.",
    "An AED is safe to use even if you've never used one before; it will only deliver a shock if it detects a shockable rhythm.",
  ],
};

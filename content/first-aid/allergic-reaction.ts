import type { FirstAidCondition } from "./types";

export const allergicReaction: FirstAidCondition = {
  slug: "allergic-reaction",
  title: "Severe Allergic Reaction (Anaphylaxis)",
  shortDescription: "A fast-developing, whole-body allergic reaction -- from a sting, food, or other trigger.",
  whenToCall911: "Immediately for any signs of throat/tongue swelling, trouble breathing, widespread hives, dizziness, or vomiting after a known or suspected allergen exposure.",
  steps: [
    "Call 911 right away, even if an epinephrine auto-injector (EpiPen or similar) is used and symptoms improve -- a second wave of symptoms can follow.",
    "If the person has their own epinephrine auto-injector, help them use it (or use it for them if they can't): press it firmly against the outer mid-thigh, through clothing if needed, and hold for the count specified on the device (usually 3 seconds).",
    "Have the person lie flat with legs raised, unless they're having trouble breathing or vomiting -- in that case let them sit up or lie on their side instead.",
    "Loosen tight clothing and keep them calm and still. Standing or walking can make a reaction worsen faster.",
    "If symptoms haven't improved after 5-15 minutes and a second auto-injector is available, it can be given.",
    "If they become unresponsive and stop breathing normally, begin CPR (see the Cardiac Arrest guide).",
    "Keep track of what triggered the reaction if known -- this helps responders and hospital staff.",
  ],
  warnings: [
    "Don't wait to see if it's \"just hives\" before calling 911 -- anaphylaxis can progress to airway closure within minutes.",
    "Do not give food, drink, or oral medication if the person is having any trouble breathing or swallowing.",
  ],
};

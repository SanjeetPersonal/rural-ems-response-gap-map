import type { FirstAidCondition } from "./types";

export const farmInjury: FirstAidCondition = {
  slug: "farm-injury",
  title: "Farm & Machinery Injury",
  shortDescription: "Entanglement, entrapment, or crush injuries from tractors, augers, PTOs, or grain bins.",
  whenToCall911: "Immediately, before doing anything else. Give your exact location (road name, mile marker, or nearest intersection) -- rural addresses are often hard to pinpoint.",
  steps: [
    "Call 911 first. Stay on the line if you can; dispatchers can talk you through next steps.",
    "Shut off the machine's engine/power source if you can do so without putting yourself at risk. Do not reach into moving parts.",
    "Do not try to free someone from entangled machinery by force or by reversing/restarting the equipment -- this can cause further injury. Wait for trained responders unless there is an immediate life threat (e.g. fire, drowning in grain) that requires action now.",
    "If safe, turn off fuel supply and disconnect the battery to reduce fire risk.",
    "For grain bin entrapment: do not enter the bin yourself. Grain can act like quicksand and bury a person in seconds; a would-be rescuer becomes a second victim far more often than not.",
    "If the person is not entangled but injured (cuts, crush injury, fall), control any bleeding (see the Severe Bleeding guide) and keep them still -- assume a possible spinal or fracture injury and avoid unnecessary movement.",
    "Keep the person warm and calm while waiting. Shock is common with traumatic injuries.",
    "Send someone to the road/driveway entrance to flag down and guide responders in -- rural properties are frequently hard to find.",
  ],
  warnings: [
    "Never enter a grain bin, silo, or manure pit to attempt a rescue -- these environments can also contain deadly gas buildup. Wait for trained rescue crews with proper equipment.",
    "Do not run equipment in reverse to try to free a trapped limb or clothing -- this frequently worsens the injury.",
  ],
};

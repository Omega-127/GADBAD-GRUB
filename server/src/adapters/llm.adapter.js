const env = require('../config/env');

const COMMENTARY_TEMPLATES = {
  RACE_STARTED: [
    "🏁 The green flag waves! Your feast is on the track and the engines are roaring!",
    "🚀 And they're off! The aroma of victory is wafting down the speedway!",
    "🔥 The race is officially underway! Riders are tucking into their slipstreams!",
  ],
  RIDER_MOVED: [
    "🏍️ Racer {racerName} cuts through the turns at {progress}% distance!",
    "💨 Clean cornering from {racerName}, keeping the food steady and warm!",
    "⚡ {racerName} is making solid progress, clocking in with {etaSeconds}s remaining!",
  ],
  CHECKPOINT_REACHED: [
    "📍 Checkpoint cleared! The delivery container seals are holding tight at {progress}%!",
    "🎯 Milestone passed! {racerName} is maintaining blistering pace through sector 2!",
    "🏁 Split time looking sharp! Gravy stabilization systems at 100% efficiency!",
  ],
  TRAFFIC_STARTED: [
    "🛑 Heavy traffic at Samosa Junction! {racerName} is navigating through congestion!",
    "🚦 Yellow flag! Red lights ahead, slowing down the convoy!",
    "⚠️ Sudden snarl-up! Time to test the rider's lane-filtering skills!",
  ],
  TRAFFIC_ENDED: [
    "🟢 Traffic cleared! {racerName} breaks free and hits the throttle hard!",
    "🛣️ Open tarmac ahead! The speedway is clear for a sprint!",
    "🏎️ Out of the bottleneck and straight into warp drive!",
  ],
  BOOST_ACTIVATED: [
    "⚡ NITRO BOOST ACTIVATED! {racerName} bursts forward leaving rivals in the dust!",
    "🔥 Turbo spice injection! Look at that scooter rocket ahead!",
    "🚀 Slipstream maneuver executed! Massive speed boost on the main straight!",
  ],
  ETA_CHANGED: [
    "⏱️ ETA updated! New estimated arrival time: {etaSeconds} seconds!",
    "📊 Precision timing alert: ETA recalibrated as the pace picks up!",
  ],
  RACE_FINISHED: [
    "🏆 CHECKERED FLAG! {racerName} takes the victory! Delivery completed with peak style!",
    "🥇 VICTORY! Hot, fresh, and lightning fast at the doorstep! What a race!",
    "🎉 That's a wrap! The championship trophy goes to {racerName}! Enjoy your grub!",
  ],
};

class LlmAdapter {
  constructor() {
    this.apiKey = env.LLM_API_KEY;
    this.model = env.LLM_MODEL;
  }

  getRandomTemplate(eventType, variables = {}) {
    const list = COMMENTARY_TEMPLATES[eventType] || [
      "🔥 High stakes racing action unfolds on the streets!",
    ];
    let template = list[Math.floor(Math.random() * list.length)];

    for (const [key, value] of Object.entries(variables)) {
      template = template.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
    }
    return template;
  }

  async generateCommentary(eventType, metadata = {}) {
    const { racerName = 'Your Delivery Rider', progress = 0, etaSeconds = 60 } = metadata;

    // If an external LLM key is configured, we could call an LLM API here.
    // However, to keep it zero-latency, reliable, and deterministic for MVP / demo,
    // we use rich dynamic commentary templates.
    return this.getRandomTemplate(eventType, {
      racerName,
      progress,
      etaSeconds,
    });
  }
}

module.exports = new LlmAdapter();

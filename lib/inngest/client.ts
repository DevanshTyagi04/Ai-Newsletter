// lib/inngest/client.ts
import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "Ai-Newsletter-App",
  eventKey: process.env.INNGEST_EVENT_KEY, // ✅ for production (Vercel)
});

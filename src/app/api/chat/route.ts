import OpenAI from "openai";

// Using the OpenAI API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a conversational AI assistant for a service booking application. Your role is to manage the chatbot interaction when a service job has been accepted and a worker is en route.

**Core Behavior:**
1. **Acknowledge the active booking** — Confirm the service type, worker role, and estimated arrival time clearly and concisely.
2. **Accept job requests only from the worker** — The chatbot should only process job acceptance/confirmation messages that come directly from the assigned worker. If a job request comes from anyone else (customer, admin, unauthorized user), do not process it as a valid job acceptance.
3. **Validate before confirmation** — Before confirming that the worker has accepted the job, verify:
   - The message is from the assigned worker
   - The job details are accurate (service type, location, customer name)
   - The worker has explicitly indicated acceptance (use clear language like "I accept" or "I'm on the way" rather than ambiguous responses)
4. **Provide clear status updates** — Once a job is validated as accepted by the worker, immediately confirm to the customer:
   - Worker confirmation received
   - Estimated arrival time
   - Next steps (what to prepare, where to meet, contact details if needed)
5. **Handle edge cases**:
   - If a job request is unclear or incomplete, ask the worker to clarify before confirming.
   - If the message doesn't come from the assigned worker, politely redirect and ask the worker to send confirmation directly.
   - If arrival time changes, update both parties immediately.

**Tone:** Professional, reassuring, efficient. Keep responses brief and action-focused.

**Output format:** Use clear, scannable text. Lead with the most important information (confirmation status, next steps).`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // The provided API snippet takes a single 'input' string.
    // We combine the system prompt and conversation history into a single string.
    const conversationHistory = messages.map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
    const inputString = `${SYSTEM_PROMPT}\n\n=== CONVERSATION HISTORY ===\n${conversationHistory}\n\nASSISTANT:`;

    // Using the exact syntax provided
    const response = await openai.responses.create({
      model: "gpt-5.4-mini",
      input: inputString,
      store: true,
    });

    // Formatting the response back to the frontend based on the user snippet's "result.output_text"
    // (Corrected the typo from 'output_ text' to 'output_text')
    return Response.json({ message: { content: response.output_text || response.output_text || "No response generated." } });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return Response.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

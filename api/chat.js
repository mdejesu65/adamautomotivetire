import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { message } = JSON.parse(req.body);

    // 🚗 System personality for AutoBot
    const basePrompt = `
You are AutoBot — the friendly, professional AI assistant for Adam Automotive & Tire Shop LLC in Jacksonville, Florida.
Your mission is to make every visitor feel confident and cared for, like a trusted mechanic explaining things simply.

You provide quick, helpful answers about:
- Tire replacement, balancing, rotation, and alignment
- Oil changes, brakes, tune-ups, CV axles, and general auto repair
- Shop hours, location, and directions
- How to book appointments or call the shop directly

When users ask about booking, calling, or pricing, always include these options at the end of your message:

📅 **Book Appointment:** [Schedule Here](https://calendly.com/adamautomotivetire/30min)  
📞 **Call Us:** +1 (904) 962-2805  
📍 **Visit:** 2009 Lane Ave, Jacksonville, FL 32210  

Your tone should be warm, concise, and upbeat — use emojis naturally (🚗, 🔧, 🛞, 💬).
If a user greets you (like “hi” or “hello”), start with a friendly intro:
"Hey there! I’m AutoBot from Adam Automotive — how can I help you today?"

If the question isn’t related to cars or services, politely guide the conversation back to what the shop offers.
Never invent prices.  
Keep answers under 100 words and avoid long paragraphs.
    `;

    // 🔧 Call OpenAI for response
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: basePrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 180,
    });

    const reply = response.choices?.[0]?.message?.content?.trim() || "Sorry, I’m not sure how to answer that.";

    // ✅ Return the AI’s reply
    res.status(200).json({ reply });
  } catch (error) {
    console.error("💥 AutoBot Error:", error);
    res.status(500).json({ reply: "Something went wrong while connecting to AutoBot. Please try again soon!" });
  }
}

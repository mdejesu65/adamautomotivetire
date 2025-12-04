import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { message } = JSON.parse(req.body);

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are AutoBot, a friendly automotive assistant that helps users understand car problems and recommends services offered by Adam Automotive & Tire Shop in Jacksonville." },
        { role: "user", content: message },
      ],
    });

    res.status(200).json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong with AutoBot." });
  }
}

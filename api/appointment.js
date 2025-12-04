import OpenAI from "openai";
import nodemailer from "nodemailer";
import twilio from "twilio";

export default async function handler(req, res) {
  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { name, phone, service, preferredDate } = JSON.parse(req.body);

    const message = `
A new appointment request has been received:

Name: ${name}
Phone: ${phone}
Service: ${service}
Preferred Date: ${preferredDate}
    `;

    // Generate AI confirmation message
    const aiResponse = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an appointment assistant for Adam Automotive & Tire Shop. Respond warmly and professionally confirming the booking details and thanking the client.",
        },
        { role: "user", content: `Customer info: ${message}` },
      ],
    });

    const confirmation = aiResponse.choices[0].message.content;

    // Email notification to shop owner
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SHOP_EMAIL,
        pass: process.env.SHOP_EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SHOP_EMAIL,
      to: process.env.SHOP_EMAIL,
      subject: "New Appointment Request - Adam Automotive",
      text: message,
    });

    // ✅ Twilio SMS / WhatsApp confirmation
    const twilioClient = twilio(
      process.env.TWILIO_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // You can use either SMS or WhatsApp. Uncomment the one you prefer:
    // --- SMS ---
    await twilioClient.messages.create({
      from: process.env.TWILIO_PHONE, // your Twilio number
      to: phone, // customer's phone number
      body: confirmation,
    });

    // --- WhatsApp (optional) ---
    /*
    await twilioClient.messages.create({
      from: 'whatsapp:+14155238886', // Twilio WhatsApp sandbox number
      to: `whatsapp:${phone}`,
      body: confirmation,
    });
    */

    res.status(200).json({ success: true, reply: confirmation });
  } catch (error) {
    console.error("Appointment Error:", error);
    res
      .status(500)
      .json({ success: false, error: "There was a problem booking your appointment." });
  }
}

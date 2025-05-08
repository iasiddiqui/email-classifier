import { ChatOpenAI } from "@langchain/openai";

export const classifyEmails = async (emails, openaiKey) => {
  const model = new ChatOpenAI({
    openAIApiKey: openaiKey,
    temperature: 0.2,
    modelName: "gpt-4o",
  });

  // Classify each email using GPT
  const classified = await Promise.all(
    emails.map(async (email) => {
      const prompt = `Classify this email into one of these categories: Important, Promotions, Social, Marketing, Spam, General. Email content: "${email.snippet}"`;

      try {
        const res = await model.invoke(prompt);
        email.category = res.trim();
        return email;
      } catch (err) {
        console.error("Error classifying email:", err);
        email.category = "Unclassified";
        return email;
      }
    })
  );

  return classified;
};

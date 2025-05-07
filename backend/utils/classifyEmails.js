import { ChatOpenAI } from '@langchain/openai';

export const classifyEmails = async (emails, openaiKey) => {
  const model = new ChatOpenAI({
    openAIApiKey: openaiKey,
    temperature: 0.2,
    modelName: 'gpt-3.5-turbo',
  });

  // Classify each email using GPT
  const classified = await Promise.all(
    emails.map(async (email) => {
      const prompt = `Classify this email into one of these categories: Important, Promotions, Social, Marketing, Spam, General. Email content: "${email.snippet}"`;

      try {
        const res = await model.invoke(prompt);
        return { ...email, category: res.text };
      } catch (err) {
        console.error('OpenAI Error:', err.message);
        return { ...email, category: 'Error (Quota Exceeded)' };
      }
    })
  );

  return classified;
};

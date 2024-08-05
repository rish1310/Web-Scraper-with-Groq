import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq(process.env.GROQ_API_KEY);

export async function summarizeText(text) {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that summarizes text."
                },
                {
                    role: "user",
                    content: `Summarize the following product in 3-4 very short points without:\n\n${text.slice(0, 1000)}`
                }
            ],
            model: "mixtral-8x7b-32768",
            max_tokens: 150,
        });

        return completion.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error in summarizeText:', error.response ? error.response.data : error.message);
        return 'Error generating summary';
    }
}
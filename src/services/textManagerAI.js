const openAI = require('openai');

const openai = new openAI({
    apiKey: process.env.OPENAI_API_KEY
});

const manageText = async (inputText, retryCount = 3) => {
    let attempt = 0;

    while (attempt < retryCount) {
        try {
            const completion = await openai.completions.create({
                model: process.env.OPENAI_MODEL,
                prompt: `Проанализируй этот разговор: "${inputText}".
                ${process.env.OPENAI_PROMPT}`,
                max_tokens: 1200,
                temperature: 0.6
            });

            let resultText = completion.choices[0]['text'];

            const parts = resultText.split(/### \[BLOCK\d\]/).map(part => part.trim()).filter(Boolean);

            if (parts.length !== 3) {
                console.error('Unexpected response format', { parts });
                throw new Error('Response from AI has an unexpected format.');
            }

            return {
                roles: parts[0],
                analysis: parts[1],
                suggestions: parts[2]
            };

        } catch (error) {
            console.error(`Error while managing text: ${error}`);
            attempt++;

            if (attempt >= retryCount) {
                throw new Error('Maximum retry attempts reached.');
            }
        }
    }
};

module.exports = {
    manageText
};
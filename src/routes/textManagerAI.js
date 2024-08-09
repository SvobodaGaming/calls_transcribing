const openAI = require('openai');

const openai = new openAI({
    apiKey: process.env.OPENAI_API_KEY
});

const manageText = async (inputText) => {
    try {
        const completion = await openai.completions.create({
            model: 'gpt-3.5-turbo-instruct',
            prompt: `Проанализируй этот разговор: "${inputText}". 
            1. Оцени качество разговора, выяви ошибки, интерпретируй данные и дай рекомендации по доработке текста. 
            2. Представь улучшенный вариант разговора.
            Дай два ответа, КАЖДЫЙ ОБЯЗАТЕЛЬНО с номером.`,
            max_tokens: 1200,
            temperature: 0.8
        });

        const resultText = completion.choices[0]['text'];

        const parts = resultText.split(/1\.\s|2\.\s/).filter(Boolean);

        return {
            analysis: parts[0]?.trim(),
            suggestions: parts[1]?.trim()
        };
    } catch (error) {
        console.error(`Error while managing text: ${error}`);
    }
}

module.exports = {
    manageText
};

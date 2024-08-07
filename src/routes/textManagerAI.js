const openAI = require('openai');

const openai = new openAI({
    apiKey: process.env.OPENAI_API_KEY
});

const manageText = async (inputText) => {

    try {
        const completion = await openai.completions.create({
            model: 'gpt-3.5-turbo-instruct',
            prompt: `Проанализируй этот разговор: ${inputText}\nОцени качество разговора, выяви ошибки, интерпретируй данные и дай рекомендации по доработке текста.`,
            max_tokens: 300,
            temperature: 1
        });
        return completion.choices[0]['text'];
    } catch (error) {
        console.error(`Error while managing text: ${error}`)
    }
}

module.exports = {
    manageText
}
const openAI = require('openai');

const openai = new openAI({
    apiKey: process.env.OPENAI_API_KEY
});

const manageText = async (inputText) => {

    try {
        const completion = await openai.completions.create({
            model: 'gpt-3.5-turbo-instruct',
            prompt: `Проанализируй этот разговор: ${inputText}\nОцени качество разговора, выяви ошибки, интерпретируй данные и дай рекомендации по доработке скрипта.`,
            max_tokens: 7,
            temperature: 0
        });
        return completion.choices[0]['text'];
    } catch (error) {
        console.error(`Error while managing text: ${error}`)
    }
}

module.exports = {
    manageText
}
const openAI = require('openai');

const openai = new openAI({
    apiKey: process.env.OPENAI_API_KEY
});

const manageText = async (inputText) => {
    try {
        const completion = await openai.completions.create({
            model: 'gpt-3.5-turbo-instruct',
            prompt: `Проанализируй этот разговор: "${inputText}".
            1 Оцени качество разговора: выяви ошибки, интерпретируй данные, и дай рекомендации по доработке текста.
            ◦ Приводи ошибки в том порядке, в котором они встречаются в тексте.
            ◦ Если в тексте есть приветствие или название компании, убедись в их правильности.
            ◦ Игнорируй звуковые сигналы (гудки) и пустые фразы без смысловой нагрузки.
            ◦ Если в тексте нет ошибок, напиши: "Ошибок нет".
            2 Представь улучшенный вариант разговора: предложи переработанный текст на основе выявленных ошибок и рекомендаций.
            ◦ Переписывай текст только там, где это необходимо для устранения ошибок или улучшения стилистики.
            ◦ Оставляй элементы текста неизменными, если они корректны.
            Дай два ответа, каждый обязательно в таком формате:
            "1. Оценка и рекомендации.
            2. Улучшенный текст"`,
            max_tokens: 1200,
            temperature: 0.6
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

const openAI = require('openai');

const openai = new openAI({
    apiKey: process.env.OPENAI_API_KEY
});

const manageText = async (inputText) => {
    try {
        const completion = await openai.completions.create({
            model: 'gpt-3.5-turbo-instruct',
            prompt: `Проанализируй этот разговор: "${inputText}".
            ### [BLOCK1] Распредели роли в тексте:
            ◦ Определи, кто является клиентом, а кто — сотрудником компании. Обозначь их как "Клиент" и "Сотрудник" соответственно.
            ◦ Убедись, что речь каждой роли соответствует ее контексту (например, сотрудник должен говорить вежливо и профессионально, а клиент может выражать свои запросы или жалобы).
            ◦ Выведи этот же разговор, но с распределением ролей.

            ### [BLOCK2] Оцени качество разговора:
            ◦ Выяви ошибки, интерпретируй данные, и дай рекомендации по доработке текста.
            ◦ Приводи ошибки в том порядке, в котором они встречаются в тексте.
            ◦ Если в тексте есть приветствие или название компании, убедись в их правильности.
            ◦ Игнорируй звуковые сигналы (гудки) и пустые фразы без смысловой нагрузки.
            ◦ Если в тексте нет ошибок, напиши: "Ошибок нет".

            ### [BLOCK3] Представь улучшенный вариант разговора:
            ◦ Предложи переработанный текст на основе выявленных ошибок и рекомендаций.
            ◦ Переписывай текст только там, где это необходимо для устранения ошибок или улучшения стилистики.
            ◦ Оставляй элементы текста неизменными, если они корректны.

            Дай три ответа, каждый обязательно начинай с ### [BLOCK]:
            ### [BLOCK1] Оригинальный текст с распределением ролей.
            ### [BLOCK2] Оценка качества разговора и рекомендации.
            ### [BLOCK3] Улучшенный текст, с учетом распределенных ролей.`,
            max_tokens: 1200,
            temperature: 0.6
        });

        const resultText = completion.choices[0]['text'];

        const cleanedText = resultText.replace(/\s+/g, ' ').trim();

        const parts = cleanedText.split(/### \[BLOCK\d\]/).filter(Boolean);

        if (parts.length !== 3) {
            console.error('Unexpected response format', { resultText, parts });
            throw new Error('Response from AI has an unexpected format.');
        }

        return {
            roles: parts[0]?.trim(),
            analysis: parts[1]?.trim(),
            suggestions: parts[2]?.trim()
        };

    } catch (error) {
        console.error(`Error while managing text: ${error}`);
        throw error;
    }
}

module.exports = {
    manageText
};

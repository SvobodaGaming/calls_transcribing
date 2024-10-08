const openAI = require('openai');

const openai = new openAI({
    apiKey: process.env.OPENAI_API_KEY
});

const manageText = async (inputText, retryCount = 3) => {
    let attempt = 0;

    while (attempt < retryCount) {
        try {
            const completion = await openai.completions.create({
                model: 'gpt-3.5-turbo-instruct',
                prompt: `Проанализируй этот разговор: "${inputText}".
                ### [BLOCK1] Распредели роли в тексте:
                ◦ Определи, кто является клиентом, а кто — сотрудником компании. Обозначь их как "Клиент" и "Сотрудник" соответственно.
                ◦ Убедись, что речь каждой роли соответствует её контексту. Помни, что сотрудник ВСЕГДА представляет интересы компании Про-Торг (либо созвучное с ним название), должен говорить вежливо и профессионально, а клиент может выражать свои запросы или жалобы более эмоционально.
                ◦ Проверь, не представился ли сотрудник как представитель другой компании — это должно быть исправлено.
                ◦ Выведи этот же разговор, но с распределением ролей, используя формат:
                Клиент: Первая реплика
                Сотрудник: Ответная реплика

                ### [BLOCK2] Оцени качество разговора:
                ◦ Выяви ошибки сотрудника, интерпретируй данные, и дай рекомендации по доработке текста.
                ◦ Приводи ошибки в том порядке, в котором они встречаются в тексте.
                ◦ Если в тексте нет ошибок, напиши: "Ошибок нет".
                ◦ Анализируй ТОЛЬКО ошибки сотрудника, игнорируй недочёты клиента.

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
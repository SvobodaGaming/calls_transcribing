const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

// Функция для генерации уникального имени файла
const generateUniqueFilename = () => {
    const now = new Date();
    const formattedDate = now.toISOString().replace(/[-T:.Z]/g, ''); // Пример: 20240808T123456
    const uniqueId = uuidv4().split('-')[0]; // Сокращаем UUID до первого сегмента
    return `audio-${formattedDate}-${uniqueId}.mp3`;
};

// Функция для обработки вебхуков
const handleWebhook = async (req, res) => {
    console.log('Request file info:', req.file);

    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    const tempFilePath = path.join(__dirname, '../../uploads', req.file.filename);
    const uniqueFilename = generateUniqueFilename();
    const finalFilePath = path.join(__dirname, '../../uploads', uniqueFilename);

    console.log(`Temp file path: ${tempFilePath}`);
    console.log(`Final file path: ${finalFilePath}`);

    try {
        await fs.access(tempFilePath);
        await fs.rename(tempFilePath, finalFilePath);
        console.log(`File saved: ${finalFilePath}`);
        res.status(200).send('Ok');

        // Очистка временного файла (если нужно)
        // await fs.unlink(tempFilePath);
    } catch (err) {
        console.error('Error processing file:', err);
        res.status(500).send('Error processing file');
    }
};

module.exports = {
    handleWebhook
};

const openAI = require('openai');
const fs = require('fs');

const openai = new openAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const transcribeAudio = async (filePath) => {
    const model = 'whisper-1';

    try {
        const fileBuffer = fs.createReadStream(filePath);
        const transcription = await openai.audio.transcriptions.create({
            file: fileBuffer,
            model: model,
        });

        console.log(transcription.text);
    } catch (error) {
        console.error(`Error while transcribing audio: ${error}`);
    }
};

module.exports = {
    transcribeAudio,
}
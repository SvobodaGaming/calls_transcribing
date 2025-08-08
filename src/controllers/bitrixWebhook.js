const path = require('path');
const fs = require('fs').promises;
const { transcribeAudio } = require('../lib/speechToText');
const { manageText } = require('../services/textManagerAI');
const { addTextToSheet } = require('../services/tablesManager');

const generateUniqueFilename = () => {
    const now = new Date();
    const formattedDate = now.toISOString().replace(/[-T:.Z]/g, ''); // Example: 20240808T123456
    return `call-${formattedDate}.mp3`;
};

const handleWebhook = async (req, res) => {
    const formattedDate = new Date().toLocaleString('ru', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZone: 'Europe/Moscow'
    });
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    console.log(`Request file name: ${req.file.originalname}, encoding: ${req.file.encoding} size: ${((req.file.size)/2**10).toFixed(2)}kB, time: ${formattedDate}`);

    const tempFilePath = path.join(__dirname, '../../uploads', req.file.filename);
    const uniqueFilename = generateUniqueFilename();
    const finalFilePath = path.join(__dirname, '../../uploads', uniqueFilename);

    const REMOVE_AUDIO = process.env.REMOVE_AUDIO || 'false';

    try {
        await fs.access(tempFilePath);
        await fs.rename(tempFilePath, finalFilePath);

        const duration = Number(req.body.callDuration);
        if (Number.isNaN(duration) || duration < 7) { // in seconds
        console.warn('Call is too short or invalid duration:', req.body.callDuration);
        return res.status(400).send('Call is too short or invalid duration');
        }

        // Step 1: Transcribe audio to text
        const transcriptionText = await transcribeAudio(finalFilePath);
        if (!transcriptionText) {
            throw new Error('Transcription returned empty result');
        }

        // Step 2: Analyze the transcription text
        const analysisResult = await manageText(transcriptionText);

        // Step 3: Return the result to the client
        await addTextToSheet(analysisResult.roles, req.body.userId, analysisResult.analysis, analysisResult.suggestions);
        res.status(200).send('Done');
    } catch (err) {
        console.error('Error processing file:', err);
        if (!res.headersSent) {
            res.status(500).send('Error processing file');
        }    
    } finally { // Step 4: Remove audio
        if (REMOVE_AUDIO.toLowerCase() === 'true') {
            try {
                await fs.rm(finalFilePath, { force: true });
                console.log(`Audio file removed: ${finalFilePath}`);
            } catch (removeErr) {
                console.warn(`Failed to remove audio file: ${removeErr.message}`);
            }
        }
    }
};

module.exports = {
    handleWebhook,
};

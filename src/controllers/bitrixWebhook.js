const path = require('path');
const fs = require('fs').promises;
const { transcribeAudio } = require('../routes/speechToText');
const { manageText } = require('../routes/textManagerAI');
const { addTextToSheet } = require('../models/tablesManager');

const generateUniqueFilename = () => {
    const now = new Date();
    const formattedDate = now.toISOString().replace(/[-T:.Z]/g, ''); // Example: 20240808T123456
    const uniqueId = uuidv4().split('-')[0]; 
    return `call-${formattedDate}-${uniqueId}.mp3`;
};

const handleWebhook = async (req, res) => {
    const formattedDate = new Date().toLocaleString('ru', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZone: 'Europe/Moscow'
      })
    console.log(`Request file name: ${req.file.originalname}, encoding: ${req.file.encoding} size: ${((req.file.size)/2**20).toFixed(2)}MB, time: ${formattedDate}`);

    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    const tempFilePath = path.join(__dirname, '../../uploads', req.file.filename);
    await fs.rename(tempFilePath, tempFilePath + '.mp3');

    try {
        if (parseInt(req.body.callDuration) >= 5) {
            // Step 1: Transcribe audio to text
            const transcriptionText = await transcribeAudio(tempFilePath + '.mp3');

            // Step 2: Analyze the transcription text
            const analysisResult = await manageText(transcriptionText);

            // Step 3: Return the result to the client
            addTextToSheet(analysisResult.roles, req.body.userId, analysisResult.analysis, analysisResult.suggestions)
            res.status(200).send('Done');

            // Step 4: Removing audio
            await fs.rm(tempFilePath + '.mp3');
        } else {
            console.warn('This call is too short');
            res.status(500).send('Call is too short!');
        }

    } catch (err) {
        console.error('Error processing file:', err);
        res.status(500).send('Error processing file');
    }
};

module.exports = {
    handleWebhook,
};

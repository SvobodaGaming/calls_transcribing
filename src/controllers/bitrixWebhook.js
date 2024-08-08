const fs = require('fs').promises;
const path = require('path');

const handleWebhook = async (req, res) => {
    console.log('Request file info:', req.file);

    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    const tempFilePath = path.join(__dirname, '../../uploads', req.file.filename);
    const finalFilePath = path.join(__dirname, '../../uploads', 'audio.mp3');

    console.log(`Temp file path: ${tempFilePath}`);
    console.log(`Final file path: ${finalFilePath}`);

    try {
        await fs.access(tempFilePath);
        await fs.rename(tempFilePath, finalFilePath);
        console.log(`File saved: ${finalFilePath}`);
        res.status(200).send('Ok');
    } catch (err) {
        console.error('Error processing file:', err);
        res.status(500).send('Error processing file');
    }
};

module.exports = {
    handleWebhook
};

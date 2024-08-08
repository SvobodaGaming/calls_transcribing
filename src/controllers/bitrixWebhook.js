const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');

const ensureDirExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const handleWebhook = (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    ensureDirExists(uploadDir);

    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    const filePath = path.join(uploadDir, req.file.filename);
    const originalName = req.file.originalname;

    fs.rename(filePath, path.join(uploadDir, originalName), (err) => {
        if (err) {
            console.error('Error renaming file:', err);
            return res.status(500).send('Error processing file');
        }
        console.log(`File saved: ${originalName}`);
    });

    console.log(`Webhook received from: ${ip}`);
    res.status(200).send('Ok');
};

module.exports = {
    handleWebhook
};

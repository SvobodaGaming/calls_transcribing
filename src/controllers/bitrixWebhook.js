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

    const tempFilePath = path.join(uploadDir, req.file.filename);
    const originalName = req.file.originalname;
    const finalFilePath = path.join(uploadDir, originalName);

    fs.access(tempFilePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`File does not exist: ${tempFilePath}`);
            return res.status(500).send('Error processing file');
        }

        fs.rename(tempFilePath, finalFilePath, (err) => {
            if (err) {
                console.error('Error renaming file:', err);
                return res.status(500).send('Error processing file');
            }
            console.log(`File saved: ${originalName}`);
            res.status(200).send('Ok');
        });
    });

    console.log(`Webhook received from: ${ip}`);
};

module.exports = {
    handleWebhook
};

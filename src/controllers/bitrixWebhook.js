const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDirectory = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage });

const handleWebhook = (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    console.log(`Webhook received from: ${ip}`);
    console.log(`Request method: ${req.method}`);
    console.log(`Request URL: ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);

    if (req.files && req.files.length > 0) {
        console.log('Files:', req.files);
    } else {
        console.log('No files uploaded');
    }

    res.status(200).send('Ok');
};

module.exports = {
    handleWebhook: upload.any(),
};

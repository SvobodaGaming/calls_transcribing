require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');

const { handleWebhook } = require('./src/controllers/bitrixWebhook');

const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

// Configure multer to accept only audio files
const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        if (file.mimetype && file.mimetype.startsWith('audio/')) {
            cb(null, true);
        } else {
            cb(new Error('Only audio files are allowed'));
        }
    },
});

app.post('/webhook', upload.single('file'), handleWebhook);

app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});

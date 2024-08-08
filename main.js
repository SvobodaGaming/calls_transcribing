require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const { handleWebhook } = require('./src/controllers/bitrixWebhook');
const { transcribeAudio }   = require('./src/routes/speechToText');
const { manageText }        = require('./src/routes/textManagerAI');
const { addTextToSheet }    = require('./src/models/tablesManager');
const { convertAudio } = require('./src/models/convertAudio');

const port = process.env.PORT || 3000;

app = express();

// Используем bodyParser для обработки JSON и URL-кодированных данных
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Подключаем обработчик вебхука
app.use('/webhook', handleWebhook);

app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});

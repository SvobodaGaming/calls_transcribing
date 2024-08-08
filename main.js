require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const { handleWebhook } = require('./src/controllers/bitrixWebhook');
const port = process.env.PORT || 3000;

const app = express();

// Используем bodyParser для обработки JSON и URL-кодированных данных
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Подключаем обработчик вебхука
app.post('/webhook', handleWebhook);

app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});

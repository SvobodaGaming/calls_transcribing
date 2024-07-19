const express       = require('express');
const bodyParser   = require('body-parser');

const handleWebhook = require('src/controllers/bitrixWebhook');

const PORT = process.env.PORT || 3000;

app = express();
app.use(bodyParser.json());

app.use('/webhook', handleWebhook);



app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});
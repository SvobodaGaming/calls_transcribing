const handleWebhook = (req, res) => {
    const event = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    console.log(`Webhook recieved from: ${ip}`);
    res.status(200).send('Ok');

}

module.exports = {
    handleWebhook,
};
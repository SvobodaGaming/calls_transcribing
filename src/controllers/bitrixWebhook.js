const handleWebhook = (req, res) => {
    const event = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    console.log(`Webhook received from: ${ip}`);

    console.log(`Request method: ${req.method}`);
    console.log(`Request URL: ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    
    res.status(200).send('Ok');

};

module.exports = {
    handleWebhook
};

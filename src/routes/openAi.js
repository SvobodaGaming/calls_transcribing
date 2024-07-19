const whisper       = require('whisper-node');

const transcribeAudio = async (filePath) => {
    const options = {
        modelName: '',
        whisperOptions: {
            gen_file_txt: true
        }
    }
    try {
        const whisper = await whisper(filePath, options);
        return whisper;
    } catch (error) {
        console.error(`Error while transcribing audio: ${error}`);
    }
}

module.exports = {
    transcribeAudio,
}
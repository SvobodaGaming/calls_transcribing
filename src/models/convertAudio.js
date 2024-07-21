const ffpegAudio = require('ffmpeg-audio-mixer');

const convertAudio = async(inputFilePath, exportFilePath) => {
    const codec = 'libmp3lame';

    try {
        const converted = await ffpegAudio(`${inputFilePath}`).toFile(`${exportFilePath}`);
        return converted;
    } catch (error) {
        console.log(`Error while converting audio: ${error}`);
    }
}

module.exports = {
    convertAudio,
}
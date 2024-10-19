# Node.js Server for Bitrix24 Webhook Integration 🚀
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

This repository contains a Node.js server built with ExpressJS that integrates with Bitrix24 to handle webhooks, transcribe audio files to text, use OpenAI's GPT-3.5-turbo model to analyze and improve the text, and finally, send the original and modified text to a Google Sheets document.

## Features ✨
- 📬 Receives webhook events from Bitrix24
- 🎙️ Transcribes audio files to text using OpenAI's Whisper model
- 🤖 Analyzes and improves text using GPT-3.5-turbo
- 📊 Stores the original and modified text in a Google Sheets document

## Prerequisites 📋
- 🟢 Node.js (v14 or higher)
- 🛠️ A Bitrix24 account with webhook permissions
- 🔑 An OpenAI API key
- 📧 Google Service Account credentials for accessing Google Sheets

## Setup 🔧

1. Clone the repository:
    ```bash
    git clone https://github.com/SvobodaGaming/calls_transcribing.git
    cd calls_transcribing
    ```

2. Create a `.env` file in the root directory and add the following environment variables:
    ```plaintext
    PORT=3000
    OPENAI_API_KEY=your-openai-api-key
    OPENAI_MODEL=chatgpt-model
    OPENAI_PROMPT=your-prompt
    GOOGLE_SERVICE_ACCOUNT_EMAIL=your-google-service-account-email
    GOOGLE_PRIVATE_KEY=your-google-private-key
    GOOGLE_SPREADSHEET_ID=your-google-spreadsheet-id
    ```

4. Run the server:
    ```bash
    npm run start
    ```
### Or use Docker
1. Create volume:
    ```bash
    docker volume create calls_data
    ```
2. Run container:
    ```bash
    docker run -d --name=calls_transcribing \
     -p 3000:3000 \
     --network=bridge \
     -e PORT=3000 \
     -e OPENAI_API_KEY=your_openai_key \
     -e OPENAI_MODEL=chatgpt-model \
     -e OPENAI_PROMPT=your-prompt \
     -e GOOGLE_SERVICE_ACCOUNT_EMAIL=your_google_service_email \
     -e GOOGLE_PRIVATE_KEY=your_google_key \
     -e GOOGLE_SPREADSHEET_ID=your_spreadsheet_id \
     -v calls_data:/usr/src/app/uploads \
     --restart unless-stopped \
     svobodayt/calls-transcribing
    ```
    

## File Structure 📂

### main.js
This is the entry point of the application. It sets up the Express server, configures middleware, and defines the route for handling Bitrix24 webhooks.

### tablesManager.js
This module handles adding the original and modified text to a Google Sheets document using the Google Sheets API.

### speechToText.js
This module uses OpenAI's API to transcribe audio files to text.

### bitrixWebhook.js
This module handles incoming webhook events from Bitrix24.

## Usage 🛠️

1. Set up the webhook in your Bitrix24 account to point to your server's `/webhook` endpoint.
2. When an audio file is received, it will be transcribed to text using OpenAI.
3. The transcribed text will be analyzed and improved by GPT-3.5-turbo.
4. Both the original and modified texts will be added to a Google Sheets document.

## Contributing 🤝
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License 📜
[Apache-2.0](LICENSE)

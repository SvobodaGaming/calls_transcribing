const { JWT } = require('google-auth-library');
const { GoogleSpreadsheet } = require('google-spreadsheet');

// Initialize auth - see https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication
const addTextToSheet = async (originalText, modifiedText) => {
  try {
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID, serviceAccountAuth);

    await doc.loadInfo();

    const sheet = doc.sheetsById[0];
    
    await sheet.addRow({original: originalText, modified: modifiedText});

    console.log('Information successfully added to Google Sheet');

  } catch (error) {
    console.error(`Error while adding information to Google Sheet: ${error}`);
  }
};

module.exports = {
  addTextToSheet
};

const { JWT } = require('google-auth-library');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const addTextToSheet = async (originalText, userId, mistakes, recommendations) => {
  try {
    // Initialize auth - see https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID, serviceAccountAuth);

    await doc.loadInfo();

    const sheet = doc.sheetsById[0];
    
    const formattedDate = new Date().toLocaleString('ru', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'Europe/Moscow'
    })
    await sheet.addRow({
        "Время": formattedDate,
        "ID пользователя": userId, 
        "Оригинальная запись": originalText, 
        "Ошибки": mistakes, 
        "Рекомендации по улучшению качества разговора": recommendations
    });

    console.log('Information successfully added to Google Sheet');

  } catch (error) {
    console.error(`Error while adding information to Google Sheet: ${error}`);
  }
};

module.exports = {
  addTextToSheet
};

const OAuth = require('oauth');
const { noun_project_key, noun_project_secret } = require('./flags');


const oauth = new OAuth.OAuth(
  'https://api.thenounproject.com',
  'https://api.thenounproject.com',
  noun_project_key,
  noun_project_secret,
  '1.0',
  null,
  'HMAC-SHA1'
);

async function getIconUris(iconName) {
  const {promise, resolve, reject} = Promise.withResolvers();
  const fullQuery = `https://api.thenounproject.com/v2/icon?query=${iconName}&limit_to_public_domain=1&thumbnail_size=84&limit=4`;

  oauth.get(fullQuery, null, null, (e, data) => {
    try {
      const jsonData = JSON.parse(data);
      const iconUris = jsonData.icons.map(icon => icon.thumbnail_url);
      console.log(`Top icons URIs for ${iconName}: ${JSON.stringify(iconUris)}`);
      resolve(iconUris);
    } catch (e) {
      reject(e);
    }
  });
  return promise;
}

module.exports = getIconUris;
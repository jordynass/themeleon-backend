const express = require('express');
const OAuth = require('oauth');
const { noun_project_key, noun_project_secret } = require('./flags');

const router = express.Router();

const oauth = new OAuth.OAuth(
  'https://api.thenounproject.com',
  'https://api.thenounproject.com',
  noun_project_key,
  noun_project_secret,
  '1.0',
  null,
  'HMAC-SHA1'
);

router.get('/', async (req, res) => {
  const iconList = req.query.icons.split(',');
  const iconUris = (await Promise.all(iconList.map(getIconUris))).flat();
  res.json(iconUris.filter(uri => !!uri));
});

async function getIconUris(iconName) {
  const {promise, resolve, reject} = Promise.withResolvers();
  const fullQuery = `https://api.thenounproject.com/v2/icon?query=${iconName}&limit_to_public_domain=1&thumbnail_size=84&limit=4`;

  oauth.get(fullQuery, null, null, (e, data) => {
    try {
      const jsonData = JSON.parse(data);
      console.log(`Noun project response for ${iconName}: ${JSON.stringify(jsonData, null, 2)}`);
      const iconUris = jsonData.icons.map(icon => icon.thumbnail_url);
      console.log(`Top icons URIs for ${iconName}: ${JSON.stringify(iconUris)}`);
      resolve(iconUris);
    } catch (e) {
      reject(e);
    }
  });
  return promise;
}

module.exports = router;
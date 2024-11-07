const { Router } = require('express');
const { gemini_key } = require('./flags');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const getIconUris = require('./icon-utils');


const router = Router();
const geminiClient = new GoogleGenerativeAI(gemini_key);
const model = geminiClient.getGenerativeModel({ model: "gemini-1.5-flash" });

router.get('/:themePrompt', async (req, res) => {
  const themePrompt = req.params.themePrompt;
  const geminiResult = await model.generateContent(formatPromptForRequest(themePrompt));
  const geminiResponseText = geminiResult.response.text();
  console.log(`Response from Gemini for theme prompt ${themePrompt}:\n${geminiResponseText}`);
  const colors = getTags(geminiResponseText, 'Color');
  const iconNames = getTags(geminiResponseText, 'Icon');
  const iconUris = (await Promise.all(iconNames.map(getIconUris))).flat();
  res.json({
    colors,
    iconUris,
  });
});

module.exports = router;

function formatPromptForRequest(themePrompt) {
  return `You are designing an app. Its visual theme is ${themePrompt}.
The visual theme has the following parameters

<Parameters>
<Colors>
2 to 3 colors that evoke the theme of ${themePrompt}. For instance, if the theme is a country, these would be colors
on that country's flag. If the theme is joy, the colors should be bright. If the theme is the 1960s, it could be 
common tie dye color. If the theme is a physical object or substance, it would be colors that would typically appear
in that object/substance.

The colors should be formatted as comma-separate rgb triples from 0 to 255. They should be ordered in the response
in decreasing order of relevance.
</Colors>

<Icons>
Names or brief descriptions of a few visual symbols (5 to 10) associated theme of ${themePrompt}. They must all be different.

Ireland: Clover, Irish flag, Cabbage, Mountain, Emerald, Harp
Water: Wave, Fish, Pool, Swimsuit, Bucket
Joy: Smiley face, Thumbs up, Love heart
1960s: Peace sign, Yin Yang, Tie dye t-shirt, Incense, Guitar
</Icons>
</Parameters>

Response Format:
It should be an XML object in the following format:

<Color>0,140,69</Color>
<Color>244,245,240</Color>
<Color>205,33,42</Color>
<Icon>Pizza slices</Icon>
<Icon>Coliseum</Icon>
<Icon>Boot</Icon>
<Icon>Pasta</Icon>
<Icon>Leaning Tower of Pisa</Icon>
<Icon>Gondola boat</Icon>`;
}

function getTags(xmlString, tagName) {
  const regex = new RegExp(`<${tagName}[^>]*>(.*?)</${tagName}>`, 'gims');
  return Array.from(xmlString.matchAll(regex)).map(([, group]) => group);
}
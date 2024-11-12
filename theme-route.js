const { Router } = require('express');
const { gemini_key } = require('./flags');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const getIconUris = require('./icon-utils');


const router = Router();
const geminiClient = new GoogleGenerativeAI(gemini_key);

const colorModel = geminiClient.getGenerativeModel({
  model: "gemini-1.5-flash",
  temperature: 0,
});
const colorChat = colorModel.startChat({
  history: [
    {
      role: "user",
      parts: [{
        text: `You are designing apps based on visual themes that I will provide in my upcoming chat messages. The theme 
prompts will be wrapped in the XML tag <Theme></Theme>. 

For each theme, pick a palate of 2 to 3 colors that evoke the theme. If the theme is a physical object or substance,
it would be colors that would typically appear in that object/substance. If it is more abstract, prioritize groups
of colors that are more tightly connected as a group to the theme than individual colors. If there isn't a good color 
group for that theme, try to use colors that capture a mood or atmosphere associated with the theme.

The colors should be formatted as comma-separate rgb triples from 0 to 255. They should be ordered in the response
in decreasing order of relevance.

You will respond with an XML object with each color in a <Color> tag.`}],
    },
    {
      role: "user",
      parts: [{ text: `<Theme>Italy</Theme>`}],
    },
    {
      role: "model",
      parts: [{
        text: `<Color>0,140,69</Color>
<Color>244,245,240</Color>
<Color>205,33,42</Color>`}],
    },
    {
      role: "user",
      parts: [{ text: `<Theme>1960s</Theme>`}],
    },
    {
      role: "model",
      parts: [{
        text: `<Color>255,163,195</Color>
<Color>141,24,204</Color>
<Color>14,230,46</Color>`}],
    },
    {
      role: "user",
      parts: [{ text: `<Theme>joy</Theme>`}],
    },
    {
      role: "model",
      parts: [{
        text: `<Color>242,242,75</Color>
<Color>94,255,0</Color>`}],
    },
    {
      role: "user",
      parts: [{ text: `<Theme>gemrany</Theme>`}],
    },
    {
      role: "model",
      parts: [{
        text: `<Color>0,0,0</Color>
<Color>221,0,0</Color>
<Color>255,204,0</Color>`}],
    },
  ],
});


const iconModel = geminiClient.getGenerativeModel({
  model: "gemini-1.5-flash",
  temperature: 1,
});
const iconChat = iconModel.startChat({
  history: [
    {
      role: "user",
      parts: [{
        text: `You are designing apps based on visual themes that I will provide in my upcoming chat messages. The theme 
prompts will be wrapped in the XML tag <Theme></Theme>. 

Names or brief descriptions of a few visual symbols (5 to 10) associated with the theme. They must all be different.

You will respond with an XML object with each symbol in an <Icon> tag.`}],
    },
    {
      role: "user",
      parts: [{ text: `<Theme>Italy</Theme>`}],
    },
    {
      role: "model",
      parts: [{
        text: `<Icon>Pizza slices</Icon>
<Icon>Coliseum</Icon>
<Icon>Boot</Icon>
<Icon>Pasta</Icon>
<Icon>Leaning Tower of Pisa</Icon>
<Icon>Gondola boat</Icon>
<Icon>Soccer ball</Icon>
<Icon>Fashion</Icon>`}],
    },
    {
      role: "user",
      parts: [{ text: `<Theme>1960s</Theme>`}],
    },
    {
      role: "model",
      parts: [{
        text: `<Icon>Peace sign</Icon>
<Icon>Yin yang</Icon>
<Icon>Incense</Icon>
<Icon>Guitar</Icon>
<Icon>Fringe shirt</Icon>
<Icon>Protest</Icon>`}],
    },
    {
      role: "user",
      parts: [{ text: `<Theme>joy</Theme>`}],
    },
    {
      role: "model",
      parts: [{
        text: `<Icon>Smiley face</Icon>
<Icon>Thumbs up</Icon>
<Icon>Love heart</Icon>
<Icon>High five</Icon>
<Icon>Laughter</Icon>
<Icon>Friends</Icon>
<Icon>Celebration</Icon>
<Icon>Music</Icon>`}],
    },
    {
      role: "user",
      parts: [{ text: `<Theme>gemrany</Theme>`}],
    },
    {
      role: "model",
      parts: [{
        text: `<Icon>Sausage</Icon>
<Icon>Beer stein</Icon>
<Icon>Mountains</Icon>
<Icon>Lederhosen</Icon>
<Icon>Forests</Icon>
<Icon>Berlin Wall</Icon>
<Icon>Brandenburg Gate</Icon>
<Icon>Sports car</Icon>`}],
    },
  ],
});

router.get('/:themePrompt', async (req, res) => {
  const themePrompt = req.params.themePrompt;
  const geminiColorResult = await colorChat.sendMessage(`<Theme>${themePrompt}</Theme>`);
  const geminiIconResult = await iconChat.sendMessage(`<Theme>${themePrompt}</Theme>`);
  const geminiColorXml = geminiColorResult.response.text();
  const geminiIconXml = geminiIconResult.response.text();
  console.log(`Responses from Gemini for theme prompt ${themePrompt}
    
  Colors:
  ${geminiColorXml}
  
  Icons:
  ${geminiIconXml}
  `);
  const colors = getTags(geminiColorXml, 'Color');
  const iconNames = getTags(geminiIconXml, 'Icon');
  const iconUris = (await Promise.all(iconNames.map(getIconUris))).flat();
  res.json({
    prompt: themePrompt,
    colors,
    iconUris,
  });
});

module.exports = router;

function getTags(xmlString, tagName) {
  const regex = new RegExp(`<${tagName}[^>]*>(.*?)</${tagName}>`, 'gims');
  return Array.from(xmlString.matchAll(regex)).map(([, group]) => group);
}
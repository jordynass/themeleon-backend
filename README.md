# Themeleon (Backend)

## Description

This is the backend companion for my React Native app [Themeleon](https://github.com/jordynass/Themeleon). The app is described in the repo's README. This repo handles integration with external APIs, as described in the "Setup" section below.

## Prerequisites

* [Node.js](https://nodejs.org/) (>= 10.8.0)
* [npm](https://www.npmjs.com/) (>= 6.5.0)

## Setup

The external API integrations require keys. I would run the server using my API keys if this were a commercial app. However, because it is currently only for local use, the API policy is "BYOK" (bring your own key).

I only used **free APIs**, so you won't need to pay, but you will need to undergo some (quick) setup steps to access the APIs and successfully run the server. The links below will help you create an account if you do not have one and then give you simple (like a few clicks) directions for generating your keys.

| API                | Purpose                                                      | Setup Link                                                                                                                                                                              |
|--------------------|--------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Google Gemini API  | LLM (verbal AI) to describe visual motifs for a simple theme | [Generate Gemini API Key](https://aistudio.google.com/app/apikey?_gl=1*2wmv58*_ga*MTE5MTk5NzIyNC4xNzMwMzE4MzAw*_ga_P1DBVKWT6V*MTczMDk5Mzg0MS4zLjEuMTczMDk5Mzg4MC4yMS4wLjIwMDgxNTI0OTk.) |
| Noun Project       | Icon library for fetching images of theme symbols            | [Generate Noun Project API Keys](https://thenounproject.com/developers/apps/)                                                                                                           |


Gemini provides you a single (string-valued) key, while the Noun Project provides you two, "key" and "secret." Record them somewhere you won't lose them.

### Creating a .env file

In particular, if you clone this repo, I recommend you create a **file called `.env` in the top level of the repo** that stores them to be read directly by the codebase. Replace the placeholders with your keys, but otherwise, copy the following content **exactly** into your `.env` file:

```
GEMINI_KEY=placeholder_for_gemini_key
NOUN_PROJECT_KEY=placeholder_for_noun_project_key
NOUN_PROJECT_SECRET=placeholder_for_noun_project_secret
```

If you create this file, you should be able to **entirely ignore the "Flags" section** below and run the backend with only the `node index.js` command.

## Installation

`npm install`

## Running the app

You can run the backend from the top level directory with the command

`node index.js`

### Flags

If you did not write an `.env` file as described in the "Creating a .env file" section, you set the values by applying the command line flags below to the command `node index.js`:

| Flag                                              | Description                                    |
|---------------------------------------------------|------------------------------------------------|
| `-npk --noun_project_key <noun_project_key>`      | Key for Noun Project API                       |
| `-nps --noun_project_secret <noun_project_secret>`| Secret for Noun Project API                    |
| `-gk --gemini_key`                                | Key for Google's Gemini API                    |
| `-p, --port <port>`                               | Port to listen on (Defaults to 3000)           |

For example

```sh
node index.js -npk placeholder_for_noun_project_key -nps placeholder_for_noun_project_secret -gk placeholder_for_gemini_key -p 4000
```

## Notes

1. The [frontend](https://github.com/jordynass/Themeleon) currently only listens to this backend on http://localhost:3000.

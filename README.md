# UsBot
## Getting started with development
* Clone the repository
* Run `npm install`
* Create and populate a `config.json` file. It should look like this:
  ```
  {
    "clientId": "xxxxxxxxxx",
    "guildId": "xxxxxxxxx",
    "token": "xxxxxxxx.xxxxxx.xxxxxxxxx"
  }
  ```
* To automatically create a config file, use `npm run setup [clientId [your client id]] [guildId [your guild id]] [token [your token]]`
* To deploy commands, use `npm run deploy`
* To run the bot, use `npm start`

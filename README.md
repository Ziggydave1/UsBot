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
* To run either `deploy-commands.ts` or `index.ts`, run `node --experimental-specifier-resolution=node --loader ts-node/esm ./file.ts`. Hopefully we can make this easier in the future.

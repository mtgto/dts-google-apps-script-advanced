dts-google-apps-script-advanced
====

d.ts files generator for [Advanced Services of Google Apps Script](https://developers.google.com/apps-script/guides/services/advanced).

Inspire from [motemen/dts-google-apps-script](https://github.com/motemen/dts-google-apps-script).

# How To Generate

Require `node.js` and `TypeScript`.

```console
$ yarn install
$ yarn run build

# Parse an API json file
$ node ./dist/index.js parse ./definitions/youtube_v3.json

# Write API json files to destinations
$ node ./dist/index.js convert -o /path/to/export/directory definitions/*.json
```

# How To Download `(gas-advanced-service-definition-for-autocomplete).json`

1. Open editor of Google Apps Script.
1. [Enable Advanced Service](https://developers.google.com/apps-script/guides/services/advanced#enabling_advanced_services) you want to download in menu.
1. Browser download it.
1. Trim first line (it is broken JSON!).

[This issue explain the way more detail](https://github.com/mtgto/dts-google-apps-script-advanced/issues/5#issuecomment-546321498).

# License

MIT

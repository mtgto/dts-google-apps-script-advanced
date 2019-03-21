dts-google-apps-script-advanced
====

d.ts files generator for [Advanced Services of Google Apps Script](https://developers.google.com/apps-script/guides/services/advanced).

Inspire from [motemen/dts-google-apps-script](https://github.com/motemen/dts-google-apps-script).

# How To Generate

Require `node.js` and `TypeScript`.

You need to download JSON file for autocomplete.

```console
$ tsc index.ts
$ node index.js gas-advanced-service-definition-for-autocomplete.json
```

# How To Download `gas-advanced-service-definition-for-autocomplete.json`

1. Open editor of Google Apps Script.
1. Enable Advanced Service in menu.
1. Browser download it.
1. Trim first line (it is broken JSON!).

# Support

- [Admin Directory API v1](https://developers.google.com/admin-sdk/directory/v1/reference/)
- [Calendar API v3](https://developers.google.com/calendar/v3/reference/)

# License

MIT

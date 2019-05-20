# wxy-messenger
node/javascript module to use the messenger Broadcast API
# Docs
https://github.com/VynOffline/wxy-messenger/wiki/Documentation
# Basic usage
```js
const Messenger = require("wxy-messenger");
const client = new Messenger.Client();

client.setToken("YOUR MESSENGER TOKEN");

client.getAllLabels().then(console.log).catch(console.log);

```

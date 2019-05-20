const request = require("request")

class Messenger {

	constructor() {
		this.accessToken = null;
		console.log("Messenger object created");
	}

	setToken(accessToken) {
		this.accessToken = accessToken;
	}

	// broadcast.js
	// labels.js
}

Object.assign(Messenger.prototype, require("./broadcast"))
Object.assign(Messenger.prototype, require("./labels"))

module.exports.Client = Messenger;
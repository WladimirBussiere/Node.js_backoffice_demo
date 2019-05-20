const request = require("request")

async function sendBroadcastMessage(message, label) {
	if (label.id === undefined && label.name !== undefined)
		var labelId = await this.getLabelIdByName(label.name);
	else
		var labelId = label.id;
	if (message.id === undefined && message.content !== undefined)
		var messageId = await this.createBroadcastMessage(message.content);
	else
		var messageId = message.id;
	return (new Promise((resolve, reject) => {
		var options = {
			url: "https://graph.facebook.com/v2.11/me/broadcast_messages?access_token=" + this.accessToken,
			method: "POST",
			json: {message_creative_id: messageId, custom_label_id: labelId}
		}
		request(options, function (error, res, body) {
			if (error)
				reject(error);
			else if (body.error !== undefined)
				reject(body.error);
			else
				resolve(body.broadcast_id);
		})
	}));
}

async function createBroadcastMessage(message) {
	return (new Promise((resolve, reject) => {
		var options = {
			url: "https://graph.facebook.com/v2.11/me/message_creatives?access_token=" + this.accessToken,
			method: "POST",
			json: {messages: [message]}
		}
		request(options, function (error, res, body) {
			if (error)
				reject(error);
			else if (body.error !== undefined)
				reject(body.error);
			else
				resolve(body.message_creative_id);
		})
	}));
}

async function getBroadcastMetrics(broadcastId) {
	return (new Promise((resolve, reject) => {
		var options = {
			url: "https://graph.facebook.com/v2.11/" + broadcastId + "/insights/messages_sent?access_token=" + this.accessToken,
			method: "GET",
			json: true
		}
		request(options, function (error, res, body) {
			if (error)
				reject(error);
			else if (body.error !== undefined)
				reject(body.error);
			else
				resolve(body);
		})
	}));
}

module.exports.sendBroadcastMessage = sendBroadcastMessage;
module.exports.createBroadcastMessage = createBroadcastMessage;
module.exports.getBroadcastMetrics = getBroadcastMetrics;
const request = require("request")

function getLabelIdByName(name) {
	return (new Promise((resolve, reject) => {
		this.getAllLabels().then(function(result) {
			for (var i = 0; i < result.length; ++i)
			{
				if (result[i].name === name)
				{
					resolve(result[i].id);
					return ;
				}
			}
			reject(null);
		})
	}));
}

function getAllLabels() {
	return (new Promise((resolve, reject) => {
		var options = {
			url: "https://graph.facebook.com/v2.11/me/custom_labels?fields=name&access_token=" + this.accessToken,
			method: "GET",
			json: true
		}
		request(options, function (error, res, body) {
			if (error)
				reject(error);
			else if (body.error !== undefined)
				reject(body.error);
			else
				resolve(body.data);
		})
	}));
}

async function getLabelDetails(label) {
	if (label.id === undefined && label.name !== undefined)
		var labelId = await this.getLabelIdByName(label.name);
	else
		var labelId = label.id;
	return (new Promise((resolve, reject) => {
		var options = {
			url: "https://graph.facebook.com/v2.11/" + labelId + "?fields=name&access_token=" + this.accessToken,
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

function getLabelsByPSID(psid) {
	return (new Promise((resolve, reject) => {
		var options = {
			url: "https://graph.facebook.com/v2.11/" + psid + "/custom_labels?fields=name&access_token=" + this.accessToken,
			method: "GET",
			json: true
		}
		request(options, function (error, res, body) {
			if (error)
				reject(error);
			else if (body.error !== undefined)
				reject(body.error);
			else
				resolve(body.data);
				
		})
	}));
}

async function removeLabelFromPSID(label, psid) {
	if (label.id === undefined && label.name !== undefined)
		var labelId = await this.getLabelIdByName(label.name);
	else
		var labelId = label.id;
	return (new Promise((resolve, reject) => {
		var options = {
			url: "https://graph.facebook.com/v2.11/" + labelId + "/label?access_token=" + this.accessToken,
			method: "DELETE",
			json: {user: psid}
		}
		request(options, function (error, res, body) {
			if (error)
				reject(error);
			else if (body.error !== undefined)
				reject(body.error);
			else
				resolve(true);
		})
	}));
}

async function linkLabelToPSID(label, psid) {
	if (label.id === undefined && label.name !== undefined)
		var labelId = await this.getLabelIdByName(label.name);
	else
		var labelId = label.id;
	return (new Promise((resolve, reject) => {
		var options = {
			url: "https://graph.facebook.com/v2.11/" + labelId + "/label?access_token=" + this.accessToken,
			method: "POST",
			json: {user: psid}
		}
		request(options, function (error, res, body) {
			if (error)
				reject(error);
			else if (body.error !== undefined)
				reject(body.error);
			else
				resolve(true);
		})
	}));
}

function createLabel(name) {
	return (new Promise((resolve, reject) => {
		var options = {
			url: "https://graph.facebook.com/v2.11/me/custom_labels?access_token=" + this.accessToken,
			method: "POST",
			json: {name: name}
		}
		request(options, function (error, res, body) {
			if (error)
				reject(error);
			else if (body.error !== undefined)
				reject(body.error);
			else
				resolve(body.id);
		})
	}));
}
async function deleteLabel(label) {
	if (label.id === undefined && label.name !== undefined)
		var labelId = await this.getLabelIdByName(label.name);
	else
		var labelId = label.id;
	return (new Promise((resolve, reject) => {
		var options = {
			url: "https://graph.facebook.com/v2.11/" + labelId + "?access_token=" + this.accessToken,
			method: "DELETE",
			json: true
		}
		request(options, function (error, res, body) {
			if (error)
				reject(error);
			else if (body.error !== undefined)
				reject(body.error);
			else
				resolve(true);
		})
	}));
}

module.exports.getLabelIdByName = getLabelIdByName
module.exports.getAllLabels = getAllLabels
module.exports.getLabelDetails = getLabelDetails
module.exports.getLabelsByPSID = getLabelsByPSID
module.exports.removeLabelFromPSID = removeLabelFromPSID
module.exports.linkLabelToPSID = linkLabelToPSID
module.exports.createLabel = createLabel
module.exports.deleteLabel = deleteLabel
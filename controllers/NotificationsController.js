'use strict'

const request = require('request');
const config = require('../config.js');
const Messenger = require("../wxy-messenger");
const client = new Messenger.Client();
const multer = require('multer');
const schedule = require('node-schedule');

let token = config.configApp.tokenMessenger;
let labelIdFR = config.configApp.labelIdFR;
let labelIdENG = config.configApp.labelIdENG;

console.log('labelIdFR', labelIdFR);
console.log('labelIdENG', labelIdENG);


client.setToken(token);



let notificationController = {};

//show "create new notification" page
notificationController.create = function(req, res) {
  res.render("../views/notifications/create", {successMessage: null, basePath: config.configApp.basePath});
};

notificationController.getUserIdAndLink = async function(req, res) {
	try
	{
		console.log("API request on /notifications/subscription");
		console.log(req.query);
		if (req.query.action === "subscribe"){
			await client.linkLabelToPSID({id:req.query.labelId}, req.query.psid);
      console.log('registered');
    }
		if (req.query.action === "unsubscribe"){
			await client.removeLabelFromPSID({id:req.query.labelId}, req.query.psid);
      console.log('unregistered');
    }
		res.sendStatus(200);
	}
	catch (err)
	{
		console.log(err);
		res.status(500).send({
			error: {
				code: 500,
				message: "Internal server error"
			}
		});
	}
}






//upload an image in a buffer
notificationController.uploadImageBuffer = function(req, res, next) {

  let storage = multer.memoryStorage();
  let upload = multer({ storage: storage }).fields([{ name: 'imageNotification'}]);;

  upload(req, res, function (err) {
    if (err) {
      // An error occurred when uploading
      console.log('maxCountBuffer exceeded')
      res.render("../views/notifications/create", {errorMessage: 'Une image maximum par upload', basePath: config.configApp.basePath});
    } else {
      console.log('maxcountBuffer OK');
      next();//then uploadImageOnFacebook is called
    }
  })
}


notificationController.uploadImageOnFacebook = function(req, res, next) {

  console.log('req files', req.files);

  if (!!req.files.imageNotification){
    console.log('image name', req.files.imageNotification[0].originalname);
    console.log('type mime', req.files.imageNotification[0].mimetype);

    let options = {
      method: 'POST',
      url: 'https://graph.facebook.com/v2.6/me/message_attachments?access_token=' + token,
      headers: {
        'Content-Type': 'application/json'
      },
      formData : {
        message : JSON.stringify({
          "attachment": {
            "type": "image",
            "payload": {
              "is_reusable":true
            }
          }
        }),
        //CUSTOM FILE for formdata with request
        filedata : {
          value: req.files.imageNotification[0].buffer,
          options: {
            filename: req.files.imageNotification[0].originalname,
            contentType: req.files.imageNotification[0].mimetype
          }
        }
      }
    };
    request(options, function(error, response, body) {
      if (error) {
        throw new Error(error);
      } else {
        console.log('uploaded image in facebook:', body);
        req.value = body;
        next();
      }
    });

  } else {
    next();
  }
}



notificationController.createAndSendMessage = function(req, res) {
  let backOfficeMessageFR = '';
  let backOfficeMessageENG = '';
  let imgFbId = null;

  if (req.body.backOfficeMessageFR !== undefined && req.body.backOfficeMessageENG){
    backOfficeMessageFR = req.body.backOfficeMessageFR;
    backOfficeMessageENG = req.body.backOfficeMessageENG;

    console.log('msgFR: ', backOfficeMessageFR);
    console.log('msgENG: ', backOfficeMessageENG);

    let myMessageFR = {
      "text": backOfficeMessageFR,
      "quick_replies": [{
          "content_type": "text",
          "title": "BUTTON_TITLE",
          "payload": "YOUR_PAYLOAD",
      }, {
          "content_type": "text",
          "title": "BUTTON_TITLE",
          "payload": "YOUR_PAYLOAD",
      }]
    }

    let myMessageENG = {
      "text": backOfficeMessageENG,
      "quick_replies": [{
          "content_type": "text",
          "title": "BUTTON_TITLE",
          "payload": "YOUR_PAYLOAD",
      }, {
          "content_type": "text",
          "title": "BUTTON_TITLE",
          "payload": "YOUR_PAYLOAD",
      }]
    }

    if(typeof req.value !== 'undefined') {
      let imgFbId = JSON.parse(req.value);
      console.log('type imgFbId', typeof imgFbId);
      console.log('attachment image: ', imgFbId.attachment_id)

      let myImage =
        {
         "attachment":{
            "type":"image",
            "payload":{
              "attachment_id": imgFbId.attachment_id
            }
          }
        }

      client.createBroadcastMessage(myImage)
            .then(function(messageImageId) {
              console.log('msg image fr created:', messageImageId);
              return client.sendBroadcastMessage({id: messageImageId}, {id: labelIdFR})
            })
            .then(function(...args) {
              console.log(args)
              return client.createBroadcastMessage(myImage);
            }).then(function(messageImageId2) {
              console.log('msg image eng created: ', messageImageId2);
              return client.sendBroadcastMessage({id: messageImageId2}, {id: labelIdENG})
            })
            .then(function(...args) {
              console.log(args)
              return client.createBroadcastMessage(myMessageFR);
            }).then(function(messageIdFR) {
              console.log('msg fr created: ', messageIdFR);
              return client.sendBroadcastMessage({id: messageIdFR}, {id: labelIdFR})
            })
            .then(function(...args) {
              console.log(args)
              return client.createBroadcastMessage(myMessageENG);
            }).then(function(messageIdENG) {
              console.log('msg eng created: ', messageIdENG);
              return client.sendBroadcastMessage({id: messageIdENG}, {id: labelIdENG})
            }).then(function(...args) {
              console.log(args)
              res.render("../views/notifications/create", {successMessage: 'Notification envoyée', basePath: config.configApp.basePath})
            })
            .catch(function(err) {
              console.error('Error: ', err)
              res.render("../views/notifications/create", {successMessage: null, errorMessage: 'Erreur pendant l\'envoi !', basePath: config.configApp.basePath})
            });
    } else {
      client.createBroadcastMessage(myMessageFR)
            .then(function(messageIdFR) {
              console.log('msg fr created: ', messageIdFR);
              return client.sendBroadcastMessage({id: messageIdFR}, {id: labelIdFR})
            })
            .then(function(...args) {
              console.log(args)
              return client.createBroadcastMessage(myMessageENG);
            }).then(function(messageIdENG) {
            	console.log('msg eng created: ', messageIdENG);
            	return client.sendBroadcastMessage({id: messageIdENG}, {id: labelIdENG})
            }).then(function(...args) {
              console.log(args)
              res.render("../views/notifications/create", {successMessage: 'Notification envoyée', basePath: config.configApp.basePath})
            })
            .catch(function(err) {
              console.error('Error: ', err)
              res.render("../views/notifications/create", {successMessage: null, errorMessage: 'Erreur pendant l\'envoi !', basePath: config.configApp.basePath})
            });
    }
  }
}


let tabAutoNotif = [""];
console.log('tabAutoNotif length', tabAutoNotif.length);

notificationController.redirectToGMaps = function(req, res){
  console.log('START!');
  let lat = req.query.lat;
  let long = req.query.long;
  let id = req.query.id;
  console.log(lat, long, id);
  console.log('tab before :', tabAutoNotif);
  let regex = new RegExp(id, 'gmi');




  for (let i = 0; i < tabAutoNotif.length; i++){
    console.log('in loop')
    let resultRegex = tabAutoNotif[i].match(regex);

    if (resultRegex) {
      console.log('already notified');
      res.redirect("https://www.google.com/maps/dir/?api=1&destination="+ lat + "%2C"+ long);
      return
    }
  }
  if(typeof resultRegex === 'undefined') {
    console.log('not yet notified');
    tabAutoNotif.push(id);
    console.log('tab in progress', tabAutoNotif);
    notificationController.sendAutoNotification(id, tabAutoNotif);

    res.redirect("https://www.google.com/maps/dir/?api=1&destination="+ lat + "%2C"+ long);
  }
}

notificationController.sendAutoNotification = function (id, tab) {

  console.log('Autonotif in progress...')
  var currentdate = new Date();
  var date = new Date(currentdate.getFullYear(), currentdate.getMonth(), currentdate.getDate(), currentdate.getHours(), currentdate.getMinutes()+10, currentdate.getSeconds());

  var j = schedule.scheduleJob(date, function(){
    let msg1 = {
                "text": "YOUR_TEXT"
                };
    let msg2 = {
       "attachment": {
         "type": "template",
         "payload": {
           "template_type": "generic",
           "elements": [
           {
             "title": "YOUR_TITLE",
             "image_url": "YOUR_URL",
             "buttons": [{
               "type": "postback",
               "title": "YOUR_TITLE",
               "payload": "YOUR_PAYLOAD"
             }]
           }, {
             "title": "YOUR_TITLE",
             "image_url": "YOUR_URL",
             "buttons": [{
               "type": "postback",
               "title": "YOUR_TITLE",
               "payload": "YOUR_PAYLOAD"
             }]
           }, {
             "title": "YOUR_TITLE",
             "image_url": "YOUR_URL",
             "buttons": [{
               "type": "postback",
               "title": "YOUR_TITLE",
               "payload": "YOUR_PAYLOAD"
             }]
           }
           ]
         }
       }
     };

    let obj = {
      url: 'https://graph.facebook.com/v2.12/me/messages',
      qs: {access_token: token},
      method: 'POST',
      json: {
          messaging_type: "UPDATE",
          recipient: {id: id},
          message: {}
      },
    };

    obj.json.message = msg1;
    console.log('msg1: ', obj);

    request(obj, function(error, response, body) {
        if (error) {
            console.log('Error sending message1: ', error);
        } else if (response.body.error) {
            console.log('Error1: ', response.body.error);
        } else {
          console.log(response.statusCode);
          obj.json.message = msg2;
          console.log('msg2: ', obj);
          request(obj, function(error, response, body) {
              if (error) {
                  console.log('Error sending message2: ', error);
              } else if (response.body.error) {
                  console.log('Error2: ', response.body.error);
              } else {
                console.log(response.statusCode);
                tab.pop(id);
                console.log('tab end', tab);
              }
               console.log(id);
          });
        }
    })
  });
  return;
};


module.exports = notificationController;

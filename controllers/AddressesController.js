const mongoose = require('mongoose');
const multer = require('multer');
const config = require('../config.js');

let Address = mongoose.model('Address');
let addressController = {};


//show all addresses
addressController.list = function(req, res) {
  Address.find({}).exec(function (err, addresses) {
    if (err) {
      console.log("Error:", err);
    }
    else {
      res.render("../views/addresses/index", {addresses: addresses, basePath: config.configApp.basePath});
    }
  });
};


//send all addresses in stringified JSON format
addressController.listJson = function(req, res) {
  Address.find({}).exec(function (err, addresses){
    if(err) {
      console.log('Error: ', err)
    } else {
      console.log('ok')
      res.setHeader('Content-Type', 'application/json');
      return res.send(JSON.stringify(addresses, null, 3));
    }
  })
}


//send all addresses sorted by categories in stringified JSON format
addressController.listJsonByCat = function(req, res) {
  var obj = {}
  if (req.query.type !== undefined){
    obj.categorie_type = req.query.type;
    console.log('type: ', req.query.type)
  }
  if (req.query.envie !== undefined){
    obj.categorie_envie = req.query.envie
    console.log('envie: ', req.query.envie);
  }
  if (req.query.quartier !== undefined){
    obj.categorie_quartier = req.query.quartier
    console.log('quartier: ', req.query.quartier);
  }

  Address.find(obj).exec(function (err, addresses){

    if(err) {
      console.log('Error: ', err)
    } else {
      res.setHeader('Content-Type', 'application/json');
      return res.send(JSON.stringify(addresses, null, 3));
    }
  })
}



//show single address
addressController.show = function(req, res) {
  Address.findOne({_id: req.params.id}).exec(function (err, address) {
    if (err) {
      console.log("Error:", err);
    }
    else {
      console.log('show an adress: ', address)
      res.render("../views/addresses/show", {address: address, basePath: config.configApp.basePath});
    }
  });
};



//show address in a webview
addressController.showWebview = function(req, res) {
  Address.findOne({_id: req.params.id}).exec(function (err, address) {
    if (err) {
      console.log("Error:", err);
    }
    else {
      console.log('language', req.params.lang);
      res.render("../views/webviews/index", {address: address, lang: req.params.lang, basePath: config.configApp.basePath});
    }
  });
};



//Show "create an address" page
addressController.create = function(req, res) {
  res.render("../views/addresses/create", {errorMessage: null, basePath: config.configApp.basePath});
};



//upload an image in the /public/Images directory
addressController.imageUpload = function (req, res, next){
  //defines image storage destination and name
  let storage = multer.diskStorage({
    destination: function(req, file, callback) {
      callback(null, "./public/Images");
    },
    filename: function(req, file, callback) {
      callback(null, file.fieldname + "_" + Date.now() + ".png");
    }
  });


  //instance of multer and fields with nb of images permitted
  let upload = multer({
    storage: storage
  }).fields([{ name: 'image_carrousel', maxCount: 1 },{ name: 'image_webview', maxCount: 1 }]);

  upload(req, res, function (err) {
    if (err) {
      // An error occurred when uploading
      console.log('maxCount exceeded')
      res.render("../views/addresses/create", {errorMessage: 'Une image maximum par upload', basePath: config.configApp.basePath});
    } else {
      console.log('maxcount ok');
      next();//then save function is called
    }
  })
}


//save address in db
addressController.save = function(req, res) {
  console.log(req.files);
  if (req.files.image_carrousel.length > 1 || req.files.image_webview.length > 1){
    console.log('Image upload exceeded')
    res.render("../views/addresses/create", {errorMessage: 'Bis : Une image maximum par upload', basePath: config.configApp.basePath});
  } else {
    console.log("Image upload OK");
    let image1 = req.files.image_carrousel[0].filename;
    let image2 = req.files.image_webview[0].filename;

    req.body.image_carrousel = '/Images/' + image1;
    req.body.image_webview = '/Images/' + image2;

    let address = new Address(req.body);

    address.save(function(err) {
      if(err) {
        console.log(err);
        res.render("../views/addresses/create", {errorMessage: 'Vous devez renseigner tous les champs', basePath: config.configApp.basePath});
      } else {
        console.log("Successfully created an address.");
        res.redirect(config.configApp.basePath + "/addresses/show/" + address._id);
      }
    });
  }
};




//show 'edit an address' page
addressController.edit = function(req, res) {
  Address.findOne({_id: req.params.id}).exec(function (err, address) {
    if (err) {
      console.log("Error:", err);
    }
    else {
      res.render("../views/addresses/edit", {address: address, basePath: config.configApp.basePath});
    }
  });
};




//update an address, manage image re-upload
addressController.update = function(req, res) {
  let imageCarrouselUpdate = '';
  let imageWebviewUpdate = '';

  let query = {
    nom: req.body.nom,
    description_fr: req.body.description_fr,
    description_eng: req.body.description_eng,
    numero: req.body.numero,
    voie: req.body.voie,
    code_postal: req.body.code_postal,
    ville: req.body.ville,
    lat: req.body.lat,
    long: req.body.long,
    description_webview_fr: req.body.description_webview_fr,
    description_webview_eng: req.body.description_webview_eng,
    categorie_envie: req.body.categorie_envie,
    categorie_quartier: req.body.categorie_quartier,
    categorie_type: req.body.categorie_type
   };

  if (typeof req.files !== 'undefined'){

    if (req.files.image_carrousel && req.files.image_carrousel.length > 1 || req.files.image_webview && req.files.image_webview.length > 1){
      console.log('update : Image upload exceeded')
      res.render("../views/addresses/create", {errorMessage: 'Bis : Une image maximum par upload', basePath: config.configApp.basePath});

    } else if (req.files.image_carrousel && req.files.image_carrousel.length === 1 && req.files.image_webview && req.files.image_webview.length === 1){

      console.log("update : Image upload OK");
      imageCarrouselUpdate = '/Images/' + req.files.image_carrousel[0].filename;
      imageWebviewUpdate = '/Images/' + req.files.image_webview[0].filename;
      query.image_carrousel = imageCarrouselUpdate;
      query.image_webview = imageWebviewUpdate;

    } else if (req.files.image_carrousel && req.files.image_carrousel.length === 1){

      imageCarrouselUpdate = '/Images/' + req.files.image_carrousel[0].filename;
      query.image_carrousel = imageCarrouselUpdate;

    } else if (req.files.image_webview && req.files.image_webview.length === 1) {
      imageWebviewUpdate = '/Images/' + req.files.image_webview[0].filename;
      query.image_webview = imageWebviewUpdate;
    }
  } else {
    console.log('carrousel: ', req.body.image_carrousel);
    console.log('webview: ', req.body.image_webview);
  }

  Address.findByIdAndUpdate(req.params.id, { $set: query }, { new: true }, function (err, address) {
    if (err) {
      console.log(err);
      res.render("../views/addresses/edit", {address: req.body, basePath: config.configApp.basePath});
    }
    console.log("Successfully updated an address.", address);
    res.redirect(config.configApp.basePath + "/addresses/show/" + address._id);
  });

};


//delete an address
addressController.delete = function(req, res) {
  Address.remove({_id: req.params.id}, function(err) {
    if(err) {
      console.log(err);
    }
    else {
      console.log("Address deleted!");
      res.redirect(config.configApp.basePath + "/addresses");
    }
  });
};


module.exports = addressController;

'use strict'

let mongoose = require('mongoose');

let AddressSchema = mongoose.Schema({
  nom : {
    type: String,
    required: true
  },
  description_fr: {
    type: String,
    required: true
  },
  description_eng: {
    type: String,
    required: true
  },
  numero: {
    type: String,
    required: true
  },
  voie: {
    type: String,
    required: true
  },
  code_postal: {
    type: String,
    required: true
  },
  ville: {
    type: String,
    required: true
  },
  lat: {
    type: String,
    required: true
  },
  long: {
    type: String,
    required: true
  },
  image_carrousel: {
    type: String,
    required: true
  },
  image_webview: {
    type: String,
    required: true
  },
  description_webview_fr: {
    type: String,
    required : true
  },
  description_webview_eng: {
    type: String,
    required : true
  },
  categorie_envie: {
    type: Array,
    default: [],
    required: true
  },
  categorie_quartier: {
    type: Array,
    default: [],
    required: true
  },
  categorie_type: {
    type: String,
    required: true
  }
});

let Address = mongoose.model('Address', AddressSchema);

module.exports = Address;

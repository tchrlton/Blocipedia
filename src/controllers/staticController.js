const express = require('express');
const router = express.Router();

module.exports = {
    index(req, res, next){
      res.render("static/index.ejs");
    }
}
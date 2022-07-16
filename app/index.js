require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express()
const mongoose = require('mongoose')

app.use(
  express.urlencoded({
    extended: true,
  }),
)

app.use(express.json());


app.use('/', require('./rutas/rutaspublicas'));

mongoose
  .connect(
    `mongodb+srv://ely1547:133545@cluster55.jiqft.mongodb.net/?retryWrites=true&w=majority`
  
  )
  .then(() => {
    console.log('Conectado!')
    app.listen(3000)
  })
  .catch((err) => console.log(err))
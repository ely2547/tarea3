const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Trabajador = require('../models/trabajador');


function auth(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
  
    if (!token) return res.status(401).json({ msg: "sin acceso!" });
  
    try {
      const secret = process.env.SECRET;
  
      jwt.verify(token, secret);
  
      next();
    } catch (err) {
      res.status(400).json({ msg: "token invalido!" });
    }
  };

  

  router.delete('/trabajador/:id',auth, async (req, res) => {
    const id = req.params.id
  
    const trabajador = await Trabajador.findOne({ _id: id })
  
    if (!trabajador) {
      res.status(422).json({ message: 'Dato no encontrado!' })
      return
    }
  
    try {
      await Trabajador.deleteOne({ _id: id })
  
      res.status(200).json({ message: 'Dato eliminado!' })
    } catch (error) {
      res.status(500).json({ erro: error })
    }
    
  })

  router.put('/trabajador/:id',auth, async (req, res) => {
    const id = req.params.id
  
    const { nombre, puesto, correo, password } = req.body
  
    const trabajador = {

      nombre,
      puesto,
      correo,
      password,

    }
  
    try {
      const updatedTrabajador = await Trabajador.updateOne({ _id: id }, trabajador)
  
      if (updatedTrabajador.matchedCount === 0) {
        res.status(422).json({ message: 'Dato no encontrado!' })
        return
      }
  
      res.status(200).json(trabajador)
    } catch (error) {
      res.status(500).json({ error: error })
    }
  })



module.exports = router;
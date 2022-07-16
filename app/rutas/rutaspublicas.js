const express = require("express");
const ruta = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Trabajador = require('../models/trabajador');

ruta.use('/', require('./rutasprivadas'));


ruta.get('/trabajadores', async (req, res) => {
    try {
      const trabajadores = await Trabajador.find()
  
      res.status(200).json(trabajadores)
    } catch (error) {
      res.status(500).json({ erro: error })
    }
  });

ruta.get('/trabajador/:id', async (req, res) => {
    const id = req.params.id
  
    try {
      const trabajador = await Trabajador.findOne({ _id: id })
  
      if (!trabajador) {
        res.status(422).json({ message: 'Dato no encontrado!' })
        return
      }
  
      res.status(200).json(trabajador)
    } catch (error) {
      res.status(500).json({ erro: error })
    }
  });

ruta.post("/registro", async (req, res) => {
    const { nombre, puesto, correo, password} = req.body;
  
    // validacion
    if (!nombre) {
      return res.status(422).json({ msg: "nombre requerido!" });
    }
  
    if (!puesto) {
      return res.status(422).json({ msg: "puesto requerido!" });
    }
  
    if (!correo) {
      return res.status(422).json({ msg: "correo requerido!" });
    
    }
    if (!password) {
        return res.status(422).json({ msg: "password requerida!" });
      
      }
  
    // check si el trabajador existe
    const TrabajadorExiste = await Trabajador.findOne({ correo: correo });
  
    if (TrabajadorExiste) {
      return res.status(422).json({ msg: "el correo ya ha sido registrado!" });
    }
  
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const trabajador = new Trabajador({
        nombre,
        puesto,
        correo,
        password: passwordHash,
      });
    
      try {
        await trabajador.save();
    
        res.status(201).json({ msg: "Trabajador registrado con exito!" });
      } catch (error) {
        res.status(500).json({ msg: error });
      }

    });


ruta.post("/login", async (req, res) => {
        const { correo, password } = req.body;

        if (!correo) {
            return res.status(422).json({ msg: "correo requerido!" });
          
          }
          if (!password) {
              return res.status(422).json({ msg: "password requerida!" });
            
            };
            const trabajador = await Trabajador.findOne({ correo: correo });

            if (!trabajador) {
              return res.status(404).json({ msg: "trabajador no encontrado!" });
            }


        

        const checkPassword = await bcrypt.compare(password, trabajador.password);

        if (!checkPassword) {
          return res.status(422).json({ msg: "contraseña inválida" })
        }

        try {
            const secret = process.env.SECRET;
        
            const token = jwt.sign(
              {
                id: trabajador._id,
              },
              secret,
            )

        
            res.status(200).json({ msg: "Autenticación exitosa!", token });
          } catch (error) {
            res.status(500).json({ msg: error });
          }
        

    });

      

module.exports = ruta;
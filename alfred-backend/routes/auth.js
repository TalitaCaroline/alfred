const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const { generateToken } = require('../config/jwt');
const asyncHandler = require('../middlewares/asyncHandler');
const auth = require('../middlewares/auth');
function validate(req, res, next) {
  const errors = validationResult(req);
  return errors.isEmpty() ? next() : res.status(400).json({success:false,message:'Verifique os campos do formulário.',errors:errors.array()});
}
const publicUser = user => ({ id:user.id, username:user.username, fullName:user.fullName, email:user.email, preferredCity:user.preferredCity, isAdmin:user.isAdmin });
router.post('/register', [
  body('fullName').trim().isLength({min:2,max:120}),
  body('username').trim().matches(/^[a-zA-Z0-9_]{3,40}$/),
  body('email').trim().isEmail().normalizeEmail(),
  body('password').isLength({min:8,max:128})
], validate, asyncHandler(async (req,res) => {
  const {fullName,username,email,password} = req.body;
  const exists = await User.findOne({where:{email}}) || await User.findOne({where:{username}});
  if (exists) return res.status(409).json({success:false,message:'E-mail ou usuário já cadastrado.'});
  const user = await User.create({fullName,username,email,password:await bcrypt.hash(password,10)});
  return res.status(201).json({success:true,data:publicUser(user),message:'Cadastro realizado. Faça seu login.'});
}));
router.post('/login', [body('email').isEmail(),body('password').notEmpty()], validate, asyncHandler(async (req,res) => {
  const user = await User.findOne({where:{email:req.body.email}});
  if (!user || !(await bcrypt.compare(req.body.password,user.password))) return res.status(401).json({success:false,message:'E-mail ou senha incorretos.'});
  res.json({ token:generateToken({id:user.id,isAdmin:user.isAdmin}), user:publicUser(user) });
}));
router.get('/me',auth,asyncHandler(async (req,res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({success:false,message:'Usuário não encontrado.'});
  return res.json({success:true,data:publicUser(user)});
}));
module.exports = router;

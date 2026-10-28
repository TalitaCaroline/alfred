const router = require('express').Router();
const { Op } = require('sequelize');
const { Event, Venue, TicketLot } = require('../models');
const asyncHandler = require('../middlewares/asyncHandler');
const eventInclude = [{model:Venue,as:'venue'}, {model:TicketLot,as:'lots'}];
router.get('/events',asyncHandler(async(req,res)=>{
  const where = {isPublished:true,startAt:{[Op.gte]: new Date()}};
  if (req.query.category && ['cinema','shows','baladas','teatro','danca','cultura'].includes(req.query.category)) where.category=req.query.category;
  if (req.query.q && String(req.query.q).length <= 100) where.title = {[Op.like]:`%${String(req.query.q).replace(/[\\%_]/g,'\\$&')}%`};
  const venueFilter = {};
  if (req.query.city) venueFilter.city = {[Op.like]:String(req.query.city).slice(0,90)};
  const events = await Event.findAll({where,include:[{model:Venue,as:'venue',where:venueFilter},{model:TicketLot,as:'lots'}],order:[['startAt','ASC']],limit:100});
  return res.json({success:true,data:events});
}));
router.get('/events/:id',asyncHandler(async(req,res)=>{
  if (!/^\d+$/.test(req.params.id)) return res.status(400).json({success:false,message:'ID inválido.'});
  const event = await Event.findOne({where:{id:req.params.id,isPublished:true},include:eventInclude});
  if (!event) return res.status(404).json({success:false,message:'Evento não encontrado.'});
  return res.json({success:true,data:event});
}));
router.get('/venues',asyncHandler(async(req,res)=>{
  const where = {};
  if (req.query.city) where.city = {[Op.like]:String(req.query.city).slice(0,90)};
  const venues=await Venue.findAll({where,order:[['name','ASC']],limit:100});
  return res.json({success:true,data:venues});
}));
router.get('/venues/:id/events',asyncHandler(async(req,res)=>{
  if (!/^\d+$/.test(req.params.id)) return res.status(400).json({success:false,message:'ID inválido.'});
  const venue = await Venue.findByPk(req.params.id);
  if (!venue) return res.status(404).json({success:false,message:'Local não encontrado.'});
  const events=await Event.findAll({where:{venueId:venue.id,isPublished:true,startAt:{[Op.gte]:new Date()}},include:eventInclude,order:[['startAt','ASC']]});
  return res.json({success:true,data:{venue,events}});
}));
module.exports = router;

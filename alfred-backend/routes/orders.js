const router = require('express').Router();
const { Op } = require('sequelize');
const { sequelize, User, Event, Venue, TicketLot, Order } = require('../models');
const asyncHandler = require('../middlewares/asyncHandler');
const auth = require('../middlewares/auth');
router.use(auth);
router.get('/',asyncHandler(async (req,res)=>{
  const orders = await Order.findAll({where:{userId:req.user.id},include:[{model:Event,as:'event',include:[{model:Venue,as:'venue'}]},{model:TicketLot,as:'lot'}],order:[['createdAt','DESC']]});
  return res.json({success:true,data:orders});
}));
router.post('/demo',asyncHandler(async(req,res)=>{
  const quantity = Number(req.body.quantity), ticketLotId = Number(req.body.ticketLotId);
  if (!Number.isInteger(quantity) || quantity<1 || quantity>6 || !Number.isSafeInteger(ticketLotId) || ticketLotId<1)
    return res.status(400).json({success:false,message:'Selecione um lote e de 1 a 6 ingressos.'});
  const order = await sequelize.transaction(async (transaction)=>{
    const user=await User.findByPk(req.user.id,{transaction});
    if (!user) { const e = new Error('Usuário não encontrado.');e.status=401;throw e; }
    const lot=await TicketLot.findByPk(ticketLotId,{include:[{model:Event,as:'event'}],transaction});
    if (!lot || !lot.event.isPublished || new Date(lot.event.startAt) <= new Date()) {
      const e=new Error('Lote ou evento indisponível.');e.status=404;throw e;
    }
    const [updated] = await TicketLot.update({available:sequelize.literal(`available - ${quantity}`)}, {
      where:{id:ticketLotId,available:{[Op.gte]:quantity}},transaction
    });
    if (updated!==1) {const e=new Error('Quantidade de ingressos indisponível.');e.status=409;throw e;}
    const amount=(Math.round(Number(lot.price)*100)*quantity/100).toFixed(2);
    return Order.create({userId:user.id,eventId:lot.eventId,ticketLotId,quantity,total:amount,status:'DEMO'}, {transaction});
  });
  return res.status(201).json({success:true,data:order,message:'Reserva de demonstração criada. Não é um ingresso válido.'});
}));
module.exports = router;

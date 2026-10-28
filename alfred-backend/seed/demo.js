require('dotenv').config();
const {sequelize,Venue,Event,TicketLot}=require('../models');
const data=require('./demo-data.json');
(async()=>{
  await sequelize.authenticate();
  await sequelize.sync();
  for (const venue of data.venues) {
    const {id,...fields}=venue;
    const [row]=await Venue.findOrCreate({where:{id},defaults:{id,...fields}});
    if(row.name!==fields.name) console.warn('Local ID já utilizado:',id);
  }
  for (const event of data.events) {
    const {venue,lots,...fields}=event;
    await Event.findOrCreate({where:{id:event.id},defaults:fields});
    for(const lot of lots) await TicketLot.findOrCreate({where:{id:lot.id},defaults:{...lot,eventId:event.id}});
  }
  console.log(`Dados de DEMONSTRAÇÃO: ${data.venues.length} locais e ${data.events.length} eventos fictícios.`);
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>sequelize.close());

require('dotenv').config();
const express=require('express');
const cors=require('cors');
const morgan=require('morgan');
const {sequelize}=require('./models');
const authRoutes=require('./routes/auth');
const eventRoutes=require('./routes/events');
const orderRoutes=require('./routes/orders');
const app=express();
app.disable('x-powered-by');
app.use(morgan('dev'));
const allowedOrigins=(process.env.CORS_ORIGIN || 'http://127.0.0.1:5173,http://localhost:5173').split(',').map(x=>x.trim());
app.use(cors({origin:(origin,callback)=>callback(null,!origin || allowedOrigins.includes(origin))}));
app.use(express.json({limit:'64kb'}));
app.get('/api',(req,res)=>res.json({success:true,data:{name:'Alfred API',version:'0.1.0',status:'online'}}));
app.use('/api',authRoutes);
app.use('/api',eventRoutes);
app.use('/api/orders',orderRoutes);
app.use((req,res)=>res.status(404).json({success:false,message:'Rota não encontrada.'}));
app.use((err,req,res,next)=>{
  console.error('[Alfred]',err);
  res.status(err.status || 500).json({success:false,message:err.status ? err.message : 'Erro interno do servidor.'});
});
if (require.main===module) {
  sequelize.authenticate().then(()=>{
    console.log('[Alfred] Banco conectado. Rode npm run seed para criar as tabelas e dados demonstrativos.');
    app.listen(Number(process.env.PORT || 3000),()=>console.log(`Alfred API em http://localhost:${process.env.PORT || 3000}`));
  }).catch(err=>{console.error('[Alfred] Não foi possível conectar ao banco:',err.message);process.exitCode=1;});
}
module.exports=app;

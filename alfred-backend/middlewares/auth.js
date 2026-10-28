const { verifyToken } = require('../config/jwt');
module.exports = (req, res, next) => {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) return res.status(401).json({ success:false, message:'Faça login para continuar.' });
  try { req.user = verifyToken(token); return next(); }
  catch { return res.status(401).json({ success:false, message:'Sessão inválida ou expirada.' }); }
};

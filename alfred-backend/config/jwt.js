const jwt = require('jsonwebtoken');
if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'ESCOLHA_UM_SEGREDO_FORTE_E_LONGO') {
  console.warn('[Alfred] Configure JWT_SECRET seguro no arquivo .env antes de usar login.');
}
function secret() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'ESCOLHA_UM_SEGREDO_FORTE_E_LONGO') throw new Error('Configure JWT_SECRET em .env');
  return process.env.JWT_SECRET;
}
module.exports = {
  generateToken: (payload) => jwt.sign(payload, secret(), { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }),
  verifyToken: (token) => jwt.verify(token, secret())
};

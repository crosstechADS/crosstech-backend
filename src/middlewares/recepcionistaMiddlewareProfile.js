const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    if (req.userProfile === 'recepcionista' || req.userProfile === 'gerencia') {
        return next()
    }

    return res.status(401).send({ error: 'Rota exclusiva para recepcionistas' });

}
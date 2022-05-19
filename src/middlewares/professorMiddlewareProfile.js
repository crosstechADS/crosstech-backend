const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    if (req.userProfile === 'professor') {
        return next()
    }

    return res.status(401).send({ error: 'Rota exclusiva para professores' });

}
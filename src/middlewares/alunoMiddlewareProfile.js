const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    if (req.userProfile === 'aluno' || req.userProfile === 'gerencia') {
        return next()
    }

    return res.status(401).send({ error: 'Rota exclusiva para alunos' });

}
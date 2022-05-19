const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    //token não existe
    if (!authHeader) {
        return res.status(401).send({ error: 'Token não fornecido' });
    }

    //quebra a string do header em 2 partes [BEARER | oiajsdoiuj12oijd73745345233asdg]
    const parts = authHeader.split(' ');

    //não possui 2 partes, token está incorreto
    if (!parts.length === 2) {
        return res.status(401).send({ error: 'Erro de token' });
    }

    // atribui as duas partes do header a duas desestruturações
    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).send({ error: 'Formato de token incorreto' });
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) return res.status(401).send({ error: 'Token Inválido' });
        req.userId = decoded.id;
        req.userProfile = decoded.perfil;

        return next();
    }
    )

}
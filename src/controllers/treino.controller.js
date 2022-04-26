const { db } = require('../config/database')

const treinoRegister = (req, res) => {
    const treino = req.body.treino;
    const treinoObs = req.body.treinoObs;
    const email = req.body.email;
    var id;
    db.query("SELECT ID_USUARIO FROM TB_USUARIOS WHERE DS_EMAIL = ?", [email],
        (err, result) => {
            if (err) {
                res.send(err);
            } else {
                id = result[0].ID_USUARIO;
                db.query("INSERT INTO TB_TREINOS (DS_TREINO, OBS_TREINO, DT_EXCLUSAO, ID_USUARIO) VALUES (?, ?, ?, ?)", [treino, treinoObs, null, id],
                    (err, result) => {
                        if (err) {
                            res.send(err);
                        } else {
                            res.send({ msg: 'Treino adicionado com sucesso!' });
                        }
                    })
            }
        })
}

const treinoSelect = (req, res) => {
    //Recebe e-mail da tela
    const email = req.body.email
    var id;
    //pega o ID do usuário
    db.query("SELECT ID_USUARIO FROM TB_USUARIOS WHERE DS_EMAIL = ?", [email], (err, result) => {
        if (err) {
            res.send(err);
        } else {
            id = result[0].ID_USUARIO;
            //Busca na base todos os treinos vinculados ao id usuário fornecido
            db.query("SELECT * FROM TB_TREINOS WHERE ID_USUARIO = ?", [id], (err, result) => {
                if (err) {
                    res.send(err)
                } else {
                    //Retorna tudo que contém na base
                    res.send({ data: result })
                }
            })
        }
    })
}

module.exports = { treinoRegister, treinoSelect }
const { db } = require('../config/database')

const treinoRegister = (req, res) => {
    const treino = req.body.treino;
    const treinoObs = req.body.treinoObs;
    const usuarioId = req.body.usuarioId;
    db.query("INSERT INTO TB_TREINOS (DS_TREINO, OBS_TREINO, DT_EXCLUSAO, ID_USUARIO) VALUES (?, ?, ?, ?)", [treino, treinoObs, null, usuarioId],
        (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send({ msg: 'Treino adicionado com sucesso!' });
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
            db.query("SELECT * FROM TB_TREINOS WHERE ID_USUARIO = ? AND DT_EXCLUSAO IS NULL", [id], (err, result) => {
                if (err) {
                    res.send(err);
                } else {
                    //Retorna tudo que contém na base
                    res.send(result);
                }
            })
        }
    })
}

const treinosSelect = (req, res) => {
    db.query(
        "SELECT TRE.*, USU.* FROM TB_TREINOS TRE " +
        "INNER JOIN TB_USUARIOS USU " +
        "ON TRE.ID_USUARIO = USU.ID_USUARIO " +
        "WHERE TRE.DT_EXCLUSAO IS NULL ", (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        })
}

const treinoEspecifico = (req, res) => {
    const id = req.params.id;
    db.query(
        "SELECT TRE.*, USU.* FROM TB_TREINOS TRE " +
        "INNER JOIN TB_USUARIOS USU " +
        "ON TRE.ID_USUARIO = USU.ID_USUARIO " +
        "WHERE TRE.DT_EXCLUSAO IS NULL AND " +
        "TRE.ID_TREINO = ?", [id], (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        })
}

const updateTreino = (req, res) => {
    //Faz o update na base de todas as informações recebidas
    const idTreino = req.body.ID_TREINO;
    const dsTreino = req.body.DS_TREINO;
    const obsTreino = req.body.OBS_TREINO;
    const dtInclusao = req.body.DT_INCLUSAO;
    const dtExclusao = null;
    const idUsuario = req.body.ID_USUARIO;

    db.query("UPDATE TB_TREINOS SET DS_TREINO = ?, OBS_TREINO = ?, DT_INCLUSAO = ?, DT_EXCLUSAO = ?, ID_USUARIO = ? WHERE ID_TREINO = ?",
        [dsTreino, obsTreino, dtInclusao, dtExclusao, idUsuario, idTreino],
        (err, result) => {
            if (err) {
                res.send({ err, msg: 'Tente novamente!' });
            } else {
                return res.send({ msg: 'Atualizado com sucesso!' });
            }
        }
    )
}

const deleteTreino = (req, res) => {
    //Faz o delete na base de todas as informações recebidas

    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);

    const idTreino = req.body.ID_TREINO;
    const dsTreino = req.body.DS_TREINO;
    const obsTreino = req.body.OBS_TREINO;
    const dtInclusao = req.body.DT_INCLUSAO;
    const dtExclusao = today.toISOString();
    const idUsuario = req.body.ID_USUARIO;

    db.query("UPDATE TB_TREINOS SET DS_TREINO = ?, OBS_TREINO = ?, DT_INCLUSAO = ?, DT_EXCLUSAO = ?, ID_USUARIO = ? WHERE ID_TREINO = ?",
        [dsTreino, obsTreino, dtInclusao, dtExclusao, idUsuario, idTreino],
        (err, result) => {
            if (err) {
                res.send({ err, msg: 'Tente novamente!' });
            } else {
                return res.send({ msg: 'Deletado com sucesso!' });
            }
        }
    )
}

const AlunoTreinoRegister = (req, res) => {
    const nrRepeticoes = req.body.NR_REPETICAO;
    const kgExercicio = req.body.KG_EXERCICIO;
    const idExercicioTreino = req.body.ID_EXERCICIO_TREINO;
    const minutosExercicio = req.body.MINUTOS_EXERCICIO;

    db.query("INSERT INTO tb_exercicio_treino_aluno (NR_REPETICAO, KG_EXERCICIO, MINUTOS_EXERCICIO, ID_EXERCICIO_TREINO) VALUES (?, ?, ?, ?)", [nrRepeticoes, kgExercicio, minutosExercicio, idExercicioTreino, null],
        (err, result) => {
            if (err) {
                res.send({ msg: "Erro na realização do exercício" });
            } else {
                res.send({ msg: "Exercício finalizado com sucesso!" });
            }
        })
}

module.exports = { treinoRegister, treinoSelect, treinosSelect, treinoEspecifico, updateTreino, deleteTreino, AlunoTreinoRegister }
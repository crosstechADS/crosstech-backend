const { db } = require('../config/database')

const treinoRegister = (req, res) => {
    const treino = req.body.treino;
    const treinoObs = req.body.treinoObs;
    const usuarioId = req.body.usuarioId;
    db.query("INSERT INTO TB_TREINOS (DS_TREINO, OBS_TREINO, DT_EXCLUSAO, ID_USUARIO) VALUES (?, ?, ?, ?)", [treino, treinoObs, null, usuarioId],
        (err, result) => {
            if (err) {
                return res.send({ err, msg: "Ocorreu um erro ao cadastrar treino!" });
            } else {
                return res.send({ msg: 'Treino adicionado com sucesso!' });
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
            res.send({ err, msg: "Ocorreu um erro!" });
        } else {
            id = result[0].ID_USUARIO;
            //Busca na base todos os treinos vinculados ao id usuário fornecido
            db.query("SELECT * FROM TB_TREINOS WHERE ID_USUARIO = ? AND DT_EXCLUSAO IS NULL", [id], (err, result) => {
                if (err) {
                    return res.send({ err, msg: "Ocorreu um erro ao buscar treinos!" });
                } else {
                    //Retorna tudo que contém na base
                    return res.send(result);
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
                return res.send({ err, msg: "Ocorreu um erro ao buscar treinos!" });
            } else {
                return res.send(result);
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
                return res.send({ err, msg: "Ocorreu um erro ao buscar detalhes do treino!" });
            } else {
                return res.send(result);
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
                return res.send({ err, msg: 'Tente novamente!' });
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
                return res.send({ err, msg: 'Tente novamente!' });
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
                return res.send({ msg: "Erro na realização do exercício" });
            } else {
                return res.send({ msg: "Exercício finalizado com sucesso!" });
            }
        })
}

const selectAlunoTreinoRegister = (req, res) => {
    const email = req.body.EMAIL;
    const idExercicio = req.body.idExercicio;

    db.query("SELECT ID_USUARIO FROM tb_usuarios WHERE DS_EMAIL = ?", [email], (err, result) => {
        if (err) {
            return res.send({ err, msg: "Erro ao consultar usuário pelo email!" });
        } else {
            var idUsuario = result[0].ID_USUARIO;
            db.query("SELECT DISTINCT trealu.ID_TREINO_ALUNO as Id, trealu.NR_REPETICAO as Repetições, trealu.KG_EXERCICIO as Pesagem, trealu.MINUTOS_EXERCICIO as Tempo, DATE_FORMAT(trealu.DT_REALIZACAO, '%e %b %Y') as Data, exe.DS_EXERCICIO as Exercicio FROM TB_EXERCICIO_TREINO_ALUNO trealu INNER JOIN TB_EXERCICIOS_TREINOS exetre ON trealu.ID_EXERCICIO_TREINO = exetre.ID_EXERCICIO_TREINO INNER JOIN TB_EXERCICIOS exe ON exe.ID_EXERCICIO = exetre.ID_EXERCICIO INNER JOIN TB_TREINOS tre ON tre.ID_TREINO = exetre.ID_TREINO WHERE tre.ID_USUARIO = ? AND EXE.ID_EXERCICIO = ? ORDER BY trealu.DT_REALIZACAO", [idUsuario, idExercicio], (err, result) => {
                if (err) {
                    return res.send({ err, msg: "Erro ao consultar as informações pelo idUsuario!" });
                } else {
                    return res.send(result);
                }
            })
        }
    })
}

const selectAlunoTreinoRegisterTipos = (req, res) => {
    const email = req.body.EMAIL;

    db.query("SELECT ID_USUARIO FROM tb_usuarios WHERE DS_EMAIL = ?", [email], (err, result) => {
        if (err) {
            return res.send({ err, msg: "Erro ao consultar usuário pelo email!" });
        } else {
            var idUsuario = result[0].ID_USUARIO;
            db.query("SELECT COUNT(trealu.ID_TREINO_ALUNO) as Realizacoes, TE.DS_TIPO_EXERCICIO as Exercicio FROM TB_EXERCICIO_TREINO_ALUNO trealu INNER JOIN TB_EXERCICIOS_TREINOS exetre ON trealu.ID_EXERCICIO_TREINO = exetre.ID_EXERCICIO_TREINO INNER JOIN TB_EXERCICIOS exe ON exe.ID_EXERCICIO = exetre.ID_EXERCICIO INNER JOIN TB_TREINOS tre ON tre.ID_TREINO = exetre.ID_TREINO  INNER JOIN TB_TIPOS_EXERCICIOS TE ON TE.ID_TIPO_EXERCICIO = EXE.ID_TIPO_EXERCICIO WHERE tre.ID_USUARIO = ? AND TE.DT_EXCLUSAO IS NULL GROUP BY DS_TIPO_EXERCICIO", [idUsuario], (err, result) => {
                if (err) {
                    return res.send({ err, msg: "Erro ao consultar as informações pelo idUsuario!" });
                } else {
                    return res.send(result);
                }
            })
        }
    })
}

const selectAlunoTreinoExercicios = (req, res) => {
    const email = req.body.EMAIL;

    db.query("SELECT ID_USUARIO FROM tb_usuarios WHERE DS_EMAIL = ?", [email], (err, result) => {
        if (err) {
            return res.send({ err, msg: "Erro ao consultar usuário pelo email!" });
        } else {
            var idUsuario = result[0].ID_USUARIO;
            db.query("SELECT DISTINCT exe.id_exercicio, exe.ds_exercicio FROM tb_exercicios exe INNER JOIN tb_exercicios_treinos exetre ON exetre.id_exercicio = exe.id_exercicio INNER JOIN tb_treinos tre ON tre.id_treino = exetre.id_treino INNER JOIN tb_usuarios usu ON usu.id_usuario = tre.id_usuario WHERE exe.dt_exclusao IS NULL AND usu.id_usuario = ? ORDER BY exe.ds_exercicio", [idUsuario], (err, result) => {
                if (err) {
                    return res.send({ err, msg: "Erro ao consultar as informações pelo idUsuario!" });
                } else {
                    return res.send(result);
                }
            })
        }
    })
}

module.exports = { treinoRegister, treinoSelect, treinosSelect, treinoEspecifico, updateTreino, deleteTreino, AlunoTreinoRegister, selectAlunoTreinoRegister, selectAlunoTreinoRegisterTipos, selectAlunoTreinoExercicios }
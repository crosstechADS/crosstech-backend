const { db } = require('../config/database')

const exerciciosRegister = (req, res) => {
    const exercicio = req.body.exercicio;
    const exercicioObs = req.body.exercicioObs;
    const exercicioTipo = req.body.exercicioTipo;
    // const tiposExercicio = {
    //     aerobica: 5,
    //     funcional: 15,
    //     pilates: 25
    // }

    // const idExercicio = tiposExercicio[exercicioTipo.toString().toLowerCase()]

    /*db.query("SELECT *FROM ") -----DESCOBRIR COMO PEGAR O ID DA MIDIA-------*/

    return db.query("INSERT INTO TB_EXERCICIOS (DS_EXERCICIO, OBS_EXERCICIO, DT_EXCLUSAO, ID_TIPO_EXERCICIO, ID_MIDIA_EXERCICIO) VALUES (?,?,?,?,?)",
        [exercicio, exercicioObs, null, exercicioTipo, 5],
        (err, response) => {
            if (err) {
                return res.send({ err, msg: "Ocorreu um erro ao cadastrar exercício!" })
            }
            else {
                console.log('response:', response)
                return res.send({ msg: "Cadastrado com sucesso!", record: { id: response.insertId } });
            }
        }
    )
}

const exerciciosRegisterMidia = (req, res) => {
    const idExercicio = req.params.id;
    const { location } = req.file;
    db.query("UPDATE TB_EXERCICIOS SET DS_MIDIA_URL = ? WHERE ID_EXERCICIO = ?", [location, idExercicio],
        (err, _result) => {
            if (err) {
                res.send({ err, msg: 'Tente novamente!' })
            } else {
                res.send({ msg: 'Midia atualizada com sucesso!' })
            }
        })
}

const exercicioTreinoRegister = (req, res) => {
    const OBS_EXERCICIO_TREINO = req.body.OBS_EXERCICIO_TREINO;
    const ID_TREINO = req.body.ID_TREINO;
    const ID_EXERCICIO = req.body.ID_EXERCICIO;
    const NR_REPETICAO = req.body.NR_REPETICAO;
    const KG_EXERCICIO = req.body.KG_EXERCICIO;
    const MINUTOS_EXERCICIO = req.body.MINUTOS_EXERCICIO;

    db.query("INSERT INTO tb_exercicios_treinos (OBS_EXERCICIO_TREINO, DT_EXCLUSAO, ID_TREINO, ID_EXERCICIO, NR_REPETICAO, KG_EXERCICIO, MINUTOS_EXERCICIO) VALUES ( ?, ?, ?, ?, ?, ? ,?)",
        [OBS_EXERCICIO_TREINO, null, ID_TREINO, ID_EXERCICIO, NR_REPETICAO, KG_EXERCICIO, MINUTOS_EXERCICIO],
        (err, response) => {
            if (err) {
                return res.send({ err, msg: "Ocorreu um erro!" });
            } else {
                res.send({ err, msg: "Cadastrado com sucesso!" });
            }
        })
}

const exercicioTreinoSelect = (req, res) => {
    const id = req.params.id;
    //Busca na base todos os exercicios_treino selecionados
    db.query("SELECT EXETRE.*, EXE.*, TEXE.DS_TIPO_EXERCICIO FROM TB_EXERCICIOS_TREINOS EXETRE " +
        "INNER JOIN TB_EXERCICIOS EXE " +
        "ON EXETRE.ID_EXERCICIO = EXE.ID_EXERCICIO " +
        "INNER JOIN TB_TREINOS TRE " +
        "ON EXETRE.ID_TREINO = TRE.ID_TREINO " +
        "INNER JOIN TB_TIPOS_EXERCICIOS TEXE " +
        "ON EXE.ID_TIPO_EXERCICIO = TEXE.ID_TIPO_EXERCICIO " +
        "WHERE EXETRE.ID_TREINO = ? " +
        "AND EXETRE.DT_EXCLUSAO IS NULL ", [id], (err, result) => {
            if (err) {
                res.send({ err, msg: "Ocorreu um erro!" });
            } else {
                //Retorna tudo que contém na base
                res.send(result);
            }
        })
}




const exercicioSelect = (req, res) => {
    //Busca na base todos os exercicios selecionados
    db.query("SELECT EXE.*, TEXE.DS_TIPO_EXERCICIO FROM TB_EXERCICIOS EXE " +
        "INNER JOIN TB_TIPOS_EXERCICIOS TEXE " +
        "ON EXE.ID_TIPO_EXERCICIO = TEXE.ID_TIPO_EXERCICIO " +
        "WHERE EXE.DT_EXCLUSAO IS NULL " +
        "AND TEXE.DT_EXCLUSAO IS NULL", (err, result) => {
            if (err) {
                res.send({ err, msg: "Ocorreu um erro!" });
            } else {
                //Retorna tudo que contém na base
                res.send(result)
            }
        })
}

const exercicioEspecifico = (req, res) => {
    const id = req.params.id;
    //Busca na base todos os exercicios selecionados
    db.query("SELECT EXE.*, TEXE.DS_TIPO_EXERCICIO FROM TB_EXERCICIOS EXE " +
        "INNER JOIN TB_TIPOS_EXERCICIOS TEXE " +
        "ON EXE.ID_TIPO_EXERCICIO = TEXE.ID_TIPO_EXERCICIO " +
        "WHERE EXE.ID_EXERCICIO = ? AND " +
        "EXE.ID_TIPO_EXERCICIO = TEXE.ID_TIPO_EXERCICIO", [id], (err, result) => {
            if (err) {
                res.send({ err, msg: "Ocorreu um erro!" });
            } else {
                //Retorna tudo que contém na base
                res.send(result)

            }
        })
}

const selectTipoExercicio = (req, res) => {
    db.query("SELECT ID_TIPO_EXERCICIO, DS_TIPO_EXERCICIO FROM TB_TIPOS_EXERCICIOS WHERE DT_EXCLUSAO IS NULL", (err, result) => {
        if (err) {
            res.send({ err, msg: "Ocorreu um erro!" });
        } else {
            res.send(result);
        }
    });
}

const exercicioUpdate = (req, res) => {
    //Faz o update de todas as informações na base
    const idExercicio = req.body.ID_EXERCICIO;
    const descricaoExercicio = req.body.DS_EXERCICIO;
    const observacaoExercicio = req.body.OBS_EXERCICIO;
    const dataInclusao = req.body.DT_INCLUSAO;
    const dataExclusao = null;
    const idMidiaExercicio = req.body.ID_MIDIA_EXERCICIO;
    const descricaoMidiaURL = null;
    const exercicioTipo = req.body.exercicioTipo;
    // const tiposExercicio = {
    //     aerobica: 5,
    //     funcional: 15,
    //     pilates: 25
    // }

    // const idTipoExercicio = tiposExercicio[exercicioTipo.toString().toLowerCase()]

    return db.query("UPDATE TB_EXERCICIOS SET DS_EXERCICIO = ?, OBS_EXERCICIO = ?, DT_INCLUSAO = ?, DT_EXCLUSAO = ?, ID_TIPO_EXERCICIO = ?, ID_MIDIA_EXERCICIO = ?, DS_MIDIA_URL = ? WHERE ID_EXERCICIO = ?",
        [descricaoExercicio, observacaoExercicio, dataInclusao, dataExclusao, exercicioTipo, idMidiaExercicio, descricaoMidiaURL, idExercicio],
        (err, result) => {
            if (err) {
                res.send({ err, msg: 'Tente novamente!' });
            } else {
                return res.send({ msg: "Cadastrado com sucesso!", record: { id: res.insertId } });
            }
        }
    )
}

const exercicioDelete = (req, res) => {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);

    //Faz o "delete" de todas as informações na base
    const idExercicio = req.body.ID_EXERCICIO;
    const descricaoExercicio = req.body.DS_EXERCICIO;
    const observacaoExercicio = req.body.OBS_EXERCICIO;
    const dataInclusao = req.body.DT_INCLUSAO;
    const dataExclusao = today.toISOString();
    const idMidiaExercicio = req.body.ID_MIDIA_EXERCICIO;
    const descricaoMidiaURL = null;
    const exercicioTipo = req.body.exercicioTipo;
    // const tiposExercicio = {
    //     aerobica: 5,
    //     funcional: 15,
    //     pilates: 25
    // }

    // const idTipoExercicio = tiposExercicio[exercicioTipo.toString().toLowerCase()]

    return db.query("UPDATE TB_EXERCICIOS SET DS_EXERCICIO = ?, OBS_EXERCICIO = ?, DT_INCLUSAO = ?, DT_EXCLUSAO = ?, ID_TIPO_EXERCICIO = ?, ID_MIDIA_EXERCICIO = ?, DS_MIDIA_URL = ? WHERE ID_EXERCICIO = ?",
        [descricaoExercicio, observacaoExercicio, dataInclusao, dataExclusao, exercicioTipo, idMidiaExercicio, descricaoMidiaURL, idExercicio],
        (err, result) => {
            if (err) {
                res.send({ err, msg: 'Tente novamente!' });
            } else {
                return res.send({ msg: "Deletado com sucesso!", record: { id: res.insertId } });
            }
        }
    )
}

module.exports = { exerciciosRegister, exercicioTreinoSelect, exercicioTreinoRegister, exercicioSelect, selectTipoExercicio, exercicioEspecifico, exerciciosRegisterMidia, exercicioUpdate, exercicioDelete }
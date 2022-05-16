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
                res.status(401).send({ err })
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

const exercicioTreinoSelect = (req, res) => {
    //Busca na base todos os exercicios_treino selecionados
    db.query("SELECT * FROM tb_exercicios_treinos wHERE DT_EXCLUSAO IS NULL", (err, result) => {
        if (err) {
            res.send(err);
        } else {
            //Retorna tudo que contém na base
            res.send({ data: result })
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
            res.send(err);
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
        "WHERE EXE.ID_EXERCICIO = ? AND "+
        "EXE.ID_TIPO_EXERCICIO = TEXE.ID_TIPO_EXERCICIO",[id], (err, result) => {
        if (err) {
            res.send(err);
        } else {
            //Retorna tudo que contém na base
            res.send(result)

        }
    })
}

const selectTipoExercicio = (req, res) => {
    db.query("SELECT ID_TIPO_EXERCICIO, DS_TIPO_EXERCICIO FROM TB_TIPOS_EXERCICIOS WHERE DT_EXCLUSAO IS NULL", (err, result) => {
        if (err) {
            res.send(err);
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
            if(err) {
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
            if(err) {
                res.send({ err, msg: 'Tente novamente!' });
            } else {
                return res.send({ msg: "Deletado com sucesso!", record: { id: res.insertId } });
            }
        }
    )
}

module.exports = { exerciciosRegister, exercicioTreinoSelect, exercicioSelect, selectTipoExercicio, exercicioEspecifico, exerciciosRegisterMidia, exercicioUpdate, exercicioDelete }
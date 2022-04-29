const { db } = require('../config/database')

const exerciciosRegister = (req, res) => {
    const exercicio = req.body.exercicio;
    const exercicioObs = req.body.exercicioObs;
    const exercicioTipo = req.body.exercicioTipo;
    const tiposExercicio = {
        aerobica: 5,
        funcional: 15,
        pilates: 25
    }

    const idExercicio = tiposExercicio[exercicioTipo.toString().toLowerCase()]

    /*db.query("SELECT *FROM ") -----DESCOBRIR COMO PEGAR O ID DA MIDIA-------*/

    return db.query("INSERT INTO TB_EXERCICIOS (DS_EXERCICIO, OBS_EXERCICIO, DT_EXCLUSAO, ID_TIPO_EXERCICIO, ID_MIDIA_EXERCICIO) VALUES (?,?,?,?,?)",
        [exercicio, exercicioObs, null, idExercicio, 5],
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
    db.query("SELECT * FROM tb_exercicios_treinos", (err, result) => {
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
    db.query("SELECT * FROM TB_EXERCICIOS", (err, result) => {
        if (err) {
            res.send(err);
        } else {
            //Retorna tudo que contém na base
            res.send(result)
        }
    })
}

module.exports = { exerciciosRegister, exercicioTreinoSelect, exercicioSelect, exerciciosRegisterMidia }
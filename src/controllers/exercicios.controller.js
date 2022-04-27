const { db } = require('../config/database')

const exerciciosRegister = (req, res) => {
    const exercicio = req.body.exercicio;
    const exercicioObs = req.body.exercicioObs;
    const exercicioTipo = req.body.exercicioTipo;
    var id;
    var idMidiaExercicio;
    if (exercicioTipo === 'Aerobica' || exercicioTipo === 'aerobica') {
        id = 5;
    }

    if (exercicioTipo === 'Funcional' || exercicioTipo === 'funcional') {
        id = 15;
    }

    if (exercicioTipo === 'Pilates' || exercicioTipo === 'pilates') {
        id = 25;
    }

    /*db.query("SELECT *FROM ") -----DESCOBRIR COMO PEGAR O ID DA MIDIA-------*/

    return db.query("INSERT INTO TB_EXERCICIOS (DS_EXERCICIO, OBS_EXERCICIO, DT_EXCLUSAO, ID_TIPO_EXERCICIO, ID_MIDIA_EXERCICIO) VALUES (?,?,?,?,?)",
        [exercicio, exercicioObs, null, id, 5],
        (err, response) => {
            if (err) {
                res.status(401).send({ err })
            }
            else {
                return res.send({ msg: "Cadastrado com sucesso!" });
            }
        }
    )
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

module.exports = { exerciciosRegister, exercicioTreinoSelect, exercicioSelect }
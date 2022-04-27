const express = require('express');
const cors = require('cors');
var app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require('jsonwebtoken');
require("dotenv-safe").config();

const { db } = require('./src/config/database')

app.use(cors());
app.use(express.json());


// @controllers
const { treinoRegister, treinoSelect } = require('./src/controllers/treino.controller')
const { usuariosRegister } = require('./src/controllers/usuarios.controller')

//Nessa função estamos criando a verificação do token recebido.
function verifyJWT(req, res, next) {
    //Tipo de token passado no request
    const token = req.body.token;
    //Erro caso o token seja inválido ou vencido
    if (!token) return res.status(401).json({ auth: false, message: 'Token não fornecido.' })

    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) return res.status(500).json({ auth: false, message: 'Falha na autenticação do Token.' });

        //estando ok, salvando tudo no request para uso posterior
        req.id = decoded.id;
        next();
    })
}

app.post("/resetSenha", (req, res) => {
    const email = req.body.email
    const password = req.body.password
    db.query("SELECT * FROM TB_USUARIOS WHERE DS_EMAIL = ?", [email],
        (err, result) => {
            if (err) {
                res.send({ err, msg: 'E-mail não cadastrado!' });
            } else {
                try {
                    var id = result[0].ID_USUARIO;
                } catch (error) {
                    res.send({ error, msg: 'E-mail não cadastrado!' })
                }
                bcrypt.hash(password, saltRounds, (erro, hash) => {
                    if (erro) {
                        res.send({ msg: 'Erro ao criptografar a senha!', senha: hash })
                    } else {
                        db.query("UPDATE TB_USUARIOS SET DS_SENHA = ? WHERE DS_EMAIL = ?", [hash, email],
                            (err, result) => {
                                if (err) {
                                    res.send({ err, msg: 'Tente novamente!' })
                                } else {
                                    res.send({ msg: 'Senha alterada com sucesso!' })
                                }
                            })
                    }
                })
            }
        })
})

//Chamada para retornar todos os treinos de um usuário na base
app.post("/treinoSelect", treinoSelect)

//Chamada para retornar todos os exercicios de um usuário na base
app.get("/exercicioSelect", (req, res) => {
    //Busca na base todos os exercicios selecionados
    db.query("SELECT * FROM TB_EXERCICIOS", (err, result) => {
        if (err) {
            res.send(err);
        } else {
            //Retorna tudo que contém na base
            res.send(result)
        }
    })
})

//Chamada para retornar todos os exercicios_treino de um usuário na base
app.get("/exercicioTreinoSelect", (req, res) => {
    //Busca na base todos os exercicios_treino selecionados
    db.query("SELECT * FROM tb_exercicios_treinos", (err, result) => {
        if (err) {
            res.send(err);
        } else {
            //Retorna tudo que contém na base
            res.send({ data: result })
        }
    })
})

app.post("/treinoRegister", treinoRegister);

app.post("/register", usuariosRegister);


//verifyJWT utilizado para validar se o token está correto!
app.post("/home", verifyJWT, (req, res) => {
    res.send({ msg: "Token válido" });
});

app.post("/logout", (req, res) => {
    res.send({ msg: "Saindo" })
    res.end();
});


app.post("/delete", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    var id;

    db.query("SELECT ID_USUARIO FROM TB_USUARIOS WHERE DS_EMAIL = ?", [email],
        (err, result) => {
            if (err) {
                res.send(err)
            }
            if (result?.length) {
                id = result[0].ID_USUARIO
            }
        }
    )

    db.query("SELECT * FROM TB_USUARIOS WHERE DS_EMAIL = ?", [email],
        (err, result) => {
            console.log(result)
            if (err) {
                res.send(err)
            }
            if (result?.length) {
                bcrypt.compare(password, result[0].DS_SENHA,
                    (err, result) => {
                        if (result) {
                            db.query("DELETE FROM TB_USUARIO WHERE ID_USUARIO = ?", [id])
                            res.status(200)
                            res.send({ msg: "Usuário excluido com sucesso!" })
                        }
                        else {
                            res.status(401)
                            res.send({ msg: "Senha incorreta." })
                        }
                    });
            }
            else {
                res.status(404)
                res.send({ msg: "Usuário não encontrado." })
            }
        }
    );
})

app.post("/calculoIMC", (req, res) => {
    const peso = req.body.peso;
    const altura = req.body.altura;
    const imc = (peso / (altura * altura)).toFixed(2)
    res.status(200);
    res.json({ IMC: imc });
})

app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    var id;
    var tipoPerfil;
    db.query("SELECT usu.ID_USUARIO, perf.DS_TIPO_PERFIL FROM tb_usuarios usu INNER JOIN tb_grupos_usuarios gru ON gru.ID_USUARIO = usu.ID_USUARIO INNER JOIN heroku_56d9955fbec8988.tb_tipo_perfil perf on gru.ID_TIPO_PERFIL = perf.ID_TIPO_PERFIL WHERE usu.DS_EMAIL = ?", [email],
        (err, result) => {
            if (err) {
                res.send(err)
            }
            if (result?.length) {
                id = result[0].ID_USUARIO
                tipoPerfil = result[0].DS_TIPO_PERFIL
            }
        }
    )

    db.query("SELECT * FROM TB_USUARIOS WHERE DS_EMAIL = ?", [email],
        (err, result) => {
            console.log(result)
            if (err) {
                res.send(err)
            }
            if (result?.length) {
                bcrypt.compare(password, result[0].DS_SENHA,
                    (err, result) => {
                        if (result) {
                            //criação do JWT -
                            //Primeiro parâmetro passo o ID do cliente para geração do token.
                            //Segundo parâmetro passo o SECRET, código do servidor para criptografar e descriptografar.
                            //Terceiro parâmetro é referente ao tempo de expiração do token.
                            const token = jwt.sign({ id }, process.env.SECRET, { expiresIn: 3000 })
                            res.send({ msg: "Usuário logado com sucesso!", auth: true, token: token, perfil: tipoPerfil, Email: email })
                        }
                        else {
                            res.status(401)
                            res.send({ msg: "Senha incorreta." })
                        }

                    });

            }
            else {
                //res.status(404)
                res.send({ msg: "Usuário não encontrado." })
            }
        }
    );
});

app.post("/exerciciosregister", (req, res) => {
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
})

app.listen(process.env.PORT, () => {
    console.log("Rodando na porta 3001.")
});
const express = require('express');
const cors = require('cors');
var app = express();
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const { response } = require('express');
require("dotenv-safe").config();

const db = mysql.createPool({
    // ssl: process.env.SSL,
    //port: process.env.MYSQLPORT,
    connectionLimit: 1000,
    connectTimeout: 60 * 60 * 1000 * 60,
    acquireTimeout: 60 * 60 * 1000 * 60,
    timeout: 60 * 60 * 1000 * 60,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME

});

app.use(cors());
app.use(express.json());


//Nessa função estamos criando a verificação do token recebido.
function verifyJWT(req, res, next) {
    //Tipo de token passado no request
    const token = req.headers['x-access-token'];
    //Erro caso o token seja inválido ou vencido
    if (!token) return res.status(401).json({ auth: false, message: 'Token não fornecido.' })

    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) return res.status(500).json({ auth: false, message: 'Falha na autenticação do Token.' });

        //estando ok, salvando tudo no request para uso posterior
        req.id = decoded.id;
        next();
    })
}

app.post("/register", (req, res) => {
    const nome = req.body.nome;
    const email = req.body.email;
    const password = req.body.password;
    const profile = req.body.profile;

    return db.query("SELECT * FROM TB_USUARIOS WHERE DS_EMAIL = ?", [email],
        (err, result) => {
            if (err) {
                return res.send(err);
            }

            if (!result?.length) {
                bcrypt.hash(password, saltRounds, (erro, hash) => {
                    db.query(
                        "INSERT INTO TB_USUARIOS (DS_NOME, DS_EMAIL, DS_SENHA, ID_TIPO_PERFIL) VALUES (?, ?, ?, ?)",
                        [nome, email, hash, profile],
                        (err, response) => {
                            if (err) {
                                res.status(401).send({ msg: "Body Incorreto" })
                            } else {
                                return res.send({ msg: "Cadastrado com sucesso!" });
                            }
                        });
                })

                //rabiscar aqui

            } else {
                return res.send({ msg: "Usuário já cadastrado." })
            }
        });
});

app.post("/registerTbDadosUsuario", (req, res) => {
    const email = req.body.email
    const rua = req.body.rua;
    const cpf = req.body.cpf;
    const numeroLogradouro = req.body.numeroLogradouro;
    const bairro = req.body.bairro;
    const dataNascimento = req.body.dataNascimento;
    const cep = req.body.cep;
    const cidade = req.body.cidade;
    const uf = req.body.uf;
    var id;

    db.query("SELECT ID_USUARIO FROM TB_USUARIOS WHERE DS_EMAIL = ?", [email],
        (err, result) => {
            if (err) {
                res.send(err)
            }
            if (result) {
                id = result[0].ID_USUARIO
            }
        }
    )

    return db.query("SELECT * FROM TB_DADOS_USUARIO WHERE DS_CPF = ?", [cpf],
        (err, result) => {
            if (err) {
                return res.send(err);
            }

            if (result) {
                db.query("INSERT INTO TB_DADOS_USUARIO (DS_RUA, DS_CPF, DS_NUMERO_LOGRADOURO, DS_BAIRRO, DT_NASCIMENTO, DS_CEP, DS_CIDADE, DS_UF, ID_USUARIO) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [rua, cpf, numeroLogradouro, bairro, dataNascimento, cep, cidade, uf, id],
                    (err, response) => {
                        if (err) {
                            res.status(401).send({ msg: err })
                        } else {
                            return res.send({ msg: "Cadastrado com sucesso!" });
                        }
                    });
            }
            else {
                return res.send({ msg: "Usuário já cadastrado." })
            }
        });
});


//verifyJWT utilizado para validar se o token está correto!
app.post("/home", verifyJWT, (req, res) => {
    return res.json({ msg: "Token válido" });
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

/*
app.post("/login", (req, res) => {
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
                            db.query("DELETE FROM TB_USUARIOS WHERE ID_USUARIO = ?", [id])
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
});
*/
/*app.post("/calculoIMC", (req, res) => {
    const peso = req.body.peso;
    console.log(peso);
    const altura = req.body.altura;
    console.log(altura);
    const imc = (peso / (altura * altura)).toFixed(2)
    console.log(imc)
    res.status(200);
    res.json({ msg: imc });
});*/

app.post("/login", (req, res) => {
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
                            //criação do JWT -
                            //Primeiro parâmetro passo o ID do cliente para geração do token.
                            //Segundo parâmetro passo o SECRET, código do servidor para criptografar e descriptografar.
                            //Terceiro parâmetro é referente ao tempo de expiração do token.
                            const token = jwt.sign({ id }, process.env.SECRET, { expiresIn: 3000 })
                            res.send({ msg: "Usuário logado com sucesso!", auth: true, token: token })
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
    var id_Tipo_Exercicio;
    switch(exercicioTipo) {
        case 'aerobica':
            id_Tipo_Exercicio = 5;
            break;
        case 'funcional':
            id_Tipo_Exercicio = 15;
            break;
        case 'pilates':
            id_Tipo_Exercicio = 25;
            break;
    }

    return db.query("INSERT INTO TB_EXERCICIOS (DS_EXERCICIO, OBS_EXERCICIO, DT_EXCLUSAO, ID_TIPO_EXERCICIO) VALUES (?,?,?,?)",
        [exercicio, exercicioObs, null, id_Tipo_Exercicio],
        (err, response) => {
            if (err) {
                res.status(401).send({ msg: "Body Incorreto" })
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
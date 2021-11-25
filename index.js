const express = require('express');
const cors = require('cors');
var app = express();
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require('jsonwebtoken');
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

app.use(express.json());

app.use((req, res, next) => {
    res.header("Acess-Control-Allow-Origin", "*");
    res.header("Acess-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Request-Headers", "x-acess-token", "Content-Type");
    app.use(cors());
    next();
})

//Nessa função estamos criando a verificação do token recebido.
function verifyJWT(req, res, next){
    //Tipo de token passado no request
    const token = req.headers['x-acess-token'];
    //Erro caso o token seja inválido ou vencido
    if(!token) return res.status(401).json({ auth: false, message: 'Token não fornecido.' })

    jwt.verify(token, process.env.SECRET, function(err, decoded){
        if(err) return res.status(500).json({auth: false, message: 'Falha na autenticação do Token.'});

        //estando ok, salvando tudo no request para uso posterior
        req.id = decoded.id;
        next();
    })
}

app.post("/register", (req, res) => {
    const nome = req.body.nome;
    const email = req.body.email;
    const password = req.body.password;

    return db.query("SELECT * FROM TB_USUARIO WHERE DS_EMAIL = ?", [email],
        (err, result) => {
            if (err) {
                return res.send(err);
            }

            if (!result?.length) {
                bcrypt.hash(password, saltRounds, (erro, hash) => {
                    db.query(
                        "INSERT INTO TB_USUARIO (DS_NOME, DS_EMAIL, DS_SENHA) VALUES (?, ?, ?)",
                        [nome, email, hash],
                        (err, response) => {
                            if (err) {
                                res.status(401).send({ msg: "Body Incorreto"})
                            } else {
                                return res.send({ msg: "Cadastrado com sucesso!" });
                            }
                        });
                })

            } else {
                return res.send({ msg: "Usuário já cadastrado." })
            }
        });
});

//verifyJWT utilizado para validar se o token está correto!
app.post("/home", verifyJWT, (req, res) => {
    return res.json({msg: "Token válido"});
});

app.post("/logout", (req, res) => {
    res.send({ msg: "Saindo" })
    res.end();
});

app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    var id;
    db.query("SELECT ID_USUARIO FROM TB_USUARIO WHERE DS_EMAIL = ?", [email],
        (err, result) => {
            if(err) {
                res.send(err)
            }
            if(result?.length){
                id = result[0].ID_USUARIO
            }
        }
    )
    db.query("SELECT * FROM TB_USUARIO WHERE DS_EMAIL = ?", [email],
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
                            const token = jwt.sign({id}, process.env.SECRET, { expiresIn: 3000})
                            res.send({ msg: "Usuário logado com sucesso!", auth: true, token })
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

app.listen(process.env.PORT, () => {
    console.log("Rodando na porta 3001.")
});
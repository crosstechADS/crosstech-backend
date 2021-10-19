const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
require("dotenv-safe").config();

const db = mysql.createPool({
    connectionLimit: 1000,
    connectTimeout: 60 * 60 * 1000,
    acquireTimeout: 60 * 60 * 1000,
    timeout: 60 * 60 * 1000,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME

});

app.use(express.json());
app.use(cors());


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
                                return res.send(err);
                            }
                            return res.send({ msg: "Cadastrado com sucesso!" });
                        });
                })

            } else {
                return res.send({ msg: "Usuário já cadastrado." })
            }
        });
});

app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    db.query("SELECT * FROM TB_USUARIO WHERE DS_EMAIL = ?", [email],
        (err, result) => {
            if (err) {
                res.send(err);
            }
            if (result.length > 0) {
                bcrypt.compare(password, result[0].DS_SENHA,
                    (erro, result) => {
                        if (result) {
                            res.send({ msg: "Usuário logado com sucesso!" });
                        }
                        else {
                            res.send({ msg: "Senha incorreta." })
                        }

                    });

            }
            else {
                res.send({ msg: "Usuário não encontrado." })
            }


        }
    );
});

app.listen(process.env.PORT, () => {
    console.log("Rodando na porta 3001.")
});
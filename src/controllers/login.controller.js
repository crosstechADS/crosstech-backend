const { db } = require('../config/database')
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require("dotenv-safe").config();

const login = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    var id;
    var tipoPerfil;
    db.query("SELECT usu.ID_USUARIO, perf.DS_TIPO_PERFIL FROM tb_usuarios usu INNER JOIN tb_grupos_usuarios gru ON gru.ID_USUARIO = usu.ID_USUARIO INNER JOIN heroku_56d9955fbec8988.tb_tipo_perfil perf on gru.ID_TIPO_PERFIL = perf.ID_TIPO_PERFIL WHERE usu.DS_EMAIL = ?", [email],
        (err, result) => {
            if (err) {
                res.send({ err, msg: "Ocorreu um erro ao buscar tipo de perfil!" })
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
                res.send({ err, msg: "Ocorreu um erro ao consultar usuários!" })
            }
            if (result?.length) {
                bcrypt.compare(password, result[0].DS_SENHA,
                    (err, result) => {
                        if (result) {
                            //criação do JWT -
                            //Primeiro parâmetro passo o ID do cliente para geração do token.
                            //Segundo parâmetro passo o SECRET, código do servidor para criptografar e descriptografar.
                            //Terceiro parâmetro é referente ao tempo de expiração do token.
                            const token = jwt.sign({ id, perfil: tipoPerfil }, process.env.SECRET, { expiresIn: 3000 })
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
};

const logout = (req, res) => {
    res.send({ msg: "Saindo" })
    res.end();
}

module.exports = { login, logout }
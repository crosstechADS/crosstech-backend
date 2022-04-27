const { db } = require('../config/database')
const bcrypt = require("bcrypt");
const saltRounds = 10;

const usuariosRegister = (req, res) => {

    const {
        nome, email, password, profile,
        rua, cpf, numeroLogradouro, bairro,
        dataNascimento, cep, cidade, uf
    } = req.body;

    var id;
    var idProfile;

    if (profile.toLowerCase() === 'gerente' || profile.toLowerCase() === 'gerencia') {
        idProfile = 5;
    }

    if (profile.toLowerCase() === 'aluno' || profile.toLowerCase === 'aluna') {
        idProfile = 15;
    }

    if (profile.toLowerCase() === 'professor' || profile.toLowerCase() === 'professora') {
        idProfile = 25;
    }

    if (profile.toLowerCase() === 'recepcionista') {
        idProfile = 35;
    }

    return db.query("SELECT * FROM TB_USUARIOS WHERE DS_EMAIL = ?", [email],
        async (err, result) => {
            if (err) {
                return res.send(err);
            }

            if (!result?.length) {
                const hash = await bcrypt.hash(password, saltRounds);
                db.query(
                    "INSERT INTO TB_USUARIOS (DS_NOME, DS_EMAIL, DS_SENHA) VALUES (?, ?, ?)",
                    [nome, email, hash],
                    (err) => {
                        if (err) {
                            res.status(401).send(err)
                        } else {
                            db.query("SELECT ID_USUARIO FROM TB_USUARIOS WHERE DS_EMAIL = ?", [email],
                                (err, result) => {
                                    if (err) {
                                        res.send(err)
                                    }
                                    else {
                                        id = result[0].ID_USUARIO;

                                        db.query("SELECT * FROM TB_DADOS_USUARIOS WHERE DS_CPF = ?", [cpf],
                                            (err, result) => {
                                                if (err) {
                                                    return res.send(err);
                                                }
                                                else {
                                                    db.query("INSERT INTO TB_DADOS_USUARIOS (DS_RUA, DS_CPF, DS_NUMERO_LOGRADOURO, DS_BAIRRO, DT_NASCIMENTO, DS_CEP, DS_CIDADE, DS_UF, ID_USUARIO) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                                                        [rua, cpf, numeroLogradouro, bairro, dataNascimento, cep, cidade, uf, id],
                                                        (err) => {
                                                            if (err) {
                                                                return res.send(err);
                                                            }
                                                            else {
                                                                db.query("INSERT INTO TB_GRUPOS_USUARIOS (DS_GRUPO_USUARIO, ID_USUARIO, ID_TIPO_PERFIL) VALUES (concat(?, ' - ', ?), ?, ?)",
                                                                    [nome, profile, id, idProfile], (err) => {
                                                                        return res.status(err ? 500 : 200).send({ msg: err ? err.message : "Cadastrado com sucesso!" })
                                                                    })
                                                            }
                                                        })
                                                }
                                            })
                                    }
                                }
                            )
                        }
                    });
            } else {
                return res.send({ msg: "Usuário já cadastrado." })
            }
        });
};

module.exports = { usuariosRegister }
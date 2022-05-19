const res = require("express/lib/response");
const bcrypt = require("bcrypt");

const authenticate = async (req, res) => {
    const { email, password } = req.body;

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
                res.status(400).send({ msg: "Usuário não encontrado." })
            }
        }
    );
}
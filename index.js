const express = require('express');
const cors = require('cors');
var app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require('jsonwebtoken');
require("dotenv-safe").config();
const path = require('path')
const { db } = require('./src/config/database')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use('/files', express.static(path.resolve(__dirname, "..", "tmp", "uploads")))


// @controllers
const { treinoRegister, treinoSelect, treinosSelect, treinoEspecifico, updateTreino, deleteTreino } = require('./src/controllers/treino.controller')
const { usuariosRegister, alunosSelect, resetSenha } = require('./src/controllers/usuarios.controller')
const { login, logout } = require('./src/controllers/login.controller')
const { exerciciosRegister, selectTipoExercicio, exercicioTreinoSelect, exercicioTreinoRegister, exercicioSelect, exercicioEspecifico, exerciciosRegisterMidia, exercicioUpdate, exercicioDelete } = require('./src/controllers/exercicios.controller')
const { calculoIMC } = require('./src/controllers/avaliacaoFisica.controller');
const multer = require('multer');
const multerConfig = require('./src/config/multer')
const AuthMiddleware = require('./src/middlewares/auth');
const AuthProfessorMiddleware = require('./src/middlewares/professorMiddlewareProfile');

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

//função chamando todos os usuários que são alunos
app.get("/alunosSelect", AuthMiddleware, AuthProfessorMiddleware, alunosSelect);

app.post("/resetSenha", resetSenha);

//Chamada para retornar todos os treinos de um usuário na base
app.post("/treinoSelect", treinoSelect);

app.get("/treinosSelect", treinosSelect);

app.get("/treinoEspecifico/:id", treinoEspecifico);

//Chamada para retornar todos os exercicios de um usuário na base
app.get("/exercicioSelect", exercicioSelect);

app.get("/exercicioEspecifico/:id", exercicioEspecifico);

//Chamada para retornar todos os exercicios_treino de um usuário na base
app.get("/exercicioTreinoSelect/:id", exercicioTreinoSelect);

app.post("/exercicioTreinoRegister", exercicioTreinoRegister);

app.get("/selectTipoExercicio", selectTipoExercicio);

app.post("/treinoRegister", treinoRegister);

app.post("/authenticate",)

app.post("/register", usuariosRegister);

//verifyJWT utilizado para validar se o token está correto!
app.post("/home", verifyJWT, (req, res) => {
    res.send({ msg: "Autenticado" });
});

app.post("/logout", logout);

app.post("/calculoIMC", calculoIMC);

app.post("/login", login);

app.post("/exerciciosregister", exerciciosRegister);

app.post("/exerciciosregister/:id/midia", multer(multerConfig).single('file'), exerciciosRegisterMidia);

app.post("/updateExercicio", exercicioUpdate);

app.post("/exercicioDelete", exercicioDelete);

app.post("/updateTreino", updateTreino);

app.post("/deleteTreino", deleteTreino);

app.listen(process.env.PORT, () => {
    console.log("Rodando na porta 3001.")
});
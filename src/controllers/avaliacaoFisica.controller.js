const calculoIMC = (req, res) => {
    const peso = req.body.peso;
    const altura = req.body.altura;
    const imc = (peso / (altura * altura)).toFixed(2)
    res.status(200);
    res.json({ IMC: imc });
}

module.exports = { calculoIMC }
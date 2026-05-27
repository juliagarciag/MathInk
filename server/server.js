const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json({
    limit:"10mb"
}));

const genAI =
new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

app.post("/resolver", async (req, res) => {

    try{

       const model =
genAI.getGenerativeModel({
    model:"gemini-flash-latest"
        });

        const imagem =
        req.body.imagem;

        const result =
        await model.generateContent([
            "Você é um leitor de contas matemáticas escritas à mão. Leia cuidadosamente a expressão matemática presente na imagem e responda SOMENTE a expressão matemática detectada, sem explicações.",
            {
                inlineData:{
                    mimeType:"image/png",
                    data:imagem
                }
            }
        ]);

        const resposta =
        result.response.text();

        res.json({
            expressao: resposta
        });

    }
 catch(error){

    console.log("ERRO DO GEMINI:");
    console.log(error);

    res.status(500).json({
        erro: error.message
    });

}

});

app.post("/explicar", async (req, res) => {

    try{

        const model =
        genAI.getGenerativeModel({
            model:"gemini-flash-latest"
        });

        const expressao = req.body.expressao;

        const result =
        await model.generateContent(`
Explique a conta ${expressao} passo a passo, de forma muito simples, como se estivesse ensinando uma estudante.
Use frases curtas.
Não complique.
No final, mostre o resultado.
        `);

        const explicacao =
        result.response.text();

        res.json({
            explicacao
        });

    }catch(error){

        res.status(500).json({
            erro:error.message
        });

    }

});

app.listen(3000, () => {

    console.log("Servidor rodando!");

});

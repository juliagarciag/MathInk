const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const tamanho = document.getElementById("tamanho");

let desenhando = false;
let corAtual = "black";

canvas.addEventListener("mousedown", () => {
    desenhando = true;
});

canvas.addEventListener("mouseup", () => {
    desenhando = false;
    ctx.beginPath();
});

canvas.addEventListener("mousemove", desenhar);

function desenhar(event){

    if(!desenhando) return;

    ctx.lineWidth = tamanho.value;
    ctx.lineCap = "round";
    ctx.strokeStyle = corAtual;

    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
}

function modoCaneta(){
    corAtual = "black";
}

function modoBorracha(){
    corAtual = "white";
}

function limparCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
async function resolverConta(){

    const resposta =
    document.getElementById("respostaIA");

    resposta.innerHTML =
    "🤖 Analisando escrita...";

    try{

        const imagem =
        canvas.toDataURL("image/png")
        .replace(
            "data:image/png;base64,",
            ""
        );

        const req =
        await fetch(
            "http://localhost:3000/resolver",
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({
                    imagem
                })
            }
        );
     const data = await req.json();

console.log(data);

if(data.expressao){

    resposta.innerHTML = `
        <p>✨ Expressão detectada:</p>

        <input
        type="text"
        id="expressaoDetectada"
        value="${data.expressao.trim()}"
        >

        <br><br>

        <button onclick="calcularExpressaoDetectada()">
            ✅ Está certo, calcular
        </button>
    `;

}else{
    resposta.innerHTML = `
    ❌ A IA não conseguiu reconhecer.
    <br><br>
    ${data.erro}
    `;
}

    }

    catch(error){

        resposta.innerHTML =
        "❌ Erro ao analisar imagem.";

        console.log(error);

    }

}
function calcularExpressaoDetectada(){

    const campo =
    document.getElementById("expressaoDetectada");

    const resposta =
document.getElementById("respostaIA");

    let expr = campo.value;

    try{

        let exprJS = expr
            .replaceAll("√", "Math.sqrt")
            .replaceAll("sqrt", "Math.sqrt")
            .replaceAll("PI", "Math.PI")
            .replaceAll("π", "Math.PI")
            .replace(/sin\(([^)]+)\)/g, "Math.sin(($1)*Math.PI/180)")
            .replace(/cos\(([^)]+)\)/g, "Math.cos(($1)*Math.PI/180)")
            .replace(/tan\(([^)]+)\)/g, "Math.tan(($1)*Math.PI/180)")
            .replaceAll("log", "Math.log10")
            .replace(/\^/g, "**");
           

        let resultado = eval(exprJS);

        resposta.innerHTML = `
            <p>✅ Expressão confirmada:</p>
            <div class="expressao-final">${expr}</div>

            <p>🧮 Resultado:</p>
            <div class="resultado-ia">${resultado}</div>

            <br><br>

              <button class="botao-ia" onclick="explicarPassoAPasso('${expr}')">
             📚 Explicar passo a passo
            </button>
              `;

  }catch(error){

        resposta.innerHTML = `
            ❌ Não consegui calcular essa expressão.
            <br><br>
            Tente editar para algo como: 2+2 ou sqrt(9)
        `;

    }
}
function limparRespostaIA(){

    const resposta =
    document.getElementById("respostaIA");

    resposta.innerHTML = "";

}
async function explicarPassoAPasso(expressao){

    const resposta = document.getElementById("respostaIA");

    resposta.innerHTML += `
        <br><br>
        🤖 Criando explicação...
    `;

    const req = await fetch("http://localhost:3000/explicar", {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            expressao: expressao
        })
    });

    const data = await req.json();

    resposta.innerHTML += `
        <div class="explicacao-ia">
            ${data.explicacao.replace(/\n/g, "<br>")}
        </div>
    `;
}
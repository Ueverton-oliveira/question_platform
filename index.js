const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

//Database

connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com sucesso!")
    })
    .catch((msgErro) => {
        console.log(msgErro);
    })

// Rederizando em EJS
app.set('view engine', 'ejs');
app.use(express.static('public'));

//Renderizando biblioteca do "Body-parser" para salvar dados de formulário"
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Rotas reederizada RENDER em EJS para aplicações necessárias
app.get("/", (req, res) => {
    Pergunta.findAll({ raw: true, order:[
        ['id', 'DESC'] //ASC = Crescente || DESCE = Decrescente
    ]}).then(perguntas => {
        console.log(perguntas);
        res.render("index",{
            perguntas: perguntas
        });
    });
});

app.get("/perguntar",(req, res) => {
    res.render("perguntar");
})

//Recomendasse palavras em inglês "Por exemplo, save say". Foi ultilizado 
//GET por conta do metodo do "form" e "send" para envio do mesmo
app.post("/salvarpergunta",(req, res) =>{
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/");
    });
});

app.get("/pergunta/:id",(req, res) => {
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order:[ 
                    ['id','DESC'] 
                ]
            }).then(respostas => {
                res.render("pergunta",{
                    pergunta: pergunta,
                    respostas: respostas
                });
            });

        }else{ // Não encontrada
            res.redirect("/");
        }
    });
})

app.post("/responder",(req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/"+perguntaId);
    });
});

app.listen(8080,()=>{console.log("App rodando!");});


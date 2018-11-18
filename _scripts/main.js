//_____________Recursos_______________________________________________________________________________________________________________
const CANVAS = document.querySelector('canvas'); // canvas
const CTX = CANVAS.getContext('2d'); // Contexto
//Entradas
const LEFT = 37, RIGHT = 39, ENTER = 13, SPACE = 32; // códigos das teclas
const FIRE = 0, EXPLOSION = 1; // constantes do som
//Ações
let mvleft = mvright = tiro = spacepressionado = false;

//Estados do game
const LOADING = 0, PLAYING = 1, PAUSED = 2, OVER = 3;
let gameState = LOADING;;// Estado atual

//Imagens
let img = new Image();
let sprites = [],recursosaCarregar = [];//Arrays Imagens
img.addEventListener('load',carregarRecurso,false); // chama evento para carregar
img.src = '_images/background_game.png'; // link da imagem
recursosaCarregar.push(img); // insere imagem ao array de imagens a carregar
let recursosCarregados = 0;//contador de recursos

//sprites
let background = new Sprite(0,56,400,500,0,0); // cenario
sprites.push(background);
let defender = new Sprite(0,0,30,50,185,450); // nave
sprites.push(defender);

let misseis = [],aliens = [],mensagens = [], frequenciaAlien = 100,timerAlien=0;

//Pontuação
let disparos = 0, acertos = 0, desempenho = 0, ptsvencer = 100;

//Mensagens
let mensageminicial = new Mensagem(CANVAS.height/2,"Pressione ENTER para iniciar","red"); // cria mensagem inicial
let mensagempausa = new Mensagem(CANVAS.height/2,"Pausado","red"); // cria mensagem pausa
mensagempausa.visible = false; // some com mensagem de pausa
let mensagemscore = new Mensagem(10,"","white"); // cria placar
mensagemscore.font = "normal bold 6pt emulogic";
updateScore();
let mensagemgameover = new Mensagem(CANVAS.height/2,"","red");
mensagemgameover.visible = false;
mensagens.push(mensageminicial); // insere no array
mensagens.push(mensagempausa); // insere no array
mensagens.push(mensagemscore); // insere no array
mensagens.push(mensagemgameover); // insere no array

//Listeners
window.addEventListener('keydown',function(e){
       let key = e.keyCode; // pega o código da tecla pressionada
    switch(key){
        case LEFT:
            mvleft = true;
            break;
        case RIGHT:
            mvright = true;
            break;
        case SPACE:
            if (!spacepressionado){ // verifica se o espaço já estava pressionado
                spacepressionado = true; // marca como pressionado
                tiro = true; //habilita o tiro
            }
            break;
    } 
},false); // false no final impede que funções sejam executadas simultaneamente
window.addEventListener('keyup',function(e){    let key = e.keyCode; // pega o código da tecla pressionada
    switch(key){
        case LEFT:
            mvleft = false;
            break;
        case RIGHT:
            mvright = false;
            break;
        case ENTER:
            if (gameState != OVER){
                 if(gameState!= PLAYING){ // se o game ainda não foi iniciado
                    gameState = PLAYING;
                    mensageminicial.visible = false; // some com texto inicial
                    mensagempausa.visible = false;
                }else{
                    gameState = PAUSED;
                    mensagempausa.visible = true;
                }
            }
            break;
        case SPACE:
            spacepressionado = false;
            break;
    }},false); // false no final impede que funções sejam executadas simultaneamente
//_____________________________________________________________________________________________________________________________________

function loop(){
    requestAnimationFrame(loop, CANVAS); // deixa essa função em loop passando o canvas como parâmetro
    switch(gameState){ // verifica estado atual do jogo
        case LOADING:
            break;
        case PLAYING:
            update();
            break;
        case OVER:
            fimJogo();
            break;
    }
    desenha(); // após verificar estado do jogo desenha ele na tela
}

function update(){
    if (mvleft && !mvright){ // se pressionou para esquerda ele move
        defender.vx = -5;
    }else if (mvright && !mvleft){ // se pressionou para direita ele move
        defender.vx = 5;
    }else{ // se não pressionou ele não move
        defender.vx = 0;
    }// movimenta nave
    if (tiro){
        disparar(); // dispara
        tiro = false; // desabilita o tiro
    }//disparo
    defender.x = Math.max(0,(Math.min(CANVAS.width-defender.width,defender.x + defender.vx))); // limita a movimentação de 0 até o tamanho da tela menos o tamanho da nave e atualiza posição
    for (let i in misseis){
        let missel = misseis[i];
        missel.y+= missel.vy;
        if (missel.y<missel.height){
            removeObjeto(missel,misseis); // remove dos misseis
            removeObjeto(missel,sprites); // remove dos sprites
            updateScore();
            i--; // desconsidera indice atual
        }
    }
    timerAlien++; // incrementa timer do alien
    if(timerAlien === frequenciaAlien){
        desenhaAlien(); // desenha alien
        timerAlien = 0; // zera o timer para iniciar novamente
        if (frequenciaAlien>2){ // verifica se a frequencia é maior que 2 para não gerar uma parede de aliens
        frequenciaAlien--; //decrementa frequencia
        }
    }//verifica se o timer está igual a frequencia
    for (let i in aliens){
        let alien = aliens[i];
        if (alien.estado !== alien.EXPLODIDO){ // se não foi explodido
            alien.y += alien.vy;
            if (alien.estado === alien.LOUCO){
                if(alien.x > CANVAS.width-alien.width || alien.x <0){
                    alien.vx *= -1; // muda direção
                }// se chegar na borda muda a direção
                alien.x += alien.vx; // incrementa zig zag
            } // caso seja um alien louco
        }// se o alien não foi explodido
        if (alien.y > CANVAS.height + alien.height){
            gameState = OVER;
        } // se o alien passar pelo defender
        if (colisao(alien,defender)){
            destroiAlien(alien);
            removeObjeto(defender,sprites);
            gameState = OVER;
        } // se o alien colidir com o defender
        for (let j in misseis){
            let tiro = misseis[j];
            if (colisao(tiro,alien) && alien.estado !== alien.EXPLODIDO){
                destroiAlien(alien);
                acertos++;
                updateScore();
                if (parseInt(acertos) === ptsvencer){ //(acertos == ptsvencer) 
                    gameState = OVER;
                    for (let k in aliens){
                        let alienk = alien[k];
                        destroiAlien(alienk);
                    } // destroi todos os aliens
                } // verifica se atingiu a pontuação
                removeObjeto(tiro,misseis);
                removeObjeto(tiro,sprites);
                j--;
                i--;
            } // se o tiro colidiu com o alien
                    }// verifica se o alien colidiu com algum tiro
    }
} // atualiza game

function desenha(){
    CTX.clearRect(0,0,CANVAS.width,CANVAS.height); // limpa tela
    if (sprites.length !== 0){ // se não tem nenhum sprite para exibir
        for (let i in sprites){
            let spr = sprites[i];
            //desenha imagem (imagem,origemX,origemY,origemLargura,origemAltura,exibeorigemX,exibeOrigemY,exibeLargura,exibealtura)
            CTX.drawImage(img,spr.srcx,spr.srcy,spr.width,spr.height,Math.floor(spr.x),Math.floor(spr.y),spr.width,spr.height);
        }  
    } // exibe sprites
    if (mensagens.length !== 0){
       for (let i in mensagens){
           let mensagem = mensagens[i];
           if(mensagem.visible){
               CTX.font = mensagem.font;
               CTX.fillStyle = mensagem.color;
               CTX.textBaseline = mensagem.baseline;
               mensagem.x = (CANVAS.width - CTX.measureText(mensagem.text).width)/2; //posição em X é igual a largura do canvas menos a largura do texto dividido por 2, sendo que a função measureText(texto).width pega a largura do texto. Teto centralizado
               CTX.fillText(mensagem.text,mensagem.x,mensagem.y); // adiciona texto ao contexto
           }
       } 
    } // exibe mensagens
} // desenha imagens

function carregarRecurso(){ // cada vez que um recurso é carregado essa função é disparada
    recursosCarregados++; // incremeta o n° de recursos carregadoss
    if (recursosCarregados === recursosaCarregar.length){ // se o n° de recursos carregados é igual ao de recursos a carregar
        img.removeEventListener('load',carregarRecurso,false); // para o carregamento
        gameState = PAUSED; // inicia jogo
    }
} // carrega recursos visuais

function disparar(){
    let missel = new Sprite(136,12,8,13,defender.centerX()-4,defender.y-13); // posiciona missil a frente da nave
    missel.vy = -8; // velocidade do tiro
    sprites.push(missel);
    misseis.push(missel);
    playSound(FIRE);
    disparos++;
} // dispara tiros

function removeObjeto(objeto,array){
    let indice = array.indexOf(objeto);// indexOf busca no array o onjeto especificado
    if (indice!== -1){
        array.splice(indice,1);// remove a partir do indice 1 posição
    }
} // remove objetos da tela

function desenhaAlien(){
    let positionAlien = Math.floor(Math.random()*8)*50; // cria valor aleatorio entre 0 e 350, dividindo o canvas em 8 colunas de 50px
    let alien = new Alien(30,0,50,50,positionAlien,-50); // -50 cria o alien antes da tela para ser visto descendo
    alien.vy = 1;
    
    if (Math.floor(Math.random()*11)>7){ // 30% de chance
        alien.estado = alien.LOUCO;
            alien.vx = 2;
    } // alien louco
    if (Math.floor(Math.random()*11)>5){
        alien.vy = 2;
    } // alien aleatório acelerado
    
    sprites.push(alien);
    aliens.push(alien);
} // desenha os aliens

function destroiAlien(alien){
    alien.estado = alien.EXPLODIDO;
    alien.explode();
    playSound(EXPLOSION);
    setTimeout(function(){
        removeObjeto(alien,aliens);
        removeObjeto(alien,sprites);
    },1000);
}

function updateScore(){
    if (disparos === 0){
        desempenho = 100;
    }else{
        desempenho = Math.floor((acertos/disparos)*100);
    } // Calculo desempenho
    if (desempenho<100){
        desempenho = desempenho.toString();
        if (desempenho.length < 2){
            desempenho = "  "+desempenho;
        }else{
            desempenho = " "+desempenho;
        }
    } // ajuste no texto de desempenho
    acertos = acertos.toString();
    if (acertos.length <2){
        acertos = "00"+acertos;
    }else if (acertos.length <3){
        acertos = "0"+acertos;
    }
    mensagemscore.text = "Acertos: "+ acertos +" - Desempenho: "+desempenho+"%";
}

function fimJogo(){
    if (acertos<ptsvencer){
        mensagemgameover.text = "O planeta foi destruído!";
    }else{
        mensagemgameover.text = "O planeta foi salvo!";
        mensagemgameover.color = "blue";
    }
    mensagemgameover.visible = true;
    setTimeout(function(){
        location.reload();
    },3000);
}

function playSound(soundType){
    let sound = document.createElement("audio");
    if (soundType == EXPLOSION){
        sound.src = "_sounds/explosion.ogg";
    }else{
        sound.src = "_sounds/fire.ogg";
    }
    sound.addEventListener("canplaythrough",function(){
        sound.play();
    },false);
}
loop(); // inicia jogo
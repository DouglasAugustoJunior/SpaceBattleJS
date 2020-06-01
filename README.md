
#[Douglas Augusto](http://github.com/DouglasAugustoJunior)- Outros projetos. # 
 
![VERSÃO DO SW](https://img.shields.io/badge/Version-1.0-blue.svg)
 
![LINGUAGEM FINALIDADE](https://img.shields.io/badge/javascript-game-orange.svg)
 
O **Battle Space JS** é um projeto simples que utilizei para aprimorar meus conhecimentos em JS. **[Projeto Online](https://douglasaugustojunior.github.io/SpaceBattleJS/)**

![Imagem](https://github.com/DouglasAugustoJunior/SpaceBattleJS/blob/master/images/game.PNG)

![Imagem](https://github.com/DouglasAugustoJunior/SpaceBattleJS/blob/master/images/game1.PNG)

Desenvolvido em HTML5,CSS3 e JS, ele traz diversas situações interessantes para utilizar diversos recursos.
 
## O game
 

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

##Colisão

    function colisao(sprite1,sprite2){
    let hit = false;
    //calcula distância entre os centros dos sprites
    let vetX = sprite1.centerX() - sprite2.centerX();
    let vetY = sprite1.centerY() - sprite2.centerY();
    
    //armazena a soma das metades dos sprites na largura e altura
    let somaMetadeLargura = sprite1.metadeWidth() + sprite2.metadeWidth();
    let somaMetadeAltura = sprite1.metadeHeight() + sprite2.metadeHeight();
    
    if ((Math.abs(vetX) < somaMetadeLargura) && (Math.abs(vetY) < somaMetadeAltura)){ // math.abs tras o valor absoluto pois positivo ou negativo não irá interferir
        hit = true;
    }// verifica se colidiu
        return hit;
    }

 
Para mais informações acesse [meus repositórios](http://github.com/DouglasAugustoJunior).
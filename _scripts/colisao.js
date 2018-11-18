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
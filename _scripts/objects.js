function Sprite(srcx,srcy,width,height,x,y){
    this.srcx = srcx;
    this.srcy = srcy;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.vx = 0;  // velocidade em X
    this.vy = 0; // velocidade em Y
}

Sprite.prototype.centerX = function(){
    return this.x + (this.width/2);
} // retorna o centro de X

Sprite.prototype.centerY = function(){
    return this.y + (this.height/2);
} // retorna o centro de Y

Sprite.prototype.metadeWidth = function(){
    return this.width/2;
} // retorna metade da largura

Sprite.prototype.metadeHeight = function(){
    return this.height/2;
} // retorna metade da altura

function Alien(srcx,srcy,width,height,x,y){ // herança de Sprite
    Sprite.call(this,srcx,srcy,width,height,x,y); // chama construtor do Sprite
    this.NORMAL = 1;
    this.EXPLODIDO = 2;
    this.LOUCO = 3;
    this.estado = this.NORMAL;
    this.estiloMovimento = this.NORMAL;
} // herança

Alien.prototype = Object.create(Sprite.prototype); // passa métodos do sprite ao alien

Alien.prototype.explode = function(){
    this.srcx = 80;
    this.width = this.height = 56;
} // muda imagem para explosão

let Mensagem = function(y,text,color){
    this.x = 0; // coordenada x
    this.y = y; // coordenada y
    this.text = text; // texto da mensagem
    this.visible = true; // se a mensagem estará visivel
    this.font = "normal bold 10pt emulogic"; // tipo da fonte, sendo 40 pontos, ideal para texto
    this.color = color; // cor do texto
    this.baseline = "top"; // alinhamento/ancoragem do texto
}
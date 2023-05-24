const LARGURA_ABELHA = 50;
const ALTURA_ABELHA = 50;

let abelhinhas = [];


// função que cria uma abelhinha
function Abelhinha(tempoAtrasoParaIniciar) {
  this.el = document.createElement('img');
  this.el.src = 'imgs/abelha-voadora.gif';
  this.el.style.width = LARGURA_ABELHA + 'px';
  this.el.style.position = 'fixed';

  this.el = document.body.appendChild(this.el);

  this.posiciona(tempoAtrasoParaIniciar);
}

Abelhinha.prototype.remove = function() {
  document.body.removeChild(this.el);
};

Abelhinha.prototype.posiciona = function(tempoAtrasoParaIniciar) {
  this.porcentagemTrajeto = 0;
  
  // qual posição x inicial e final da abelha
  // sempre surgem da esquerda e vão para a direita
  this.xInicial = 0 - LARGURA_ABELHA;
  this.xFinal = window.innerWidth;

  // qual posição y inicial e final da abelha
  // elas podem surgir em qualquer ponto y (considerando altura da janela)
  const UM_QUARTO_DA_ALTURA_DA_JANELA = window.innerHeight / 4;
  this.yInicial = Math.random() * (UM_QUARTO_DA_ALTURA_DA_JANELA - ALTURA_ABELHA);
  this.yFinal = Math.random() * (UM_QUARTO_DA_ALTURA_DA_JANELA - ALTURA_ABELHA);

  this.el.style.left = `${this.xInicial}px`;
  this.el.style.bottom = `${this.yInicial}px`;

  // duração da animação: de 3s até 6s (aleatório) 
  this.tempoTrajeto = 3000 + Math.random() * 3000;

  // tempo que a abelha vai esperar até surgir (especificado no parâmetro ou algo enre 0s e 7s)
  this.tempoAtrasoParaIniciar = tempoAtrasoParaIniciar || Math.random() * 7000;
};

Abelhinha.prototype.atualiza = function(delta) {
  if (this.tempoAtrasoParaIniciar >= 0) {
    this.tempoAtrasoParaIniciar -= delta;
    return;
  }
  this.porcentagemTrajeto += delta / this.tempoTrajeto;
  this.x = this.xInicial + this.porcentagemTrajeto * (this.xFinal - this.xInicial);
  this.y = this.yInicial + this.porcentagemTrajeto * (this.yFinal - this.yInicial) + Math.sin(this.porcentagemTrajeto* 4 * 3.14159) * (4*ALTURA_ABELHA);
  this.y = Math.max(this.y, 0);
  this.el.style.left = `${this.x}px`;
  this.el.style.bottom = `${this.y}px`;

  // se concluiu o trajeta (esquerda para direita e saiu da tela),
  // reposiciona a abelha à esquerda e com um novo Y aleatório
  if (this.porcentagemTrajeto >= 1) {
    this.posiciona();
  }
};

let inicio = null;

function atualizaAbelhinhas(agora) {
  if (!inicio) inicio = agora;
  let delta = agora - inicio;
  for (abelhinha of abelhinhas) {
    abelhinha.atualiza(delta);
  }
  inicio = agora;
  window.requestAnimationFrame(atualizaAbelhinhas);
}
atualizaAbelhinhas(0);


// se pressionar '+' ou '-', adiciona nova ou remove uma
// abelha existente :P
document.addEventListener('keyup', function(e) {
  if (e.key === '+' || e.key === '=') {
    let novaAbelhinha = new Abelhinha(1);
    abelhinhas.push(novaAbelhinha);
  } else if (e.key === '-' || e.key === '_') {
    abelhinha = abelhinhas.pop();
    if (abelhinha) {
      abelhinha.remove();
    }
  }
});

document.body.style.overflowX = 'hidden';
abelhinhas.push(new Abelhinha());
abelhinhas.push(new Abelhinha());
abelhinhas.push(new Abelhinha());

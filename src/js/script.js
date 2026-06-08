const THEME_KEY = 'orbit-theme';

function applyTheme(tema) {
    const root = document.documentElement;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    root.setAttribute('data-theme', tema === 'system' ? (systemDark ? 'dark' : 'light') : tema);

    document.querySelectorAll('.btn-tema').forEach (btn => {
        btn.classList.toggle('active', btn.dataset.themeValue === tema);
    });
}

function initTheme() {
    const saved = localStorage.getItem(THEME_KEY) || 'system';
    applyTheme(saved);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if ((localStorage.getItem(THEME_KEY) || 'system') === 'system') {
            applyTheme('system');
        }
    });

    document.querySelectorAll('.btn-tema').forEach (btn => {
        btn.addEventListener('click', () => {
            const tema = btn.dataset.themeValue;
            localStorage.setItem(THEME_KEY, tema);
            applyTheme(tema);
        });
    });
}

const quizPerguntas = [
    {
        pergunta: 'Qual é o principal objetivo do OrbitAlert?',
        opcoes: [
            'Enviar alertas de desastres naturais a comunidades sem internet ou sinal de celular',
            'Vender equipamentos de telecomunicação para operadoras',
            'Criar redes sociais para áreas rurais',
            'Substituir a Defesa Civil nas grandes cidades'
        ],
        correta: 0
    },
    {
        pergunta: 'Quais tipos de desastres naturais o OrbitAlert monitora?',
        opcoes: [
            'Terremotos e tsunamis', 
            'Enchentes e queimadas', 
            'Furacões e tornados', 
            'Avalanches e erupções vulcânicas'],
        correta: 1
    },
    {
        pergunta: 'O OrbitAlert depende de qual tipo de infraestrutura?',
        opcoes: [
            'Internet banda larga e celular', 
            'Torres de telecomunicação e 5G', 
            'Nenhuma - opera com rádio e energia solar autônoma', 
            'Rede de fibra óptica subterrânea'],
        correta: 2
    },
    {
        pergunta: 'Quem pode instalar o sistema do OrbitAlert em uma comunidade?',
        opcoes: [
            'Apenas engenheiros certificados',
            'Somente técnicos da Defesa Civil',
            'Qualquer professor ou líder comunitário',
            'Exclusivamente funcionários da NASA'
        ],
        correta: 2
    },
    {
        pergunta: 'Qual grupo de público-alvo abriga a unidade receptora como ponto de aviso?',
        opcoes: [
            'Escolas particulares', 
            'Comunidades e postos de saúde', 
            'Aeroportos regionais', 
            'Estações de metrô'],
        correta: 1
    },
    {
        pergunta: 'Qual a distância máxima de comunicação via rádio entre o transmissor e o receptor?',
        opcoes: [
            '5 km', 
            '10 km', 
            '15 km', 
            '30 km'],
        correta: 2
    },
    {
        pergunta: 'Qual o custo estimado para instalar o sistema em uma comunidade?',
        opcoes: [
            'R$ 100', 
            'R$ 340', 
            'R$ 1.000', 
            'R$ 5.000'],
        correta: 1
    },
    {
        pergunta: 'Em quanto tempo o sistema emite alertas físicos e sonoros após detectar um risco?',
        opcoes: [
            'Em até 30 segundos', 
            'Em até 10 segundos', 
            'Em menos de 2 segundos', 
            'Em até 1 minuto'],
        correta: 2
    },
    {
        pergunta: 'Quanto tempo leva para instalar o sistema, segundo o projeto?',
        opcoes: [
            '30 minutos', 
            '2 horas', 
            '1 dia inteiro', 
            'Uma semana'],
        correta: 1
    },
    {
        pergunta: 'Como os dispositivos do OrbitAlert se comunicam entre si?',
        opcoes: [
            'Via rede Wi-Fi local', 
            'Via Bluetooth de longo alcance', 
            'Via comunicação por rádio', 
            'Via conexão por satélite Starlink'],
        correta: 2
    }
];

let quizIndiceAtual = 0;
let quizPontuacao = 0;
let quizRespondida = false;

function quizElementos() {
    return {
        card: document.getElementById('quiz-card'),
        pergunta: document.getElementById('quiz-question'),
        opcoes: document.getElementById('quiz-options'),
        atual: document.getElementById('quiz-current'),
        total: document.getElementById('quiz-total'),
        barra: document.getElementById('quiz-progresso-cheio'),
        feedback: document.getElementById('quiz-feedback'),
        botaoProxima: document.getElementById('quiz-next'),
        resultado: document.getElementById('quiz-resultado'),
        resultadoTitulo: document.getElementById('quiz-resultado-title'),
        resultadoTexto: document.getElementById('quiz-resultado-text'),
        botaoReiniciar: document.getElementById('quiz-restart')
    };
}

function quizRenderizarPergunta() {
    const els = quizElementos();
    const dados = quizPerguntas[quizIndiceAtual];

    quizRespondida = false;
    els.feedback.textContent = '';
    els.botaoProxima.disabled = true;
    els.botaoProxima.textContent = quizIndiceAtual === quizPerguntas.length - 1 ? 'Ver resultado' : 'Próxima';

    els.atual.textContent = quizIndiceAtual + 1;
    els.total.textContent = quizPerguntas.length;
    els.barra.style.width = `${((quizIndiceAtual + 1) / quizPerguntas.length) * 100}%`;

    els.pergunta.textContent = dados.pergunta;
    els.opcoes.innerHTML = '';

    dados.opcoes.forEach((opcao, indice) => {
        const botao = document.createElement('button');
        botao.type = 'button';
        botao.className = 'quiz-option';
        botao.textContent = opcao;
        botao.addEventListener('click', () => quizSelecionarOpcao(indice));
        els.opcoes.appendChild(botao);
    });
}

function quizSelecionarOpcao(indiceEscolhido) {
    if (quizRespondida) return;
    quizRespondida = true;

    const els = quizElementos();
    const dados = quizPerguntas[quizIndiceAtual];
    const botoes = els.opcoes.querySelectorAll('.quiz-option');

    botoes.forEach((botao, indice) => {
        botao.disabled = true;
        if (indice === dados.correta) {
            botao.classList.add('is-correct');
        } else if (indice === indiceEscolhido) {
            botao.classList.add('is-wrong');
        }
    });

    if (indiceEscolhido === dados.correta) {
        quizPontuacao++;
        els.feedback.textContent = 'Resposta correta!';
    } else {
        els.feedback.textContent = 'Resposta incorreta.';
    }

    els.botaoProxima.disabled = false;
}

function quizMostrarResultado() {
    const els = quizElementos();
    const total = quizPerguntas.length;
    const pontuacao = quizPontuacao;

    els.card.hidden = true;
    els.resultado.hidden = false;

    let mensagem;
    if (pontuacao === total) {
        mensagem = 'Perfeito! Você conhece muito bem o OrbitAlert.';
    } else if (pontuacao >= total * 0.7) {
        mensagem = 'Muito bem! Você entende bem o propósito do projeto.';
    } else if (pontuacao >= total * 0.4) {
        mensagem = 'Bom começo! Vale a pena revisitar as seções acima para aprender mais.';
    } else {
        mensagem = 'Que tal explorar novamente as seções do site para conhecer melhor o OrbitAlert?';
    }

    els.resultadoTitulo.textContent = `Você acertou ${pontuacao} de ${total} perguntas`;
    els.resultadoTexto.textContent = mensagem;
}

function quizReiniciar() {
    const els = quizElementos();

    quizIndiceAtual = 0;
    quizPontuacao = 0;
    els.resultado.hidden = true;
    els.card.hidden = false;
    quizRenderizarPergunta();
}

function quizProximaPergunta() {
    if (!quizRespondida) return;

    if (quizIndiceAtual < quizPerguntas.length - 1) {
        quizIndiceAtual++;
        quizRenderizarPergunta();
    } else {
        quizMostrarResultado();
    }
}

function initQuiz() {
    const els = quizElementos();
    if (!els.card) return;

    els.botaoProxima.addEventListener('click', quizProximaPergunta);
    els.botaoReiniciar.addEventListener('click', quizReiniciar);

    quizRenderizarPergunta();
}
function initContatoForm() {
    const form = document.getElementById('contato-form');
    if (!form) return;

    const campos = [
        {
            input: document.getElementById('contato-nome'),
            erro: document.getElementById('erro-nome'),
            mensagem: 'Por favor, informe seu nome.'
        },
        {
            input: document.getElementById('contato-email'),
            erro: document.getElementById('erro-email'),
            mensagem: 'Por favor, informe um e-mail válido.'
        },
        {
            input: document.getElementById('contato-mensagem'),
            erro: document.getElementById('erro-mensagem'),
            mensagem: 'Por favor, escreva sua mensagem.'
        }
    ];

    function validarCampo(campo) {
        const valor = campo.input.value.trim();
        let valido = valor.length > 0;

        if (valido && campo.input.type === 'email') {
            valido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
        }

        campo.input.classList.toggle('invalido', !valido);
        campo.erro.textContent = valido ? '' : campo.mensagem;

        return valido;
    }

    campos.forEach(campo => {
        campo.input.addEventListener('input', () => {
            if (campo.input.classList.contains('invalido')) {
                validarCampo(campo);
            }
        });
    });
    const sucesso = document.getElementById('form-sucesso');

form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    sucesso.hidden = true;

    let formularioValido = true;
    let primeiroInvalido = null;

    campos.forEach(campo => {
        const valido = validarCampo(campo);
        if (!valido) {
            formularioValido = false;
            if (!primeiroInvalido) primeiroInvalido = campo.input;
        }
    });

    if (!formularioValido) {
        primeiroInvalido.focus();
        return;
    }

    sucesso.hidden = false;
    form.reset();
    campos.forEach(campo => campo.input.classList.remove('invalido'));
});
}

document.addEventListener('DOMContentLoaded', initTheme);
document.addEventListener('DOMContentLoaded', initQuiz);
document.addEventListener('DOMContentLoaded', initContatoForm);

const SLIDE_INTERVALO = 5000;

function initSlideshow() {
    const slideshow = document.getElementById('hero-slideshow');
    if (!slideshow) return;

    const slides = slideshow.querySelectorAll('.slide');
    const dots = slideshow.querySelectorAll('.slide-ponto');
    const botaoAnterior = document.getElementById('slide-esq');
    const botaoProximo = document.getElementById('slide-dir');

    let indiceAtual = 0;
    let temporizador = null;

    function irParaSlide(indice) {
        slides[indiceAtual].classList.remove('primeiro');
        dots[indiceAtual].classList.remove('primeiro');

        indiceAtual = (indice + slides.length) % slides.length;

        slides[indiceAtual].classList.add('primeiro');
        dots[indiceAtual].classList.add('primeiro');
    }

    function proximoSlide() {
        irParaSlide(indiceAtual + 1);
    }

    function slideAnterior() {
        irParaSlide(indiceAtual - 1);
    }

    function iniciarAutoplay() {
        pararAutoplay();
        temporizador = setInterval(proximoSlide, SLIDE_INTERVALO);
    }

    function pararAutoplay() {
        if (temporizador) {
            clearInterval(temporizador);
            temporizador = null;
        }
    }

    botaoProximo.addEventListener('click', () => {
        proximoSlide();
        iniciarAutoplay();
    });

    botaoAnterior.addEventListener('click', () => {
        slideAnterior();
        iniciarAutoplay();
    });

    dots.forEach((dot, indice) => {
        dot.addEventListener('click', () => {
            irParaSlide(indice);
            iniciarAutoplay();
        });
   });
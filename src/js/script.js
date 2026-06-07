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
        pergunta: 'Em 2024, quantas pessoas morreram no RS mesmo após 26 alertas terem sido emitidos?',
        opcoes: ['84', '184', '284', '14'],
        correta: 1
    },
    {
        pergunta: 'Segundo o projeto, quantos brasileiros vivem sem cobertura celular?',
        opcoes: ['Mais de 1 milhão', 'Mais de 5 milhões', 'Mais de 14 milhões', 'Mais de 30 milhões'],
        correta: 2
    },
    {
        pergunta: 'Quais APIs de satélites gratuitas o OrbitAlert utiliza para captar dados em tempo real?',
        opcoes: [
            'Google Maps, Waze e OpenStreetMap',
            'NASA FIRMS, INPE e Copernicus',
            'AWS, Azure e Google Cloud',
            'SpaceX, Starlink e OneWeb'
        ],
        correta: 1
    },
    {
        pergunta: 'Em qual linguagem é desenvolvido o backend que processa os dados de satélite?',
        opcoes: ['JavaScript', 'Java', 'Python', 'C++'],
        correta: 2
    },
    {
        pergunta: 'Qual a distância máxima de comunicação via rádio entre o transmissor e o receptor?',
        opcoes: ['5 km', '10 km', '15 km', '30 km'],
        correta: 2
    },
    {
        pergunta: 'Qual o custo estimado para instalar o sistema em uma comunidade?',
        opcoes: ['R$ 100', 'R$ 340', 'R$ 1.000', 'R$ 5.000'],
        correta: 1
    },
    {
        pergunta: 'Em quanto tempo o sistema emite alertas físicos e sonoros após detectar um risco?',
        opcoes: ['Em até 30 segundos', 'Em até 10 segundos', 'Em menos de 2 segundos', 'Em até 1 minuto'],
        correta: 2
    },
    {
        pergunta: 'Quanto tempo leva para instalar o sistema, segundo o projeto?',
        opcoes: ['30 minutos', '2 horas', '1 dia inteiro', 'Uma semana'],
        correta: 1
    },
    {
        pergunta: 'Cerca de quantas pessoas em comunidades indígenas vivem sem sistemas físicos de alerta?',
        opcoes: ['50 mil', '100 mil', '500 mil', '1 milhão'],
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
        barra: document.getElementById('quiz-progress-fill'),
        feedback: document.getElementById('quiz-feedback'),
        botaoProxima: document.getElementById('quiz-next'),
        resultado: document.getElementById('quiz-result'),
        resultadoTitulo: document.getElementById('quiz-result-title'),
        resultadoTexto: document.getElementById('quiz-result-text'),
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

document.addEventListener('DOMContentLoaded', initTheme);
document.addEventListener('DOMContentLoaded', initQuiz);

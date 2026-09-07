/**
 * i18n extension for Index/Dashboard page — Português (pt).
 * Loaded by js/i18n-index.js (loader) for the ACTIVE language only —
 * never referenced directly from HTML. One file per language.
 */
(function () {
    if (typeof CyberI18n === 'undefined') {
        console.error("CyberI18n not found! Load i18n.js before i18n-index-pt.js");
        return;
    }
    const t = (CyberI18n.translations.pt = CyberI18n.translations.pt || {});
    t.index = {
            admin_gate: {
                title: "VERIFICAR AUTORIZAÇÃO",
                pwd_placeholder: "Senha",
                access: "ACESSO",
                cancel: "CANCELAR"
            },
            ui: {
                coffee_title: "Compre um Cyber-Café",
                about_title: "Introdução Cinematográfica — Doc Alvers",
                qr_title: "Código QR desta página",
                sound_title: "Som Ambiente",
                search_placeholder: "INICIAR VERIFICAÇÃO DO LABORATÓRIO...",
                mission_start: "Iniciar Missão",
                all_tools: "Todas as Ferramentas",
                tools_subtitle_word: "Ferramentas",
                tools_filter_hits: "RESULTADOS",
                tools_no_results: "Nenhum resultado para «{query}»",
                search_no_terms: "nada encontrado",
                tools_close_aria: "Fechar a visão de ferramentas e voltar à seleção de laboratórios",
                tools_footer_aria: "Rodapé",
                tools_universe_aria: "Abrir Universe · galeria de laboratórios no espaço",
                tools_doc_title: "Cyber-Laboratório | Mission Control",
                education: "EDUCAÇÃO",
                games: "Jogos",
                lgs: "Sistemas de Equações",
                pythagoras: "Teorema de Pitágoras",
                triangles: "Triângulos",
                arithmetic: "Aritmética Básica",
                hot_stuff: "Destaques",
                neu: "Novo",
                apps: "Apps",
                fun: "Diversão",
                functions: "Funções",
                highlights: "Destaques",
                fraktale: "Fractais",
                university: "Universidade",
                themes_count: "Temas",
                themes_top5_title: "Top Labs",
                grade_title: "Ano",
                grade_uni: "Uni",
                grade_uni_tip: "Universidade · laboratórios particularmente complexos",
                grade_back_tip: "Voltar para a seleção de tema",
                universe_tip: "Universo · Galeria do Laboratório no espaço",
                credits: "CRÉDITOS",
                impressum: "AVISO LEGAL"
            },
            contact: {
                title: "Contato",
                desc: "Você tem perguntas, feedback ou ideias para novos módulos de laboratório? Aguardo todas as mensagens.",
                close: "FECHAR"
            },
            qr: {
                title: "Código QR",
                desc: "Escaneie com seu telefone – leve esta página com você."
            },
            donate: {
                title: "Compre um Cyber-Café",
                desc: "Você gosta dos laboratórios interativos e quer apoiar o desenvolvimento do Cyber-Laboratório? Agradeço cada café virtual que me mantém acordado enquanto codifico à noite! ☕️🚀",
                paypal: "DOE AGORA COM PayPal"
            },
            header: {
                title: "Doc Alvers Mathe-Labor",
                subtitle: "O UNIVERSO INTERATIVO DA MATEMÁTICA",
                author: "GOOD VIBES por Dr. Michael R. Alvers"
            },
            view: {
                back_title: "Voltar",
                title: "VISÃO DO LAB"
            },
            admin: {
                active: "MODO EDITORIAL ATIVO",
                export: "Exportar Alterações",
                exit: "Sair"
            },
            labs: {
                "fourier": { title: "Transformada de Fourier", description: "A música da matemática. Decomponha formas complexas em oscilações." },
                "mandelbrot-deep": { title: "Fractais", description: "Conjuntos de Mandelbrot e Julia no plano complexo: dinâmica de tempo de escape de z↦z²+c por iteração em shader de fragmentos na GPU; exploração paramétrica de c com profundidade adaptativa na fronteira fractal." },
                "atomorbitale": { title: "Orbitais Atômicos", description: "Harmônicos esféricos Y_ℓ^m em 3D." },
                "galtonboard": { title: "Tábua de Galton", description: "Simulação interativa da distribuição normal." },
                "opti-lens": { title: "Otimização de Lentes", description: "Otimização evolutiva de lentes (CMA-ES)." },
                "addition": { title: "Adição Escrita", description: "Aprenda adição escrita passo a passo." },
                "subtraktion": { title: "Subtração Escrita", description: "Treine subtração escrita passo a passo." },
                "multiplikation": { title: "Multiplicação Escrita", description: "Visualiza multiplicação escrita passo a passo." },
                "dividieren": { title: "Divisão Escrita", description: "Domine a divisão escrita com o laboratório." },
                "cmaes": { title: "Otimização de Superfície", description: "CMA-ES em tempo real: melhoria de polígonos." },
                "transformationen": { title: "Congruência", description: "Explore rotação, translação e escalonamento." },
                "winkelsumme3d": { title: "Soma de Ângulos 3D", description: "Experimente a soma de ângulos no espaço 3D." },
                "ausgleichsgerade": { title: "Linha de Melhor Ajuste", description: "Encontre a melhor linha através de uma nuvem de pontos." },
                "binomischeslabor": { title: "1ª Fórmula Binomial", description: "Visualize fórmulas binomiais geometricamente." },
                "triangulierer": { title: "Delaunay", description: "Algoritmos de triangulação." },
                "differentiallabor": { title: "Lab. Diferencial", description: "Domine o cálculo diferencial." },
                "parabellabor": { title: "Parábolas", description: "Manipulação de funções quadráticas." },
                "potenzlabor": { title: "Lab. de Potências", description: "Explore o comportamento de potências e raízes." },
                "steigung": { title: "Lab. de Inclinação", description: "Entenda a inclinação em qualquer ponto." },
                "winkellabor": { title: "Lab. de Ângulos", description: "Investigação interativa de ângulos." },
                "uhrzeitwinkel": { title: "Lab. Relógio", description: "Examine o ângulo entre os ponteiros do relógio." },
                "logikspiel": { title: "Quebra-cabeça de Números", description: "Torne-se um mestre da matriz! Resolve grades complexas." },
                "integralreaktor": { title: "Integrais", description: "A energia da área. Visualize somas de Riemann." },
                "lissajous": { title: "Lissajous", description: "Superposição de duas oscilações harmônicas." },
                "cool-squares": { title: "Quadrados Legais", description: "A prova geométrica definitiva. Siga a espiral de quadrados." },
                "fibonacci": { title: "Lab. Fibonacci", description: "Explore a espiral áurea e padrões de crescimento." },
                "fermatpunkt": { title: "Ponto de Fermat", description: "Encontre o ponto com a soma mínima de distâncias aos vértices." },
                "gleichungssysteme": { title: "Lab. de Sistemas Lineares", description: "Explore sistemas lineares de equações visualmente através de linhas." },
                "pythagoras": { title: "Pitágoras", description: "Descubra o teorema de Pitágoras por meio de comparações interativas de áreas." },
                "pythagorasbeweis": { title: "Prova de Pitágoras", description: "Prova geométrica do teorema de Pitágoras por decomposição de área." },
                "gleichschenkligesDreieck": { title: "Triângulo Isósceles", description: "Calcule triângulos especiais e suas propriedades de forma interativa." },
                "eulergerade": { title: "Euler, Feuerbach e Napoleão", description: "A fascinante geometria do triângulo." },
                "easyhard": { title: "Quebra-cabeça de Geometria", description: "Um enigma geométrico desafiador. Determine o ângulo que falta." },
                "winkelsumme": { title: "Lab. de Polígonos", description: "Calcule a soma dos ângulos em qualquer polígono." },
                "beweisinwinkellsumme": { title: "Prova de Ângulo Interno", description: "Por que a soma dos ângulos de um triângulo é sempre 180°? A prova passo a passo." },
                "butterfly": { title: "Curva da Borboleta", description: "Uma fascinante curva definida por coordenadas polares." },
                "heart3d": { title: "Coração 3D", description: "Visualização de uma superfície 3D." },
                "litchi3d": { title: "Lichia 3D", description: "Explore matemática complexa interativamente." },
                "cinematic-intro": { title: "Introdução Cinematográfica", description: "Experimente o início monumental. ULTRA v5.3.8." },
                "stanford-portal": { title: "Universidade de Stanford", description: "Universidade de pesquisa de elite no Vale do Silício." },
                "happy-birthday-ulf": { title: "Feliz Aniversário Ulf!", description: "Uma surpresa matemática de aniversário." }
            ,
                "einsundeins": { title: "1 + 1 = 2", description: "Uma única conta, quatro níveis abaixo: linguagem de alto nível, assembler, bytes de máquina e um somador completo feito de portas lógicas. A mesma informação em cada nível, apenas uma abstração mais fundo." },
                "solita": { title: "Solita", description: "Solita — a tua assistente de voz pessoal (Claude) no Laboratório de Matemática do Doc Alvers. Falar, ouvir leituras em voz alta, manter o contexto." },
                "gameoflife": { title: "Game of Life", description: "O autómato celular de Conway: de três regras simples surgem planadores, osciladores e mundos inteiros. Desenha um padrão inicial e observa a ordem e o caos a alternar." },
                "burningship": { title: "Burning Ship", description: "O fractal irmão escuro do conjunto de Mandelbrot: um único valor absoluto na fórmula de iteração faz aparecer navios em chamas no horizonte. Amplia a estrutura flamejante." },
                "reaction-diffusion": { title: "Reação-Difusão", description: "Padrões de Turing ao vivo: duas substâncias reagem e difundem-se, e saem listas, pontos e corais como nas pelagens dos animais. Ajusta a alimentação e o decaimento e cultiva os teus próprios padrões." },
                "gravitation": { title: "Gravitação", description: "A lei da gravitação de Newton para tocar: coloca massas no espaço, dá-lhes uma velocidade inicial e observa órbitas, capturas e colisões na dança de muitos corpos." },
                "glocken": { title: "Os sinos de Bagdade", description: "Quando é que todos os sinos tocam ao mesmo tempo? Uma história de Bagdade leva ao mínimo comum múltiplo, com um tutor que acompanha passo a passo até ao m.m.c. e às frações." },
                "langley": { title: "Laboratório Langley", description: "O famoso problema do ângulo de Langley de 1922: um triângulo isósceles, duas linhas interiores e um ângulo que incomoda o mundo há cem anos. Mede, experimenta, demonstra." },
                "batman": { title: "Curva de Batman", description: "Uma única equação cujo gráfico desenha o logótipo do Batman: valores absolutos, raízes e distinções de casos como matemática de super-heróis. Desmonta a fórmula peça por peça." },
                "worldclock": { title: "Relógio mundial", description: "A Terra como relógio: fusos horários, posição do Sol e linha dia-noite ao vivo no mapa-múndi. Vê onde o sol nasce enquanto aqui é meia-noite." },
                "tracker": { title: "Doc Alvers Tracker", description: "Registo de GPS como aplicação web: grava percursos com perfil de altitude, pontos de foto, voz e conhecimento, radar de chuva e partilha ao vivo. Funciona no navegador e como aplicação Android." },
                "kaimbo": { title: "Kaimbo Studio", description: "Aprender línguas com as tuas próprias listas de tarefas: organizar, filtrar e treinar vocabulário e frases como séries de tarefas. O estúdio da ferramenta de línguas do Doc, agora no navegador." },
                "pagode": { title: "Pagode (230 SL)", description: "Um Mercedes 230 SL de 1964 encontra o Bluetooth: arrancar o motor por rádio, testar canais, explorar um esquema elétrico interativo, e a Solita aprende a conduzir. Eletricidade clássica com comando à distância por IA." },
                "voicerecorder": { title: "Gravador de voz", description: "Gravar e transcrever ao vivo: fala e ele ouve, escreve e guarda. No navegador através da Web Speech API, como aplicação Android com reconhecimento de voz nativo." },
                "mathtrainer": { title: "MathTrainer", description: "Treinar matemática com séries de exercícios: cálculo mental e exercícios escolares, escolher uma série, aumentar o ritmo. School is cool: o SchoolTrainer como aplicação web." },
                "pinkerfinder": { title: "PinkerFinder", description: "O Finder do macOS recriado 1:1 — mais facetas de pesquisa: tamanhos de pastas na lista, duplicados por conteúdo, pesquisa por facetas em todo o Mac, atualização ao vivo. App nativa para Mac, download gratuito." },
                "imaginarynumbers": { title: "Números imaginários", description: "Números complexos no plano de Gauss: parte real, parte imaginária e a unidade imaginária, para explorar de forma interativa." },
                "kovarianz": { title: "Covariância", description: "Uma aplicação linear A estica, roda e distorce o plano. Aplicada a uma nuvem de pontos redonda, transforma-a numa elipse — e é justamente a sua forma que está na matriz de covariância: de Σ₀ = σ²E resulta Σ = A Σ₀ Aᵀ. Ajusta a matriz célula a célula ou arrasta a elipse imagem pela pega; Σ, a correlação e os vetores próprios como eixos principais são calculados ao vivo a partir dos pontos desenhados. Com distribuição normal e uniforme, coordenadas homogéneas e paralelas que mostram o que a aplicação faz às retas." },
                "irisvis": { title: "Conway's Iris", description: "Prolonga em cada vértice os dois lados pelo comprimento do lado oposto — os seis extremos ficam sobre uma circunferência centrada no incentro, R = √(r²+(s+d)²). Seis arcos tipo limpa-para-brisas formam com eles uma curva de largura constante; um quadrado envolve-a em qualquer rotação e o CMA-ES procura a sua posição ao vivo. Com vistas de demonstração, mapa de calor da paisagem de busca e o triângulo de Reuleaux à distância de um botão." },
                "ascii": { title: "Arte ASCII", description: "Imagens são números: divide em células uma foto, a imagem ao vivo da câmara ou um exemplo, calcula o valor de cinzento e escolhe o caractere — como caracteres, a cores, em meio-tom ou em braille, com dithering. Um clique num caractere mostra todo o cálculo dessa célula; no nível 2 os alunos escrevem eles próprios a correspondência valor de cinzento → caractere." },
                "neuroaddierer": { title: "O somador aprendido", description: "No lab 1 + 1 = 2 os somadores completos estão cablados — aqui não há cablagem nenhuma. Uma minúscula rede neuronal de 32 números só vê as oito linhas da tabela de verdade e tem de descobrir sozinha como somar: por evolução (CMA-ES), sem qualquer derivada. Depois oito cópias da rede aprendida calculam em série todas as somas até 255 — e vê-se que as suas saídas nunca são exatamente 0 ou 1, mas 0,03 e 0,97." },
                "shell": { title: "Shell", description: "Como surge o padrão de uma concha marinha? Seis capítulos constroem o mecanismo peça por peça: a imagem é um registo — uma célula acende e escreve um V — duas ondas aniquilam-se e cortam a ponta de uma tenda — o substrato consumido explica porquê. Em cima vive o bordo da abertura, por baixo cresce a concha. Com botão passo a passo." },
                "conuslab": { title: "Conus", description: "Porque é que um cone traz ziguezagues e tendas? A concha só cresce no bordo da abertura — uma única fila de células decide «pigmento sim/não», e cada linha de crescimento fica para sempre. O padrão é, portanto, um diagrama espaço-tempo. Aqui corre ao vivo: ondas de pigmento que viajam, se anulam ao colidir e assim recortam as tendas — ao lado, o mesmo efeito como autómato celular (regra 30)." },
                "costablanca": { title: "Destaques da Costa Blanca", description: "Passeios pela Costa Blanca para ir riscando: 22 destinos pesquisados de Altea a Valência com fotos, dicas de quem lá vive e barra de progresso — em quatro línguas (DE/EN/ES/IT)." },
                "bb84": { title: "BB84", description: "Troca quântica de chaves segundo Bennett e Brassard: a Alice envia fotões individuais, cada um numa de duas bases — + com os estados — e |, ou × com / e \\. O Bob escolhe a sua base ao acaso: a mesma base dá um resultado seguro, outra base dá puro acaso. Passar sobre uma coluna explica exatamente esse fotão. Com a espia Eve a taxa de erro na parte comparada publicamente sobe para um quarto — a probabilidade de deteção é 1 − (3/4)^m, e mil execuções à distância de um botão mostram que é mesmo assim. E ainda um modo de ensino que percorre todos os casos uma vez." },
                "jacquard": { title: "Jacquard", description: "Um tear de 1805, em 3D — a primeira máquina que produz uma imagem a partir de um plano escrito. Um cartão perfurado comanda cada fio de urdidura separadamente: onde há um furo, a agulha passa, o gancho fica parado e a faca levanta o fio; onde há cartão, o fio fica em baixo e a trama azul cobre-o. Cartão a cartão, a imagem sai da máquina. Motivo e máquina são coisas diferentes: o mesmo círculo sai mais redondo com mais fios, e onde o desenho é mais fino do que o tecido, o tear tece um padrão que não existe no original." },
                "koerper": { title: "Sólidos", description: "Sólidos platónicos, arquimedianos e de Catalan, prismas, antiprismas, pirâmides e formas redondas — rotativos em 3D, com área, volume, raios das esferas circunscrita, tangente às arestas e inscrita, ângulos diedros e fórmulas ao vivo em função da aresta. Cada sólido desdobra-se na sua planificação com um cursor; os sólidos de Catalan surgem como duais dos arquimedianos por polaridade em relação à esfera tangente às arestas." },
                "kreisteilung": { title: "Divisão do círculo", description: "n pontos numa circunferência, todas as cordas traçadas: em quantas regiões o disco se divide? 1, 2, 4, 8, 16 … e depois 31, não 32. O laboratório não conta com uma fórmula, mas percorre o grafo real de arcos e pedaços de corda. Por isso mostra também o caso degenerado: o hexágono regular dá apenas 30 regiões, porque três diagonais se encontram no centro. Arraste um ponto pela circunferência e a contagem salta de 30 para 31." },
                "brahmagupta": { title: "Teorema de Brahmagupta", description: "Um quadrilátero cíclico cujas diagonais são perpendiculares — e duas afirmações a seu respeito, ambas de Brahmagupta (século VII, Índia). O teorema: a partir do ponto de encontro P das diagonais traça-se a perpendicular a um lado e prolonga-se para além de P; ela encontra o lado oposto exactamente no seu ponto médio — porque P forma com os dois extremos um triângulo rectângulo e o pé da perpendicular é o seu circuncentro. A fórmula: K = √((s−a)(s−b)(s−c)(s−d)) dá a área, mas só enquanto os quatro vértices estiverem sobre a circunferência. Se os afastarmos dela, K sai demasiado grande — a fórmula de Herão para quadriláteros, com uma condição." }
            }
    };
})();

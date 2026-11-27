/* kapitel.js — the chapters of the Portuguese edition (Portugal) of "Mathematik · Gymnasium 11 · Leistungskurs"
 * (buch/mathegy11lk/), in the order of the school year (Stoffverteilungsplan of the Leistungskurs 11, 5 Ustd./week: LB 1 with
 * LB 2 before the conditions part, Wahlbereich 2 at the end of 11/I, then LB 3 → LB 4). The numbers follow the Lehrplan,
 * so chapter 2 comes between 1.4 and 1.5. Book pt-22 (27.11.2026). Terms as in tools/buch-pt/glossario.md. Single source
 * for the table of contents (index.html) and the previous/next cards at the end of every chapter. No print edition yet
 * (druck: false).
 */
window.BUCH = {
    title: 'Matemática · Gymnasium 11 · Leistungskurs',
    short: 'Matemática GY 11 LK',
    lang: 'pt',
    druck: false,
    description: 'Manual interativo de Matemática para o Gymnasium (escola secundária alemã de ensino geral), 11.º ano, Leistungskurs (curso de nível avançado), Saxónia: limites e continuidade, derivada por definição e aproximação linear, regras de derivação com demonstração, propriedades das funções, matrizes com rotações e processos de produção, funções a partir de condições, otimização e regressão, métodos numéricos até ao teorema do ponto fixo, vetores, retas e planos em todas as posições relativas, conceito de probabilidade, teorema de Bayes e distribuição binomial, com laboratórios, simulações e autoavaliações com resposta imediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizagem 1', k: '1.1', title: 'Limites e continuidade',
          sub: 'Comportamento no infinito, limite num ponto, teoremas sobre limites, funções definidas por ramos, continuidade', when: 'Agosto · Setembro', ustd: 15 },
        { file: 'lb1-2.html', lb: 'Área de aprendizagem 1', k: '1.2', title: 'Taxas de variação e conceito de derivada',
          sub: 'Aproximação linear, taxa média e taxa instantânea de variação, derivada por definição, derivabilidade', when: 'Setembro', ustd: 10 },
        { file: 'lb1-3.html', lb: 'Área de aprendizagem 1', k: '1.3', title: 'Regras de derivação',
          sub: 'Regras com demonstração, eˣ, ln x e sen x, regras do produto e da cadeia, inverter a derivação', when: 'Outubro', ustd: 15 },
        { file: 'lb1-4.html', lb: 'Área de aprendizagem 1', k: '1.4', title: 'Estudo de funções',
          sub: 'Monotonia, extremos, concavidade e pontos de inflexão, simetria, polos, assíntotas oblíquas', when: 'Novembro', ustd: 14 },
        { file: 'lb2.html', lb: 'Área de aprendizagem 2', k: '2', title: 'Matrizes',
          sub: 'Ax = b, produto de matrizes compatíveis, método de Gauss-Jordan, rotações, processos de produção', when: 'Novembro · Dezembro', ustd: 6 },
        { file: 'lb1-5.html', lb: 'Área de aprendizagem 1', k: '1.5', title: 'Funções a partir de condições, otimização, regressão',
          sub: 'Funções a partir de condições, problemas de otimização, equações de funções por regressão', when: 'Dezembro', ustd: 12 },
        { file: 'wb2.html', lb: 'Área opcional 2', k: 'W', title: 'Métodos numéricos',
          sub: 'Resolução gráfica, bissecção, método de Newton, iteração do ponto fixo, teorema de Banach', when: 'Janeiro', ustd: 10 },
        { file: 'lb3-1.html', lb: 'Área de aprendizagem 3', k: '3.1', title: 'Espaço e vetores',
          sub: 'Referencial no espaço, outros sistemas de coordenadas, cálculo com vetores, propriedades das operações', when: 'Fevereiro · Março', ustd: 10 },
        { file: 'lb3-2.html', lb: 'Área de aprendizagem 3', k: '3.2', title: 'Dependência linear e retas',
          sub: 'Dependência e independência linear, retas na forma vetorial, posição relativa de duas retas', when: 'Março', ustd: 10 },
        { file: 'lb3-3.html', lb: 'Área de aprendizagem 3', k: '3.3', title: 'Planos e posições relativas',
          sub: 'Equação vetorial e equação cartesiana, reta e plano, plano e plano, reta de interseção', when: 'Março · Abril', ustd: 12 },
        { file: 'lb4-1.html', lb: 'Área de aprendizagem 4', k: '4.1', title: 'Probabilidade e contagem',
          sub: 'Frequencista, Laplace, Kolmogorov, simulação, modelo da urna, regras do produto e da soma, tabela de dupla entrada, métodos de contagem', when: 'Abril · Maio', ustd: 13 },
        { file: 'lb4-2.html', lb: 'Área de aprendizagem 4', k: '4.2', title: 'Probabilidade condicionada e Bayes',
          sub: 'Probabilidade condicionada, teorema de Bayes na árvore e na tabela de dupla entrada, independência', when: 'Maio', ustd: 8 },
        { file: 'lb4-3.html', lb: 'Área de aprendizagem 4', k: '4.3', title: 'A distribuição binomial',
          sub: 'Provas de Bernoulli, dedução da fórmula, símbolo de somatório, valor médio, variância, modelação', when: 'Maio · Junho', ustd: 11 }
    ]
};

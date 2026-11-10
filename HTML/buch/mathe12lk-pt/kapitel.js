/* kapitel.js — the chapters of the Portuguese edition (Portugal) of "Mathematik · Berufliches Gymnasium 12 · Leistungskurs"
 * (buch/mathe12lk/), in the order of the school year (Lehrplan Berufliches Gymnasium Mathematik, Sachsen, 2026, Leistungskurs:
 * LB 1 → LB 2 → LB 6 in Jahrgangsstufe 12). Book pt-4 (10.11.2026), the sibling of mathe12-pt. Terms as in
 * tools/buch-pt/glossario.md. Single source for the table of contents (index.html) and the previous/next cards at the end of
 * every chapter. No print edition yet (druck: false).
 */
window.BUCH = {
    title: 'Matemática · Berufliches Gymnasium 12 · Leistungskurs',
    short: 'Matemática 12 LK',
    lang: 'pt',
    druck: false,
    description: 'Manual interativo de Matemática para o Berufliches Gymnasium (escola secundária alemã de orientação profissional), 12.º ano, Leistungskurs (curso de nível avançado), Saxónia: variáveis aleatórias discretas com função de distribuição e distribuição binomial, cálculo diferencial dos limites e da continuidade às regras do produto e da cadeia, à regressão e aos problemas de otimização, geometria vetorial no espaço, com demonstrações, laboratórios, gráficos 3D e autoavaliações com resposta imediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizagem 1', k: '1.1', title: 'Probabilidade condicionada',
          sub: 'Diagramas em árvore, tabelas de dupla entrada, teorema de Bayes, independência', when: 'Agosto · Setembro', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Área de aprendizagem 1', k: '1.2', title: 'Variáveis aleatórias',
          sub: 'Função de probabilidade e função de distribuição, valor médio, variância', when: 'Setembro · Outubro', ustd: 12 },
        { file: 'lb1-3.html', lb: 'Área de aprendizagem 1', k: '1.3', title: 'A distribuição binomial',
          sub: 'Provas de Bernoulli, símbolo de somatório, determinar n e p, parâmetros', when: 'Outubro · Novembro', ustd: 20 },
        { file: 'lb2-1.html', lb: 'Área de aprendizagem 2', k: '2.1', title: 'Limites e continuidade',
          sub: 'Comportamento no infinito, limite num ponto, pontos de descontinuidade', when: 'Novembro · Dezembro', ustd: 10 },
        { file: 'lb2-2.html', lb: 'Área de aprendizagem 2', k: '2.2', title: 'A derivada',
          sub: 'Taxas de variação, derivada num ponto, aproximação linear', when: 'Dezembro · Janeiro', ustd: 12 },
        { file: 'lb2-3.html', lb: 'Área de aprendizagem 2', k: '2.3', title: 'Regras de derivação',
          sub: 'Regras da potência, do fator constante e da soma, eˣ, ln x, sen x, cos x', when: 'Janeiro', ustd: 12 },
        { file: 'lb2-4.html', lb: 'Área de aprendizagem 2', k: '2.4', title: 'Regra do produto e regra da cadeia',
          sub: 'Derivar produtos e funções compostas, raízes e funções exponenciais', when: 'Fevereiro', ustd: 12 },
        { file: 'lb2-5.html', lb: 'Área de aprendizagem 2', k: '2.5', title: 'Monotonia, extremos, pontos de inflexão',
          sub: 'Condições necessárias e suficientes, extremos absolutos', when: 'Fevereiro · Março', ustd: 14 },
        { file: 'lb2-6.html', lb: 'Área de aprendizagem 2', k: '2.6', title: 'Estudo de gráficos',
          sub: 'Simetria, assíntotas, retas tangentes e normais, problemas em contexto', when: 'Março · Abril', ustd: 14 },
        { file: 'lb2-7.html', lb: 'Área de aprendizagem 2', k: '2.7', title: 'Funções a partir de condições e regressão',
          sub: 'Determinar funções a partir de condições, modelos de regressão com calculadora', when: 'Abril', ustd: 9 },
        { file: 'lb2-8.html', lb: 'Área de aprendizagem 2', k: '2.8', title: 'Problemas de otimização',
          sub: 'Modelar, extremos na fronteira, análise de casos', when: 'Maio', ustd: 12 },
        { file: 'lb6-1.html', lb: 'Área de aprendizagem 6', k: '6.1', title: 'Vetores no espaço',
          sub: 'Vetores posição e vetores definidos por dois pontos, combinação linear, baricentros', when: 'Maio · Junho', ustd: 12 },
        { file: 'lb6-2.html', lb: 'Área de aprendizagem 6', k: '6.2', title: 'Produto escalar e ângulos',
          sub: 'Perpendicularidade, ângulos, verificações e demonstrações com vetores', when: 'Junho · Julho', ustd: 8 }
    ]
};

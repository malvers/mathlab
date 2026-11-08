/* kapitel.js — the chapters of the Portuguese edition (Portugal) of "Mathematik · Berufliches Gymnasium 12" (buch/mathe12/),
 * in the order of the school year (Stoffverteilungsplan svp/mathe/mathe12.html: LB 1 → LB 2 → LB 5; Grundkurs, Kurshalbjahre
 * 12/I and 12/II). Book pt-2 (08.11.2026), the sibling of mathe11-pt. Terms as in tools/buch-pt/glossario.md. Single source
 * for the table of contents (index.html) and the previous/next cards at the end of every chapter. No print edition yet
 * (druck: false).
 */
window.BUCH = {
    title: 'Matemática · Berufliches Gymnasium 12',
    short: 'Matemática 12',
    lang: 'pt',
    druck: false,
    description: 'Manual interativo de Matemática para o Berufliches Gymnasium (escola secundária alemã de orientação profissional), 12.º ano, Saxónia: variáveis aleatórias discretas e distribuição binomial, cálculo diferencial dos limites aos problemas de otimização e geometria vetorial no espaço, com laboratórios, simulações, gráficos 3D e autoavaliações com resposta imediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizagem 1', k: '1.1', title: 'Probabilidade condicionada',
          sub: 'Diagramas em árvore, tabelas de dupla entrada, acontecimentos independentes', when: 'Agosto · Setembro', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Área de aprendizagem 1', k: '1.2', title: 'Variáveis aleatórias',
          sub: 'Distribuição de probabilidades, valor médio, variância, jogos equitativos', when: 'Setembro', ustd: 12 },
        { file: 'lb1-3.html', lb: 'Área de aprendizagem 1', k: '1.3', title: 'A distribuição binomial',
          sub: 'Provas de Bernoulli, coeficiente binomial, probabilidades acumuladas', when: 'Outubro · Novembro', ustd: 20 },
        { file: 'lb2-1.html', lb: 'Área de aprendizagem 2', k: '2.1', title: 'Limites',
          sub: 'Comportamento no infinito, assíntotas, continuidade', when: 'Novembro · Dezembro', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Área de aprendizagem 2', k: '2.2', title: 'A derivada',
          sub: 'Taxas de variação, da secante à tangente, derivação gráfica', when: 'Dezembro', ustd: 8 },
        { file: 'lb2-3.html', lb: 'Área de aprendizagem 2', k: '2.3', title: 'Regras de derivação',
          sub: 'Regras da potência, da soma e do fator constante, eˣ e sen x, produtos simples', when: 'Janeiro', ustd: 12 },
        { file: 'lb2-4.html', lb: 'Área de aprendizagem 2', k: '2.4', title: 'Monotonia, extremos, pontos de inflexão',
          sub: 'O que f′ e f″ revelam sobre o gráfico', when: 'Janeiro · Março', ustd: 12 },
        { file: 'lb2-5.html', lb: 'Área de aprendizagem 2', k: '2.5', title: 'Estudo de gráficos',
          sub: 'Simetria, assíntotas, retas tangentes e normais, funções em contexto', when: 'Março', ustd: 12 },
        { file: 'lb2-6.html', lb: 'Área de aprendizagem 2', k: '2.6', title: 'Funções a partir de condições e problemas de otimização',
          sub: 'Determinar funções a partir de condições, encontrar o melhor', when: 'Abril · Maio', ustd: 20 },
        { file: 'lb5-1.html', lb: 'Área de aprendizagem 5', k: '5.1', title: 'Vetores no espaço',
          sub: 'Pontos e vetores, operações com vetores, norma, ponto médio', when: 'Maio · Junho', ustd: 12 },
        { file: 'lb5-2.html', lb: 'Área de aprendizagem 5', k: '5.2', title: 'Produto escalar e ângulos',
          sub: 'Perpendicularidade, ângulo de dois vetores, demonstrações em quadriláteros', when: 'Junho · Julho', ustd: 8 }
    ]
};

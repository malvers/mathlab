/* kapitel.js — the chapters of the Portuguese edition (Portugal) of "Mathematik · Gymnasium 8" (buch/mathegy8/), in the
 * order of the school year (Stoffverteilungsplan svp/mathe/mathegy8.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich 3;
 * 4 Ustd./week, 104 + 8 Ustd.). Doc, 27.11.2026 (block pt-12). Terms as in tools/buch-pt/glossario.md, section mathegy8-pt.
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition yet (druck: false).
 */
window.BUCH = {
    title: 'Matemática · Gymnasium 8',
    short: 'Matemática GY 8',
    lang: 'pt',
    druck: false,
    description: 'Manual interativo de Matemática para o Gymnasium (escola alemã que conduz ao Abitur), 8.º ano, Saxónia: expressões e árvores de cálculo, casos notáveis, equações e inequações, experiências aleatórias, probabilidade e diagramas em árvore, funções e funções afins, sistemas de equações lineares, homotetia e semelhança, estratégias heurísticas e simulação com números aleatórios, com laboratórios, simulações e autoavaliações com resposta imediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizagem 1', k: '1.1', title: 'Variáveis e expressões',
          sub: 'Nome, valor e significado, árvores de cálculo, reduzir termos semelhantes, desenvolver, pôr em evidência', when: 'Agosto · Setembro', ustd: 12 },
        { file: 'lb1-2.html', lb: 'Área de aprendizagem 1', k: '1.2', title: 'Casos notáveis e equações',
          sub: 'Os três casos notáveis, equações do 1.º grau, CAS, inequações', when: 'Setembro', ustd: 12 },
        { file: 'lb2-1.html', lb: 'Área de aprendizagem 2', k: '2.1', title: 'Experiências aleatórias e probabilidade',
          sub: 'Resultados e acontecimentos, diagramas de Venn, frequência relativa, experiências de Laplace', when: 'Novembro', ustd: 16 },
        { file: 'lb2-2.html', lb: 'Área de aprendizagem 2', k: '2.2', title: 'Experiências aleatórias compostas e contagem',
          sub: 'Modelo da urna, diagrama em árvore, regras do produto e da soma, princípio fundamental da contagem, simulação', when: 'Dezembro', ustd: 8 },
        { file: 'lb3-1.html', lb: 'Área de aprendizagem 3', k: '3.1', title: 'Funções e as suas propriedades',
          sub: 'Correspondências unívocas, formas de representação, domínio e contradomínio, monotonia, extremos, simetria', when: 'Janeiro', ustd: 8 },
        { file: 'lb3-2.html', lb: 'Área de aprendizagem 3', k: '3.2', title: 'Funções afins',
          sub: 'Declive e taxa de variação, zeros, equações da reta, regressão linear', when: 'Janeiro · Fevereiro', ustd: 12 },
        { file: 'lb3-3.html', lb: 'Área de aprendizagem 3', k: '3.3', title: 'Sistemas de equações lineares',
          sub: 'Resolução gráfica e algébrica, número de soluções, modelação', when: 'Março', ustd: 12 },
        { file: 'lb4-1.html', lb: 'Área de aprendizagem 4', k: '4.1', title: 'Homotetia',
          sub: 'Centro e razão da homotetia, construção, conservação dos ângulos, razões entre segmentos', when: 'Abril', ustd: 8 },
        { file: 'lb4-2.html', lb: 'Área de aprendizagem 4', k: '4.2', title: 'Semelhança',
          sub: 'Critério AA de semelhança, figuras auxiliares, medir alturas, comprimentos, áreas e volumes', when: 'Abril · Maio', ustd: 12 },
        { file: 'lb5.html', lb: 'Área de aprendizagem 5', k: '5', title: 'Estratégias heurísticas',
          sub: 'Trabalhar para a frente e para trás, planos de resolução, apresentar resoluções', when: 'Maio', ustd: 4 },
        { file: 'wb.html', lb: 'Área opcional', k: 'O', title: 'Simulação com números aleatórios',
          sub: 'Números aleatórios, método de Monte Carlo, problema de Monty Hall, cromos', when: 'Maio · Junho', ustd: 8 }
    ]
};

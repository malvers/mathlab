/* kapitel.js — the chapters of the Portuguese edition (Portugal) of "Mathematik · Gymnasium 6" (buch/mathegy6/), in the
 * order of the school year (Stoffverteilungsplan svp/mathe/mathegy6.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich 3;
 * 4 Ustd./week, 104 + 8 Ustd.). Doc, 22.11.2026 (block pt-10). Terms as in tools/buch-pt/glossario.md, section mathegy6-pt.
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition yet (druck: false).
 */
window.BUCH = {
    title: 'Matemática · Gymnasium 6',
    short: 'Matemática GY 6',
    lang: 'pt',
    druck: false,
    description: 'Manual interativo de Matemática para o Gymnasium (escola alemã que conduz ao Abitur), 6.º ano, Saxónia: frações, números decimais e percentagens, operações com frações, equações e problemas, correspondências e regra de três simples, triângulos e quadriláteros com a soma dos ângulos, igualdade de triângulos e área, prismas, partes de um todo e números primos, com laboratórios, simulações e autoavaliações com resposta imediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizagem 1', k: '1.1', title: 'Frações, números decimais e percentagens',
          sub: 'Três formas de escrever um número, dízimas finitas e infinitas periódicas, conjuntos e conjuntos numéricos', when: 'Agosto · Setembro', ustd: 12 },
        { file: 'lb1-2.html', lb: 'Área de aprendizagem 1', k: '1.2', title: 'Operações com frações e números decimais',
          sub: 'Adicionar, subtrair, multiplicar e dividir frações e números decimais', when: 'Setembro', ustd: 12 },
        { file: 'lb1-3.html', lb: 'Área de aprendizagem 1', k: '1.3', title: 'Propriedades das operações, equações e problemas',
          sub: 'Prioridade das operações e cálculo mental, resolver equações e inequações por raciocínio, problemas com um plano', when: 'Outubro · Novembro', ustd: 10 },
        { file: 'lb2-1.html', lb: 'Área de aprendizagem 2', k: '2.1', title: 'Correspondências',
          sub: 'Não unívocas, unívocas, biunívocas, tabela, gráfico e equação, frequências absolutas e relativas', when: 'Novembro · Dezembro', ustd: 12 },
        { file: 'lb2-2.html', lb: 'Área de aprendizagem 2', k: '2.2', title: 'Proporcionalidade',
          sub: 'Proporcionalidade direta e inversa, quociente constante e produto constante, gráficos, regra de três simples', when: 'Dezembro · Janeiro', ustd: 12 },
        { file: 'lb3-1.html', lb: 'Área de aprendizagem 3', k: '3.1', title: 'Soma dos ângulos e igualdade de triângulos',
          sub: 'Soma dos ângulos internos de um triângulo com demonstração, definição e teorema, critérios de igualdade, construção de triângulos', when: 'Janeiro · Fevereiro', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Área de aprendizagem 3', k: '3.2', title: 'Teoremas e retas notáveis do triângulo',
          sub: 'Ângulos da base, lados e ângulos, desigualdade triangular, mediatrizes, bissetrizes, alturas, medianas', when: 'Março', ustd: 8 },
        { file: 'lb3-3.html', lb: 'Área de aprendizagem 3', k: '3.3', title: 'A área e a casa dos quadriláteros',
          sub: 'Paralelogramo, triângulo, trapézio e papagaio, figuras compostas, classificar quadriláteros', when: 'Março · Abril', ustd: 10 },
        { file: 'lb4.html', lb: 'Área de aprendizagem 4', k: '4', title: 'Prismas',
          sub: 'Propriedades, perspetiva cavaleira e planificação, área total e volume, projeto resíduos de embalagens', when: 'Abril · Maio', ustd: 12 },
        { file: 'lb5.html', lb: 'Área de aprendizagem 5', k: '5', title: 'Relacionar: partes de um todo',
          sub: 'Fração e percentagem, gráficos circulares, partes de áreas e de volumes', when: 'Maio', ustd: 4 },
        { file: 'wb.html', lb: 'Área opcional', k: 'O', title: 'Números primos',
          sub: 'Crivo de Eratóstenes, decomposição em fatores primos, infinitos números primos, criptografia', when: 'Maio · Junho', ustd: 8 }
    ]
};

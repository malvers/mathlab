/* kapitel.js — the chapters of the Portuguese edition (Portugal) of "Mathematik · Oberschule 5" (buch/mathe5/), in the
 * order of the school year (Stoffverteilungsplan svp/mathe/mathe5.html: LB 1 → LB 2 → LB 3 → LB 4 → Wahlbereich 1;
 * Lehrplan Oberschule 2019: 100 Ustd. Pflicht + 8 Ustd. Wahlbereich). Doc, 27.11.2026 (block pt-14). Terms as in
 * tools/buch-pt/glossario.md, section mathe5-pt. Single source for the table of contents (index.html) and the
 * previous/next cards at the end of every chapter. No print edition yet (druck: false).
 */
window.BUCH = {
    title: 'Matemática · Oberschule 5',
    short: 'Matemática OS 5',
    lang: 'pt',
    druck: false,
    description: 'Manual interativo de Matemática para a Oberschule (escola da Saxónia do 5.º ao 10.º ano), 5.º ano: números grandes, algoritmos das quatro operações, propriedades e prioridade das operações, quadrados perfeitos, equações e divisibilidade, frações, números decimais, percentagens e grandezas, coordenadas e ângulos, retângulo e cubo, simetria e translação, e a numeração dos babilónios, dos egípcios e dos romanos, com laboratórios, simulações e autoavaliações com resposta imediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizagem 1', k: '1.1', title: 'Números grandes',
          sub: 'Reta numérica, quadro de ordens e classes, milhões e mil milhões, arredondar, estimar, comparar', when: 'Agosto · Setembro', ustd: 7 },
        { file: 'lb1-2.html', lb: 'Área de aprendizagem 1', k: '1.2', title: 'Cálculo com números naturais',
          sub: 'Algoritmos da adição, subtração, multiplicação e divisão, estimativa, propriedades das operações, prioridade das operações', when: 'Setembro · Outubro', ustd: 15 },
        { file: 'lb1-3.html', lb: 'Área de aprendizagem 1', k: '1.3', title: 'Potências, equações e divisores',
          sub: 'Potências de base 10, quadrados perfeitos, resolver equações por tentativas, critérios de divisibilidade, números primos', when: 'Outubro · Novembro', ustd: 12 },
        { file: 'lb2-1.html', lb: 'Área de aprendizagem 2', k: '2.1', title: 'Frações',
          sub: 'Representar partes, frações na reta numérica, fração de uma grandeza, comparar e estimar', when: 'Dezembro · Janeiro', ustd: 11 },
        { file: 'lb2-2.html', lb: 'Área de aprendizagem 2', k: '2.2', title: 'Números decimais e percentagens',
          sub: 'Décimas, centésimas, milésimas, converter, comparar, arredondar, escrita em percentagem', when: 'Janeiro', ustd: 9 },
        { file: 'lb2-3.html', lb: 'Área de aprendizagem 2', k: '2.3', title: 'Cálculo com números decimais e grandezas',
          sub: 'Adicionar e subtrair, multiplicar e dividir por um número natural, média, dinheiro, comprimento, massa e tempo', when: 'Janeiro · Março', ustd: 14 },
        { file: 'lb3-1.html', lb: 'Área de aprendizagem 3', k: '3.1', title: 'Coordenadas, retas e ângulos',
          sub: 'Referencial cartesiano, retas paralelas e perpendiculares, medir, desenhar e estimar ângulos, tipos de ângulos', when: 'Março · Abril', ustd: 9 },
        { file: 'lb3-2.html', lb: 'Área de aprendizagem 3', k: '3.2', title: 'Retângulo e cubo',
          sub: 'Perspetiva cavaleira e planificação do cubo, perímetro e área, área total e volume', when: 'Abril · Maio', ustd: 11 },
        { file: 'lb4.html', lb: 'Área de aprendizagem 4', k: '4', title: 'Simetria e figuras geometricamente iguais',
          sub: 'Eixos de simetria, reflexão axial, translação, figura original e imagem, frisos', when: 'Maio · Junho', ustd: 12 },
        { file: 'wb.html', lb: 'Área opcional', k: 'O', title: 'Como a humanidade aprendeu a contar e a calcular',
          sub: 'Pau entalhado, babilónios, egípcios e romanos, calcular sobre as linhas, uma apresentação', when: 'Junho · Julho', ustd: 8 }
    ]
};

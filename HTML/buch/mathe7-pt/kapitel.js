/* kapitel.js — the chapters of the Portuguese edition (Portugal) of "Mathematik · Oberschule 7" (buch/mathe7/,
 * Realschulbildungsgang), in the order of the school year (Stoffverteilungsplan svp/mathe/mathe7.html: LB 1 → LB 2 →
 * LB 3 → LB 4 → Wahlbereich 3; 4 Ustd./week, 100 + 8 Ustd.). Doc, 27.11.2026 (block pt-16). Terms as in
 * tools/buch-pt/glossario.md, section mathe7-pt.
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition yet (druck: false).
 */
window.BUCH = {
    title: 'Matemática · Oberschule 7',
    short: 'Matemática OS 7',
    lang: 'pt',
    druck: false,
    description: 'Manual interativo de Matemática para a Oberschule (escola secundária alemã da Saxónia), 7.º ano, via Realschule: percentagens e juros, acaso e frequências, números racionais, expressões e equações, quadriláteros, polígonos e prismas com massa e massa volúmica, pavimentações à maneira de Escher, com laboratórios, simulações e autoavaliações com resposta imediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizagem 1', k: '1.1', title: 'Percentagens',
          sub: 'A percentagem como centésima parte, valor de referência, valor da percentagem e percentagem, os três problemas básicos, gráficos circulares', when: 'Agosto · Setembro', ustd: 16 },
        { file: 'lb1-2.html', lb: 'Área de aprendizagem 1', k: '1.2', title: 'Percentagens no dia a dia e juros',
          sub: 'Aumento e redução de preços, desconto e IVA, juros anuais e juros de alguns dias, juro composto com a folha de cálculo', when: 'Setembro · Outubro', ustd: 12 },
        { file: 'lb2.html', lb: 'Área de aprendizagem 2', k: '2', title: 'Elementos de estocástica',
          sub: 'Experiências aleatórias, resultados e acontecimentos, frequências e simulação, probabilidade, ler estatísticas com espírito crítico', when: 'Novembro', ustd: 12 },
        { file: 'lb3-1.html', lb: 'Área de aprendizagem 3', k: '3.1', title: 'Números racionais',
          sub: 'Números negativos, reta numérica, simétrico e valor absoluto, conjuntos numéricos, coordenadas nos quatro quadrantes', when: 'Novembro · Dezembro', ustd: 8 },
        { file: 'lb3-2.html', lb: 'Área de aprendizagem 3', k: '3.2', title: 'Operações com números racionais',
          sub: 'Adição e subtração, multiplicação, divisão e potências, propriedades das operações e prioridade das operações', when: 'Dezembro · Janeiro', ustd: 12 },
        { file: 'lb3-3.html', lb: 'Área de aprendizagem 3', k: '3.3', title: 'Expressões e equações',
          sub: 'Valor de uma expressão, escrever e resolver equações, resolver fórmulas em ordem a uma variável, proporções', when: 'Janeiro', ustd: 8 },
        { file: 'lb4-1.html', lb: 'Área de aprendizagem 4', k: '4.1', title: 'Quadriláteros e polígonos',
          sub: 'Quadriláteros à nossa volta, construir quadriláteros, área e perímetro, decompor e comparar polígonos', when: 'Fevereiro · Março', ustd: 16 },
        { file: 'lb4-2.html', lb: 'Área de aprendizagem 4', k: '4.2', title: 'Prismas',
          sub: 'Perspetiva cavaleira e planificação, área total e volume, massa e massa volúmica, sólidos compostos e embalagens', when: 'Abril · Maio', ustd: 16 },
        { file: 'wb.html', lb: 'Área opcional', k: 'O', title: 'Pavimentações',
          sub: 'Pavimentações com polígonos regulares, os ângulos num vértice, pavimentações à maneira de M. C. Escher', when: 'Junho', ustd: 8 }
    ]
};

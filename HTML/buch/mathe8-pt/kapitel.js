/* kapitel.js — the chapters of the Portuguese edition (Portugal) of "Mathematik · Oberschule 8" (buch/mathe8/, Realschulbildungsgang),
 * in the order of the school year (Stoffverteilungsplan svp/mathe/mathe8.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → LB 6 →
 * Wahlpflichtbereich 1; 4 Ustd./week, 100 + 8 Ustd.). Doc, 27.11.2026 (block pt-17). Terms as in tools/buch-pt/glossario.md,
 * section mathe8-pt. Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition yet (druck: false).
 */
window.BUCH = {
    title: 'Matemática · Oberschule 8',
    short: 'Matemática OS 8',
    lang: 'pt',
    druck: false,
    description: 'Manual interativo de Matemática para a Oberschule (escola secundária da Saxónia), 8.º ano, percurso Realschule: expressões e transformações, equações do 1.º grau e fórmulas, funções, funções afins e sistemas de equações com comparação de tarifários, circunferência e teorema de Tales, cilindro, semelhança e homotetia, experiências aleatórias com diagramas em árvore, a Matemática do dia a dia com renda, eletricidade e custos de obras e a bicicleta, com elementos interativos para experimentar e autoavaliações com resposta imediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizagem 1', k: '1.1', title: 'Expressões e transformações',
          sub: 'Valores de expressões e fórmulas, reduzir termos semelhantes, desembaraçar de parênteses, desenvolver e pôr em evidência', when: 'Agosto · Setembro', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Área de aprendizagem 1', k: '1.2', title: 'Equações do 1.º grau e fórmulas',
          sub: 'Princípios de equivalência, nenhuma ou infinitas soluções, resolver fórmulas em ordem a uma variável, problemas', when: 'Setembro', ustd: 8 },
        { file: 'lb2-1.html', lb: 'Área de aprendizagem 2', k: '2.1', title: 'Funções',
          sub: 'Correspondência unívoca, objeto e imagem, domínio e contradomínio, funções de proporcionalidade direta', when: 'Outubro', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Área de aprendizagem 2', k: '2.2', title: 'Funções afins',
          sub: 'y = mx + b, declive e ordenada na origem, zeros, equação a partir de dois pontos', when: 'Novembro', ustd: 8 },
        { file: 'lb2-3.html', lb: 'Área de aprendizagem 2', k: '2.3', title: 'Sistemas de equações lineares',
          sub: 'Resolução gráfica e algébrica, número de soluções, comparação de tarifários e preços', when: 'Novembro · Dezembro', ustd: 10 },
        { file: 'lb3-1.html', lb: 'Área de aprendizagem 3', k: '3.1', title: 'A circunferência e o círculo',
          sub: 'Circunferência e reta, teorema de Tales, perímetro e área, o número π, coroa circular', when: 'Dezembro · Janeiro', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Área de aprendizagem 3', k: '3.2', title: 'O cilindro',
          sub: 'Planificação, vistas e perspetiva cavaleira, área total, volume e massa de cilindros maciços e ocos', when: 'Janeiro', ustd: 6 },
        { file: 'lb4.html', lb: 'Área de aprendizagem 4', k: '4', title: 'Semelhança',
          sub: 'Homotetia e escala, critério AA de semelhança, comprimentos, áreas e volumes, figuras geometricamente iguais', when: 'Março', ustd: 14 },
        { file: 'lb5.html', lb: 'Área de aprendizagem 5', k: '5', title: 'Acontecimentos aleatórios',
          sub: 'Simular, diagrama em árvore e regras do produto e da soma, com e sem reposição, contagem', when: 'Abril', ustd: 14 },
        { file: 'lb6.html', lb: 'Área de aprendizagem 6', k: '6', title: 'A Matemática do dia a dia',
          sub: 'Renda e despesas, faturas da eletricidade e da água, custos de obras, comparar propostas e juros', when: 'Maio · Junho', ustd: 12 },
        { file: 'wb.html', lb: 'Área opcional', k: 'O', title: 'A bicicleta',
          sub: 'Polegadas e medida do pneu, perímetro da roda, relação de transmissão, cadência e velocidade', when: 'Junho', ustd: 8 }
    ]
};

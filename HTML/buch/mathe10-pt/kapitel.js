/* kapitel.js — the chapters of the Portuguese edition (Portugal) of "Mathematik · Oberschule 10" (buch/mathe10/, Realschulbildungsgang),
 * in the order of the school year (Stoffverteilungsplan svp/mathe/mathe10.html: LB 1 → LB 2 → LB 3 → LB 4 → Wahlpflichtbereich 3;
 * 4 Ustd./week, 80 + 8 Ustd.). Doc, 27.11.2026 (block pt-19). Terms as in tools/buch-pt/glossario.md, section mathe10-pt.
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition yet (druck: false).
 */
window.BUCH = {
    title: 'Matemática · Oberschule 10',
    short: 'Matemática OS 10',
    lang: 'pt',
    druck: false,
    description: 'Manual interativo de Matemática para a Oberschule (escola secundária da Saxónia), 10.º ano, percurso Realschule: triângulos e polígonos com a lei dos senos e a lei dos cossenos, funções potência, exponenciais e a função seno, variáveis aleatórias e valor médio, salário, poupança e crédito, sólidos com troncos de pirâmide e de cone, resolução de problemas para o exame final e medições no terreno, com laboratórios, simulações e autoavaliações com resposta imediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizagem 1', k: '1.1', title: 'Triângulos, quadriláteros e trigonometria',
          sub: 'Casa dos quadriláteros, soma dos ângulos, seno, cosseno e tangente em figuras', when: 'Agosto · Setembro', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Área de aprendizagem 1', k: '1.2', title: 'Lei dos senos e lei dos cossenos',
          sub: 'Lados e ângulos em triângulos quaisquer, calcular distâncias', when: 'Setembro', ustd: 8 },
        { file: 'lb1-3.html', lb: 'Área de aprendizagem 1', k: '1.3', title: 'Áreas de triângulos e polígonos',
          sub: 'Área com o seno, polígonos regulares, calcular a área de terrenos', when: 'Setembro · Outubro', ustd: 4 },
        { file: 'lb2-1.html', lb: 'Área de aprendizagem 2', k: '2.1', title: 'Funções potência',
          sub: 'Parábolas e hipérboles, simetria, assíntotas, proporcionalidade inversa', when: 'Novembro', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Área de aprendizagem 2', k: '2.2', title: 'Funções exponenciais',
          sub: 'Crescimento e decaimento, fator de crescimento, juro composto, meia-vida', when: 'Novembro', ustd: 4 },
        { file: 'lb2-3.html', lb: 'Área de aprendizagem 2', k: '2.3', title: 'A função seno',
          sub: 'Radianos, círculo trigonométrico, amplitude e período, as funções em resumo', when: 'Novembro · Dezembro', ustd: 8 },
        { file: 'lb3.html', lb: 'Área de aprendizagem 3', k: '3', title: 'Variáveis aleatórias e valor médio',
          sub: 'Distribuição de probabilidades, valor médio, jogos equitativos, simulação e risco', when: 'Dezembro · Janeiro', ustd: 12 },
        { file: 'lb4-1.html', lb: 'Área de aprendizagem 4', k: '4.1', title: 'O dinheiro no dia a dia',
          sub: 'Salário e descontos, orçamento familiar, poupança, crédito e endividamento', when: 'Janeiro', ustd: 8 },
        { file: 'lb4-2.html', lb: 'Área de aprendizagem 4', k: '4.2', title: 'Sólidos e troncos',
          sub: 'Prisma, cilindro, pirâmide, cone e esfera, troncos de pirâmide e de cone, massa e custos', when: 'Fevereiro · Março', ustd: 8 },
        { file: 'lb4-3.html', lb: 'Área de aprendizagem 4', k: '4.3', title: 'Resolver problemas',
          sub: 'Probabilidades e funções no dia a dia, conhecimentos básicos sem calculadora, preparado para o exame', when: 'Março', ustd: 12 },
        { file: 'wb.html', lb: 'Área opcional', k: 'O', title: 'Problemas de medição',
          sub: 'Triângulo do guarda-florestal, método das sombras, teorema de Tales, triangulação, medições na escola', when: 'Maio', ustd: 8 }
    ]
};

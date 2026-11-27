/* kapitel.js — the chapters of the Portuguese edition (Portugal) of "Mathematik · Oberschule 9" (buch/mathe9/, Realschulbildungsgang),
 * in the order of the school year (Stoffverteilungsplan svp/mathe/mathe9.html: LB 1 → LB 2 → LB 3 → Wahlpflichtbereich 1 → LB 4;
 * 4 Ustd./week, 100 + 8 Ustd.). Doc, 27.11.2026 (block pt-18). Terms as in tools/buch-pt/glossario.md, section mathe9-pt.
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition yet (druck: false).
 */
window.BUCH = {
    title: 'Matemática · Oberschule 9',
    short: 'Matemática OS 9',
    lang: 'pt',
    druck: false,
    description: 'Manual interativo de Matemática para a Oberschule (escola secundária da Saxónia), 9.º ano, percurso Realschule: o teorema de Pitágoras e o seu recíproco, seno, cosseno e tangente, problemas com triângulos retângulos, pirâmide, cone e esfera, sólidos compostos, funções quadráticas e equações do 2.º grau com a fórmula resolvente, a secção áurea e estatística descritiva com um projeto próprio, com elementos interativos para experimentar e autoavaliações com resposta imediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizagem 1', k: '1.1', title: 'O teorema de Pitágoras',
          sub: 'Hipotenusa e catetos, calcular lados e alturas, distâncias no referencial, recíproco e corda de nós', when: 'Agosto · Setembro', ustd: 12 },
        { file: 'lb1-2.html', lb: 'Área de aprendizagem 1', k: '1.2', title: 'Seno, cosseno e tangente',
          sub: 'Razões entre os lados do triângulo retângulo, calcular lados e ângulos com a calculadora', when: 'Setembro', ustd: 8 },
        { file: 'lb1-3.html', lb: 'Área de aprendizagem 1', k: '1.3', title: 'Triângulos retângulos no dia a dia',
          sub: 'Inclinação em percentagem e ângulo de inclinação, escada, telhado e cabo de suspensão, decompor em problemas parciais', when: 'Setembro · Outubro', ustd: 8 },
        { file: 'lb2-1.html', lb: 'Área de aprendizagem 2', k: '2.1', title: 'A pirâmide',
          sub: 'Planificação, perspetiva cavaleira e dupla projeção ortogonal, altura, apótema e aresta lateral, área total, volume e massa', when: 'Novembro', ustd: 12 },
        { file: 'lb2-2.html', lb: 'Área de aprendizagem 2', k: '2.2', title: 'O cone e a esfera',
          sub: 'Geratriz, superfície lateral como setor circular, área total e volume do cone e da esfera, raiz cúbica', when: 'Dezembro', ustd: 12 },
        { file: 'lb2-3.html', lb: 'Área de aprendizagem 2', k: '2.3', title: 'Sólidos compostos',
          sub: 'Decompor torres, silos, peças e recipientes, volume, área total e material necessário', when: 'Janeiro', ustd: 4 },
        { file: 'lb3-1.html', lb: 'Área de aprendizagem 3', k: '3.1', title: 'Funções quadráticas',
          sub: 'Parábola de referência, y = a × x² + c, forma canónica y = (x + d)² + e, forma geral e completar o quadrado', when: 'Janeiro · Fevereiro · Março', ustd: 16 },
        { file: 'lb3-2.html', lb: 'Área de aprendizagem 3', k: '3.2', title: 'Equações do 2.º grau',
          sub: 'Resolver por raciocínio, fórmula resolvente e análise de casos, zeros, pontos de interseção e problemas', when: 'Março', ustd: 12 },
        { file: 'wb.html', lb: 'Área opcional', k: 'O', title: 'A secção áurea',
          sub: 'Razão de divisão e o número Φ, construção, números de Fibonacci, arte, arquitetura e natureza', when: 'Abril', ustd: 8 },
        { file: 'lb4.html', lb: 'Área de aprendizagem 4', k: '4', title: 'Estatística descritiva',
          sub: 'Dados nos meios de comunicação, média, mediana e moda, amplitude, um projeto de estatística próprio', when: 'Maio · Junho', ustd: 16 }
    ]
};

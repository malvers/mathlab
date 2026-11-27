/* kapitel.js — the chapters of the Portuguese edition (Portugal) of "Mathematik · Oberschule 6" (buch/mathe6/), in the
 * order of the school year (Stoffverteilungsplan svp/mathe/mathe6.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich 2;
 * 5 Ustd./week, 125 + 10 Ustd.). Doc, 27.11.2026 (block pt-15). Terms as in tools/buch-pt/glossario.md, section mathe6-pt.
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition yet (druck: false).
 */
window.BUCH = {
    title: 'Matemática · Oberschule 6',
    short: 'Matemática OS 6',
    lang: 'pt',
    druck: false,
    description: 'Manual interativo de Matemática para a Oberschule (escola secundária da Saxónia do 5.º ao 10.º ano), 6.º ano: representar, converter e comparar frações e números decimais, operações com frações e números decimais, correspondências e regra de três simples, ângulos e triângulos, área e perímetro, sólidos e as suas planificações, a Matemática no dia a dia e jogos matemáticos, com laboratórios, simulações e autoavaliações com resposta imediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizagem 1', k: '1.1', title: 'Representar frações e números decimais',
          sub: 'Conjuntos, reta numérica, frações equivalentes e simplificação, fração e número decimal, comparar', when: 'Agosto · Setembro', ustd: 20 },
        { file: 'lb1-2.html', lb: 'Área de aprendizagem 1', k: '1.2', title: 'Operações com frações e números decimais',
          sub: 'Adicionar e subtrair, multiplicar e dividir, cálculo mental e estimativa', when: 'Setembro · Outubro', ustd: 10 },
        { file: 'lb1-3.html', lb: 'Área de aprendizagem 1', k: '1.3', title: 'Propriedades das operações, média e problemas',
          sub: 'Prioridade das operações e cálculo mais simples, média aritmética, resolver equações por raciocínio', when: 'Outubro', ustd: 5 },
        { file: 'lb2-1.html', lb: 'Área de aprendizagem 2', k: '2.1', title: 'Representar correspondências',
          sub: 'Unívocas, biunívocas, não unívocas, por palavras, tabela, setas, gráfico e equação', when: 'Novembro', ustd: 10 },
        { file: 'lb2-2.html', lb: 'Área de aprendizagem 2', k: '2.2', title: 'Proporcionalidade e regra de três simples',
          sub: 'Proporcionalidade direta e inversa, quociente e produto, regra de três simples, problemas', when: 'Novembro · Dezembro', ustd: 15 },
        { file: 'lb3-1.html', lb: 'Área de aprendizagem 3', k: '3.1', title: 'Ângulos e triângulos',
          sub: 'Ângulos em retas, soma dos ângulos internos, tipos de triângulos, critérios de igualdade e desigualdade triangular', when: 'Janeiro', ustd: 15 },
        { file: 'lb3-2.html', lb: 'Área de aprendizagem 3', k: '3.2', title: 'Área e perímetro',
          sub: 'Triângulo, paralelogramo, papagaio e trapézio, figuras compostas, resolução de problemas', when: 'Janeiro · Fevereiro', ustd: 15 },
        { file: 'lb4.html', lb: 'Área de aprendizagem 4', k: '4', title: 'Sólidos geométricos',
          sub: 'Descrever sólidos, vistas, perspetiva cavaleira e planificação, sólidos compostos, prismas retos', when: 'Março · Abril', ustd: 20 },
        { file: 'lb5.html', lb: 'Área de aprendizagem 5', k: '5', title: 'A Matemática no dia a dia',
          sub: 'Estratégias de resolução de problemas, experiências aleatórias e frequências, «se …, então …» e «quanto mais …, mais …»', when: 'Abril · Maio', ustd: 15 },
        { file: 'wb.html', lb: 'Área opcional', k: 'O', title: 'Jogos matemáticos',
          sub: 'Tangram e cubo Soma, Torre de Hanói, jogos de Nim, jogos de dados, um jogo inventado por ti', when: 'Junho', ustd: 10 }
    ]
};

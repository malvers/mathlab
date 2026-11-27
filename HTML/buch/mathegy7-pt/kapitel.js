/* kapitel.js — the chapters of the Portuguese edition (Portugal) of "Mathematik · Gymnasium 7" (buch/mathegy7/), in the
 * order of the school year (Stoffverteilungsplan svp/mathe/mathegy7.html: LB 1 → LB 2 → LB 3 → LB 4 → Wahlbereich 3;
 * 4 Ustd./week, 104 + 8 Ustd.). Doc, 27.11.2026 (block pt-11). Terms as in tools/buch-pt/glossario.md, section mathegy7-pt.
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition yet (druck: false).
 */
window.BUCH = {
    title: 'Matemática · Gymnasium 7',
    short: 'Matemática GY 7',
    lang: 'pt',
    druck: false,
    description: 'Manual interativo de Matemática para o Gymnasium (escola alemã que conduz ao Abitur), 7.º ano, Saxónia: circunferência e reta, circunferências circunscrita e inscrita, o teorema de Tales e os ângulos na circunferência, construções e resolução de problemas, números racionais e operações, equações e fórmulas, percentagens, prismas e pirâmides em perspetiva, planificação e dupla projeção ortogonal, área total e volume, gráficos e os sólidos platónicos, com planificações que se dobram em 3D, construções passo a passo e autoavaliações com resposta imediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizagem 1', k: '1.1', title: 'Circunferência e reta, circunferências circunscrita e inscrita',
          sub: 'Reta exterior, tangente e secante, mediatrizes e bissetrizes do triângulo', when: 'Agosto · Setembro', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Área de aprendizagem 1', k: '1.2', title: 'Teoremas sobre a circunferência',
          sub: 'Teorema de Tales, ângulo inscrito e ângulo ao centro, quadrilátero inscrito, teorema e demonstração', when: 'Setembro', ustd: 8 },
        { file: 'lb1-3.html', lb: 'Área de aprendizagem 1', k: '1.3', title: 'Construções e resolução de problemas',
          sub: 'Esboço e plano de construção, tangentes a partir de um ponto, trabalhar para a frente e para trás', when: 'Setembro · Outubro', ustd: 8 },
        { file: 'lb2-1.html', lb: 'Área de aprendizagem 2', k: '2.1', title: 'Números racionais',
          sub: 'Números negativos, reta numérica, valor absoluto e simétrico, conjuntos numéricos', when: 'Outubro · Novembro', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Área de aprendizagem 2', k: '2.2', title: 'Operações com números racionais',
          sub: 'As quatro operações, regras dos sinais, propriedades das operações, potências e raízes quadradas', when: 'Novembro · Dezembro', ustd: 16 },
        { file: 'lb2-3.html', lb: 'Área de aprendizagem 2', k: '2.3', title: 'Equações e fórmulas',
          sub: 'Resolver equações de cabeça e com os princípios de equivalência, problemas, resolver fórmulas em ordem a uma variável', when: 'Dezembro · Janeiro', ustd: 16 },
        { file: 'lb2-4.html', lb: 'Área de aprendizagem 2', k: '2.4', title: 'Percentagens',
          sub: 'Valor de referência, valor da percentagem e percentagem, desconto e IVA, aumentar em e para, gráficos', when: 'Fevereiro · Março', ustd: 16 },
        { file: 'lb3-1.html', lb: 'Área de aprendizagem 3', k: '3.1', title: 'Representar prismas e pirâmides',
          sub: 'Planificação, perspetiva cavaleira e dupla projeção ortogonal, verdadeira grandeza', when: 'Abril', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Área de aprendizagem 3', k: '3.2', title: 'Área total, volume e massa',
          sub: 'Calcular prismas e pirâmides, sólidos compostos, o tronco de pirâmide', when: 'Abril · Maio', ustd: 8 },
        { file: 'lb4.html', lb: 'Área de aprendizagem 4', k: '4', title: 'Representar dados',
          sub: 'Gráficos de barras, de linhas e circulares, ler gráficos dos media com espírito crítico', when: 'Maio', ustd: 4 },
        { file: 'wb.html', lb: 'Área opcional', k: 'O', title: 'Sólidos platónicos',
          sub: 'Poliedros, porque há exatamente cinco regulares, a relação de Euler, Platão e Kepler', when: 'Maio · Junho', ustd: 8 }
    ]
};

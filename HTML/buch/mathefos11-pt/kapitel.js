/* kapitel.js — the chapters of the Portuguese edition (Portugal) of "Mathematik · Fachoberschule 11" (buch/mathefos11/),
 * in the order of the school year (Stoffverteilungsplan svp/mathe/mathefos11.html: LB 1 → LB 2 → Wahlbereich 2, then the
 * outlooks of Wahlbereich 1 and 3). Block pt-6 (15.11.2026). Terms as in tools/buch-pt/glossario.md. Single source for the
 * table of contents (index.html) and the previous/next cards at the end of every chapter. No print edition (druck: false).
 */
window.BUCH = {
    title: 'Matemática · Fachoberschule 11',
    short: 'Matemática FOS 11',
    lang: 'pt',
    druck: false,
    description: 'Manual interativo de Matemática para a Fachoberschule (escola profissional alemã), 11.º ano, Saxónia: expressões e fórmulas, funções afins e quadráticas, equações, inequações e sistemas de equações, funções polinomiais, probabilidades, contagens e provas de Bernoulli, matemática financeira e perspetivas sobre números complexos e álgebra de circuitos, com laboratórios, simulações e autoavaliações com resposta imediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizagem 1', k: '1.1', title: 'Números, expressões e fórmulas',
          sub: 'Conjuntos numéricos, resolver fórmulas, módulo, casos notáveis, percentagens, potências', when: 'Agosto · Setembro', ustd: 6 },
        { file: 'lb1-2.html', lb: 'Área de aprendizagem 1', k: '1.2', title: 'Funções e funções afins',
          sub: 'Conceito de função, declive e ordenada na origem, equações da reta, inclinação', when: 'Setembro', ustd: 9 },
        { file: 'lb1-3.html', lb: 'Área de aprendizagem 1', k: '1.3', title: 'Equações e inequações lineares',
          sub: 'Princípios de equivalência, conjuntos-solução, equações fracionárias', when: 'Outubro', ustd: 6 },
        { file: 'lb1-4.html', lb: 'Área de aprendizagem 1', k: '1.4', title: 'Retas e sistemas de equações lineares',
          sub: 'Parâmetros, posição relativa, três métodos de resolução, aplicações', when: 'Novembro', ustd: 9 },
        { file: 'lb1-5.html', lb: 'Área de aprendizagem 1', k: '1.5', title: 'Funções e equações quadráticas',
          sub: 'Forma canónica e forma geral, fórmula resolvente, relações de Viète', when: 'Dezembro', ustd: 6 },
        { file: 'lb1-6.html', lb: 'Área de aprendizagem 1', k: '1.6', title: 'Parábolas por medida',
          sub: 'Fatores lineares, equações a partir de condições, parâmetros com discussão de casos', when: 'Janeiro', ustd: 6 },
        { file: 'lb1-7.html', lb: 'Área de aprendizagem 1', k: '1.7', title: 'Funções polinomiais',
          sub: 'Decomposição em fatores lineares, substituição, multiplicidade, comportamento do gráfico', when: 'Janeiro', ustd: 3 },
        { file: 'lb2-1.html', lb: 'Área de aprendizagem 2', k: '2.1', title: 'Acaso e probabilidade',
          sub: 'Resultados e acontecimentos, lei dos grandes números, Laplace, operações com acontecimentos', when: 'Fevereiro · Março', ustd: 9 },
        { file: 'lb2-2.html', lb: 'Área de aprendizagem 2', k: '2.2', title: 'Experiências aleatórias compostas',
          sub: 'Independência, diagramas em árvore e regras dos caminhos, aplicações', when: 'Março', ustd: 9 },
        { file: 'lb2-3.html', lb: 'Área de aprendizagem 2', k: '2.3', title: 'Contagens, modelo da urna e provas de Bernoulli',
          sub: 'Princípio fundamental da contagem, permutações, arranjos, combinações, fórmula de Bernoulli', when: 'Abril', ustd: 12 },
        { file: 'wb2.html', lb: 'Área opcional 2', k: 'O', title: 'Matemática financeira',
          sub: 'Juro composto, planos de poupança, amortização constante e por anuidades', when: 'Maio', ustd: 6 },
        { file: 'exkurse.html', lb: 'Perspetivas', k: 'P', title: 'Números complexos e álgebra de circuitos',
          sub: 'As áreas opcionais 1 e 3 como digressões: plano de Argand, tabelas de verdade, circuitos', when: 'Junho', ustd: 0 }
    ]
};

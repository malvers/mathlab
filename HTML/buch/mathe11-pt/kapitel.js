/* kapitel.js — the chapters of the Portuguese edition (Portugal) of "Mathematik · Berufliches Gymnasium 11" (buch/mathe11/),
 * in the order of the school year (Stoffverteilungsplan svp/mathe/mathe11.html: LB 2 → LB 3 → LB 4 → LB 1 → Wahlbereich 3).
 * Package arch3 (08.11.2026: the engine, the tools) and block pt-1 (the start page, this file, the chapters). Terms as in
 * tools/buch-pt/glossario.md. Single source for the table of contents (index.html) and the previous/next cards at the end
 * of every chapter. No print edition yet (druck: false).
 */
window.BUCH = {
    title: 'Matemática · Berufliches Gymnasium 11',
    short: 'Matemática 11',
    lang: 'pt',
    druck: false,
    description: 'Manual interativo de Matemática para o Berufliches Gymnasium (escola secundária alemã de orientação profissional), 11.º ano, Saxónia: equações, funções, sistemas de equações, probabilidades e métodos numéricos, com laboratórios, simulações e autoavaliações com resposta imediata.',
    chapters: [
        { file: 'lb2.html', lb: 'Área de aprendizagem 2', k: '2', title: 'Equações, fórmulas, figuras',
          sub: 'Resolver problemas com e sem calculadora', when: 'Setembro', ustd: 20 },
        { file: 'lb3-1.html', lb: 'Área de aprendizagem 3', k: '3.1', title: 'Funções e as suas propriedades',
          sub: 'Domínio, zeros, monotonia, simetria', when: 'Fim de setembro', ustd: 5 },
        { file: 'lb3-2.html', lb: 'Área de aprendizagem 3', k: '3.2', title: 'Crescimento e decrescimento',
          sub: 'Funções afins e funções exponenciais', when: 'Outubro · Novembro', ustd: 10 },
        { file: 'lb3-3.html', lb: 'Área de aprendizagem 3', k: '3.3', title: 'Funções e equações quadráticas',
          sub: 'Movimentos uniformemente acelerados', when: 'Novembro', ustd: 15 },
        { file: 'lb3-4.html', lb: 'Área de aprendizagem 3', k: '3.4', title: 'Fenómenos periódicos',
          sub: 'Funções seno', when: 'Dezembro', ustd: 10 },
        { file: 'lb3-5.html', lb: 'Área de aprendizagem 3', k: '3.5', title: 'Regressão',
          sub: 'Analisar séries de medições com ferramentas digitais', when: 'Dezembro', ustd: 5 },
        { file: 'lb3-6.html', lb: 'Área de aprendizagem 3', k: '3.6', title: 'Funções inversas e logaritmo',
          sub: 'Função raiz quadrada, logaritmo, equações exponenciais', when: 'Janeiro', ustd: 15 },
        { file: 'lb3-7.html', lb: 'Área de aprendizagem 3', k: '3.7', title: 'Gráficos e parâmetros',
          sub: 'As funções de referência sem calculadora, dilatar e deslocar', when: 'Fevereiro · Março', ustd: 15 },
        { file: 'lb4.html', lb: 'Área de aprendizagem 4', k: '4', title: 'Sistemas de equações lineares e matrizes',
          sub: 'Método de Gauss, conjuntos-solução, operações com matrizes', when: 'Março · Abril', ustd: 20 },
        { file: 'lb1.html', lb: 'Área de aprendizagem 1', k: '1', title: 'Probabilidades em experiências aleatórias compostas',
          sub: 'Diagramas em árvore, tabelas de dupla entrada, simulação', when: 'Abril', ustd: 15 },
        { file: 'wb3.html', lb: 'Área opcional 3', k: 'O', title: 'Métodos numéricos e simulações',
          sub: 'Bissecção, áreas aproximadas, método de Monte Carlo', when: 'Maio · Junho', ustd: 10 }
    ]
};

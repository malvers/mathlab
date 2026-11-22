/* kapitel.js — the chapters of the Portuguese edition (Portugal) of "Mathematik · Gymnasium 11" (buch/mathegy11/, Grundkurs),
 * in the order of the school year (Stoffverteilungsplan svp/mathe/mathegy11.html: LB 1 with LB 2 before the conditions part,
 * Wahlbereich 2 at the end of 11/I, then LB 3 → LB 4; 4 Ustd./week). The numbers follow the Lehrplan, so chapter 2 comes
 * between 1.4 and 1.5. Book pt-9 (22.11.2026). Terms as in tools/buch-pt/glossario.md. Single source for the table of
 * contents (index.html) and the previous/next cards at the end of every chapter. No print edition yet (druck: false).
 */
window.BUCH = {
    title: 'Matemática · Gymnasium 11',
    short: 'Matemática GY 11',
    lang: 'pt',
    druck: false,
    description: 'Manual interativo de Matemática para o Gymnasium (escola secundária alemã de ensino geral), 11.º ano, Grundkurs (curso de nível base), Saxónia: limites, a derivada e as regras de derivação, estudo de funções, funções a partir de condições, problemas de otimização e regressão, matrizes e método de Gauss-Jordan, métodos numéricos, vetores, retas e planos no espaço, experiências aleatórias compostas e a distribuição binomial, com laboratórios, simulações e autoavaliações com resposta imediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizagem 1', k: '1.1', title: 'Limites e continuidade',
          sub: 'Comportamento no infinito, limite num ponto, teoremas sobre limites, continuidade', when: 'Agosto · Setembro', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Área de aprendizagem 1', k: '1.2', title: 'Taxas de variação e derivada',
          sub: 'Secante e tangente, taxa média e taxa instantânea de variação, função derivada', when: 'Setembro', ustd: 8 },
        { file: 'lb1-3.html', lb: 'Área de aprendizagem 1', k: '1.3', title: 'Regras de derivação',
          sub: 'Regras da potência, do fator e da soma, eˣ, ln x e sen x, regras do produto e da cadeia', when: 'Setembro · Outubro', ustd: 12 },
        { file: 'lb1-4.html', lb: 'Área de aprendizagem 1', k: '1.4', title: 'Estudar funções',
          sub: 'Monotonia, extremos, pontos de inflexão, simetria, polos e assíntotas', when: 'Outubro · Novembro', ustd: 12 },
        { file: 'lb2.html', lb: 'Área de aprendizagem 2', k: '2', title: 'Matrizes',
          sub: 'Notação matricial, multiplicação, método de Gauss-Jordan, rotações', when: 'Novembro · Dezembro', ustd: 6 },
        { file: 'lb1-5.html', lb: 'Área de aprendizagem 1', k: '1.5', title: 'Funções à medida',
          sub: 'Funções a partir de condições, problemas de otimização, regressão', when: 'Dezembro · Janeiro', ustd: 12 },
        { file: 'wb2.html', lb: 'Área opcional 2', k: 'W', title: 'Métodos numéricos',
          sub: 'Resolver equações graficamente, método da bissecção, método de Newton', when: 'Janeiro · Fevereiro', ustd: 8 },
        { file: 'lb3-1.html', lb: 'Área de aprendizagem 3', k: '3.1', title: 'Vetores no espaço',
          sub: 'Referencial no espaço, cálculo com vetores, dependência linear', when: 'Fevereiro · Março', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Área de aprendizagem 3', k: '3.2', title: 'Retas no espaço',
          sub: 'Equação vetorial, pertença de um ponto, pontos de interseção com os planos coordenados, posição relativa de duas retas', when: 'Março', ustd: 8 },
        { file: 'lb3-3.html', lb: 'Área de aprendizagem 3', k: '3.3', title: 'Planos',
          sub: 'Equação vetorial, equação cartesiana, posição relativa de reta e plano', when: 'Abril', ustd: 12 },
        { file: 'lb4-1.html', lb: 'Área de aprendizagem 4', k: '4.1', title: 'Experiências aleatórias compostas',
          sub: 'Modelo da urna, regras do produto e da soma, tabela de dupla entrada, independência, simulação', when: 'Abril · Maio', ustd: 6 },
        { file: 'lb4-2.html', lb: 'Área de aprendizagem 4', k: '4.2', title: 'A distribuição binomial',
          sub: 'Provas de Bernoulli, coeficiente binomial, probabilidades acumuladas, valor médio e desvio padrão', when: 'Maio · Junho', ustd: 12 }
    ]
};

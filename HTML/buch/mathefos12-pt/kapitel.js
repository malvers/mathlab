/* kapitel.js — the chapters of the Portuguese edition (Portugal) of "Mathematik · Fachoberschule 12" (buch/mathefos12/),
 * in the order of the school year (Stoffverteilungsplan svp/mathe/mathefos12.html: LB 1 → LB 2 → LB 3 → LB 4 → FHR-Prüfung →
 * Wahlbereich 3; 4 Ustd./week). Block pt-7 (22.11.2026). Terms as in tools/buch-pt/glossario.md. Single source for the
 * table of contents (index.html) and the previous/next cards at the end of every chapter. No print edition (druck: false).
 */
window.BUCH = {
    title: 'Matemática · Fachoberschule 12',
    short: 'Matemática FOS 12',
    lang: 'pt',
    druck: false,
    description: 'Manual interativo de Matemática para a Fachoberschule (escola profissional alemã), 12.º ano, Saxónia: vetores, retas e planos no espaço em verdadeiro 3D, cálculo diferencial dos limites aos problemas de otimização, cálculo integral, funções racionais e exponenciais, treino para o exame da Fachhochschulreife e uma área opcional com CAS, com laboratórios, simulações e autoavaliações com resposta imediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizagem 1', k: '1.1', title: 'Vetores e produto escalar',
          sub: 'Setas no espaço, norma, cálculo com vetores, ângulos e perpendicularidade', when: 'Agosto · Setembro', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Área de aprendizagem 1', k: '1.2', title: 'Retas no espaço',
          sub: 'Equação vetorial, pertença de um ponto, pontos de interseção com os planos coordenados, posições relativas, ângulos', when: 'Setembro', ustd: 8 },
        { file: 'lb1-3.html', lb: 'Área de aprendizagem 1', k: '1.3', title: 'Planos no espaço',
          sub: 'Equação vetorial e equação cartesiana, produto vetorial, reta e plano', when: 'Setembro · Outubro', ustd: 8 },
        { file: 'lb1-4.html', lb: 'Área de aprendizagem 1', k: '1.4', title: 'Perpendicular, distância e áreas',
          sub: 'Pé da perpendicular, distância de um ponto a um plano, áreas, aplicações variadas', when: 'Outubro · Novembro', ustd: 6 },
        { file: 'lb2-1.html', lb: 'Área de aprendizagem 2', k: '2.1', title: 'Limites e taxas de variação',
          sub: 'Sucessões, comportamento no infinito, continuidade, velocidade média e instantânea', when: 'Novembro', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Área de aprendizagem 2', k: '2.2', title: 'A derivada',
          sub: 'Derivada num ponto, regras de derivação, regra da cadeia, tangente e normal', when: 'Novembro · Dezembro', ustd: 12 },
        { file: 'lb2-3.html', lb: 'Área de aprendizagem 2', k: '2.3', title: 'Estudo de funções',
          sub: 'Zeros, simetria, monotonia, extremos e pontos de inflexão, o esquema completo', when: 'Dezembro · Janeiro', ustd: 8 },
        { file: 'lb2-4.html', lb: 'Área de aprendizagem 2', k: '2.4', title: 'Famílias, funções por condições e otimização',
          sub: 'Pontos de interseção e de tangência, famílias de funções, funções a partir de condições, otimizar', when: 'Janeiro', ustd: 7 },
        { file: 'lb3.html', lb: 'Área de aprendizagem 3', k: '3', title: 'Cálculo integral',
          sub: 'Primitivas, integral definido, teorema fundamental, áreas entre gráficos', when: 'Fevereiro · Março', ustd: 10 },
        { file: 'lb4-1.html', lb: 'Área de aprendizagem 4', k: '4.1', title: 'Funções racionais',
          sub: 'Polos e descontinuidades removíveis, assíntotas, regra do quociente, estudo completo', when: 'Março', ustd: 12 },
        { file: 'lb4-2.html', lb: 'Área de aprendizagem 4', k: '4.2', title: 'Funções exponenciais de base e',
          sub: 'O número e, equações exponenciais, derivar com a regra da cadeia e do produto, crescimento', when: 'Abril', ustd: 13 },
        { file: 'fhr.html', lb: 'Exame', k: 'E', title: 'Pronto para o exame da FHR',
          sub: 'Listas de verificação e exercícios no formato do exame de todas as áreas de aprendizagem', when: 'Maio', ustd: 0 },
        { file: 'wb3.html', lb: 'Área opcional 3', k: 'O', title: 'Cálculo diferencial e integral com CAS',
          sub: 'Famílias com dois parâmetros, funções definidas por ramos, regressão, perspetiva da projeção central', when: 'Junho', ustd: 8 }
    ]
};

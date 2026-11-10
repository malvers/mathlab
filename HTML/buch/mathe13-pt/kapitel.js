/* kapitel.js — the chapters of the Portuguese edition (Portugal) of "Mathematik · Berufliches Gymnasium 13" (buch/mathe13/),
 * in the order of the school year (Stoffverteilungsplan svp/mathe/mathe13.html: LB 3 → LB 4 → Wahlpflicht 1 → LB 6 →
 * Abiturvorbereitung; Grundkurs, Abiturjahrgang). Book pt-3 (10.11.2026), the sibling of mathe12-pt. Terms as in
 * tools/buch-pt/glossario.md. Single source for the table of contents (index.html) and the previous/next cards at the end
 * of every chapter. No print edition yet (druck: false).
 */
window.BUCH = {
    title: 'Matemática · Berufliches Gymnasium 13',
    short: 'Matemática 13',
    lang: 'pt',
    druck: false,
    description: 'Manual interativo de Matemática para o Berufliches Gymnasium (escola secundária alemã de orientação profissional), 13.º ano, Saxónia: cálculo integral, estatística inferencial com testes de hipóteses, geometria analítica de retas e planos no espaço, mais aplicações e um capítulo de preparação para o Abitur, com laboratórios, simulações e autoavaliações com resposta imediata.',
    chapters: [
        { file: 'lb3-1.html', lb: 'Área de aprendizagem 3', k: '3.1', title: 'Primitivas',
          sub: 'Derivar ao contrário, integral indefinido, regras de primitivação', when: 'Agosto · Setembro', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Área de aprendizagem 3', k: '3.2', title: 'O integral definido',
          sub: 'Reconstruir uma quantidade, propriedades, teorema fundamental do cálculo', when: 'Setembro', ustd: 8 },
        { file: 'lb3-3.html', lb: 'Área de aprendizagem 3', k: '3.3', title: 'Áreas',
          sub: 'Entre o gráfico e o eixo Ox, entre dois gráficos', when: 'Fim de setembro · Outubro', ustd: 8 },
        { file: 'lb3-4.html', lb: 'Área de aprendizagem 3', k: '3.4', title: 'Integração numérica e aplicações',
          sub: 'Métodos dos retângulos e dos trapézios, problemas variados', when: 'Outubro · Novembro', ustd: 8 },
        { file: 'lb4-1.html', lb: 'Área de aprendizagem 4', k: '4.1', title: 'População e amostra',
          sub: 'Estimar e testar, média e variância amostrais', when: 'Novembro', ustd: 4 },
        { file: 'lb4-2.html', lb: 'Área de aprendizagem 4', k: '4.2', title: 'Testes de hipóteses',
          sub: 'Hipóteses, região de rejeição, erros de tipo I e de tipo II', when: 'Novembro · Dezembro', ustd: 8 },
        { file: 'wp1-1.html', lb: 'Área opcional 1', k: 'W.1', title: 'Retas e planos',
          sub: 'Equações vetoriais e paramétricas, vetor normal com o produto vetorial', when: 'Dezembro', ustd: 8 },
        { file: 'wp1-2.html', lb: 'Área opcional 1', k: 'W.2', title: 'Equação cartesiana e posições relativas',
          sub: 'Ponto, reta, plano: posição relativa, pontos de interseção, interseções com os eixos', when: 'Janeiro', ustd: 8 },
        { file: 'wp1-3.html', lb: 'Área opcional 1', k: 'W.3', title: 'Ângulos, prismas e pirâmides',
          sub: 'Ângulos entre retas e planos, áreas e volumes', when: 'Janeiro', ustd: 4 },
        { file: 'lb6.html', lb: 'Área de aprendizagem 6', k: '6', title: 'Mais aplicações',
          sub: 'Famílias de funções, parâmetros em sistemas de equações, custos e lucro, distâncias', when: 'Fim de janeiro · Fevereiro', ustd: 8 },
        { file: 'abi.html', lb: 'Abitur', k: 'A', title: 'Preparado para o Abitur',
          sub: 'Listas de verificação e exercícios no formato do Abitur dos três anos', when: 'Fevereiro · Abril', ustd: 0 }
    ]
};

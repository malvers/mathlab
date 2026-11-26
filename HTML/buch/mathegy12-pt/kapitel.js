/* kapitel.js — the chapters of the Portuguese edition (Portugal) of "Mathematik · Gymnasium 12" (buch/mathegy12/, Grundkurs),
 * in the order of the school year (Stoffverteilungsplan svp/mathe/mathegy12.html: LB 5 → Wahlbereich 5 → LB 6 → LB 7 → LB 8 → Abitur; 4 Ustd./week).
 * Book pt-8 (22.11.2026). Terms as in tools/buch-pt/glossario.md. Single source for the table of contents (index.html)
 * and the previous/next cards at the end of every chapter. No print edition yet (druck: false).
 */
window.BUCH = {
    title: 'Matemática · Gymnasium 12',
    short: 'Matemática GY 12',
    lang: 'pt',
    druck: false,
    description: 'Manual interativo de Matemática para o Gymnasium (escola secundária alemã de ensino geral), 12.º ano, Grundkurs (curso de nível básico), Saxónia: cálculo integral, da procura de primitivas até às áreas entre gráficos, integração numérica, estimação e testes de significância, distâncias e ângulos no espaço em verdadeiro 3D, distâncias mínimas, simetrias, famílias de funções e de retas e preparação para o Abitur, com laboratórios, simulações e autoavaliações com resposta imediata.',
    chapters: [
        { file: 'lb5-1.html', lb: 'Área de aprendizagem 5', k: '5.1', title: 'Primitivas e primitivação',
          sub: 'Derivar ao contrário, primitivas imediatas, regras de primitivação, composições lineares, CAS', when: 'Agosto · Setembro', ustd: 12 },
        { file: 'lb5-2.html', lb: 'Área de aprendizagem 5', k: '5.2', title: 'O integral definido',
          sub: 'Reconstruir uma quantidade a partir de taxas de variação, somas superiores e inferiores, propriedades, teorema fundamental, função integral', when: 'Setembro', ustd: 8 },
        { file: 'lb5-3.html', lb: 'Área de aprendizagem 5', k: '5.3', title: 'Áreas',
          sub: 'Área entre o gráfico e o eixo Ox, entre dois gráficos, limites desconhecidos, problemas em contexto', when: 'Setembro · Outubro', ustd: 8 },
        { file: 'wb5.html', lb: 'Área opcional 5', k: 'W', title: 'Integração numérica',
          sub: 'História do cálculo integral, métodos dos retângulos e dos trapézios, precisão', when: 'Outubro · Novembro', ustd: 8 },
        { file: 'lb6.html', lb: 'Área de aprendizagem 6', k: '6', title: 'Estatística inferencial',
          sub: 'Amostras, estimar proporções, média e variância, testes de significância unilaterais e bilaterais', when: 'Novembro', ustd: 12 },
        { file: 'lb7-1.html', lb: 'Área de aprendizagem 7', k: '7.1', title: 'Produto escalar, produto vetorial e equação normal',
          sub: 'Ângulo e projeção, vetor perpendicular e área, equação normal e equação cartesiana', when: 'Dezembro', ustd: 8 },
        { file: 'lb7-2.html', lb: 'Área de aprendizagem 7', k: '7.2', title: 'Ângulos de interseção',
          sub: 'Reta e reta, reta e plano, plano e plano, inclinações em sólidos', when: 'Janeiro', ustd: 8 },
        { file: 'lb7-3.html', lb: 'Área de aprendizagem 7', k: '7.3', title: 'Distâncias',
          sub: 'Ponto e ponto, pé da perpendicular, distância de um ponto a um plano, forma normal de Hesse, aplicações', when: 'Janeiro', ustd: 8 },
        { file: 'lb8-1.html', lb: 'Área de aprendizagem 8', k: '8.1', title: 'Distâncias mínimas e simetrias',
          sub: 'Função distância, ponto e reta, ponto e curva, simetria em relação a um ponto e a um plano, caminhos mais curtos', when: 'Fevereiro', ustd: 8 },
        { file: 'lb8-2.html', lb: 'Área de aprendizagem 8', k: '8.2', title: 'Áreas e famílias',
          sub: 'Áreas por três caminhos, famílias de funções e lugares geométricos, famílias de retas, exercícios integradores', when: 'Março', ustd: 12 },
        { file: 'abi.html', lb: 'Abitur', k: 'A', title: 'Preparado para o Abitur',
          sub: 'Listas de verificação, armadilhas e exercícios no formato do Abitur com matéria do 11.º e do 12.º anos', when: 'Abril', ustd: 0 }
    ]
};

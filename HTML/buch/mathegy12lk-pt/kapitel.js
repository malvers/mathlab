/* kapitel.js — the chapters of the Portuguese edition (Portugal) of "Mathematik · Gymnasium 12 · Leistungskurs" (buch/mathegy12lk/),
 * in the order of the school year (Stoffverteilungsplan svp/mathe/mathegy12lk.html: LB 5 → Wahlbereich 5 → LB 6 → LB 7 → LB 8 → LB 9 → Abitur; 5 Ustd./week).
 * Book pt-23 (27.11.2026), the sibling of mathegy12-pt (Grundkurs). Terms as in tools/buch-pt/glossario.md. Single source for the
 * table of contents (index.html) and the previous/next cards at the end of every chapter. No print edition yet (druck: false).
 */
window.BUCH = {
    title: 'Matemática · Gymnasium 12 · Leistungskurs',
    short: 'Matemática GY 12 LK',
    lang: 'pt',
    druck: false,
    description: 'Manual interativo de Matemática para o Gymnasium (escola secundária alemã de ensino geral), 12.º ano, Leistungskurs (curso de nível avançado), Saxónia: cálculo integral com função integral, teorema fundamental e sólidos de revolução em verdadeiro 3D, integração numérica até Simpson, variáveis aleatórias com distribuição normal e De Moivre-Laplace, estimação e testes de significância, distâncias e ângulos no espaço com a forma normal de Hesse e retas não complanares, extremos, simetrias, áreas ilimitadas, famílias e lugares geométricos e preparação para o Abitur, com laboratórios, simulações e autoavaliações com resposta imediata.',
    chapters: [
        { file: 'lb5-1.html', lb: 'Área de aprendizagem 5', k: '5.1', title: 'Primitivas e primitivação',
          sub: 'Derivar ao contrário, primitivas imediatas, composições lineares, funções compostas com CAS', when: 'Agosto · Setembro', ustd: 15 },
        { file: 'lb5-2.html', lb: 'Área de aprendizagem 5', k: '5.2', title: 'O integral definido e o teorema fundamental',
          sub: 'Reconstruir uma quantidade a partir de taxas de variação, grandezas físicas, somas de Riemann, propriedades, função integral, teorema fundamental com demonstração', when: 'Setembro', ustd: 10 },
        { file: 'lb5-3.html', lb: 'Área de aprendizagem 5', k: '5.3', title: 'Áreas e sólidos de revolução',
          sub: 'Área entre o gráfico e o eixo Ox e entre dois gráficos, volume de revolução em torno do eixo Ox, cone e esfera deduzidos', when: 'Outubro', ustd: 10 },
        { file: 'wb5.html', lb: 'Área opcional 5', k: 'W', title: 'Integração numérica',
          sub: 'História do cálculo integral, métodos dos retângulos e dos trapézios, regra dos barris de Kepler, Simpson, comparação dos métodos', when: 'Novembro', ustd: 10 },
        { file: 'lb6.html', lb: 'Área de aprendizagem 6', k: '6', title: 'Variáveis aleatórias com distribuição normal',
          sub: 'Curva de Gauss, função densidade e função de distribuição, valor médio e desvio padrão, regras σ, De Moivre-Laplace', when: 'Novembro', ustd: 10 },
        { file: 'lb7.html', lb: 'Área de aprendizagem 7', k: '7', title: 'Estatística inferencial',
          sub: 'Amostras, estimar proporções, média e variância, testes de significância unilaterais e bilaterais, nível de confiança', when: 'Dezembro', ustd: 15 },
        { file: 'lb8-1.html', lb: 'Área de aprendizagem 8', k: '8.1', title: 'Produto escalar, produto vetorial e forma normal de Hesse',
          sub: 'Ângulo e projeção, vetor perpendicular e área, equação normal e equação cartesiana, forma normal de Hesse para a reta e para o plano', when: 'Janeiro', ustd: 10 },
        { file: 'lb8-2.html', lb: 'Área de aprendizagem 8', k: '8.2', title: 'Ângulos de interseção',
          sub: 'Reta e reta, reta e plano, plano e plano, inclinações em sólidos', when: 'Janeiro', ustd: 5 },
        { file: 'lb8-3.html', lb: 'Área de aprendizagem 8', k: '8.3', title: 'Distâncias',
          sub: 'Ponto e ponto, ponto e plano, reta e plano, plano e plano, ponto e reta, retas não complanares', when: 'Fevereiro', ustd: 10 },
        { file: 'lb9-1.html', lb: 'Área de aprendizagem 9', k: '9.1', title: 'Distâncias e ângulos extremos, simetrias',
          sub: 'Função distância, ponto e curva, maior ângulo de visão, simetria em relação a um ponto e a um plano, caminhos mais curtos', when: 'Fevereiro · Março', ustd: 10 },
        { file: 'lb9-2.html', lb: 'Área de aprendizagem 9', k: '9.2', title: 'Áreas, densidade, famílias e lugares geométricos',
          sub: 'Áreas por três caminhos, áreas ilimitadas, densidade e probabilidade, famílias de funções, lugares geométricos, famílias de retas e de planos', when: 'Março', ustd: 10 },
        { file: 'abi.html', lb: 'Abitur', k: 'A', title: 'Preparado para o Abitur',
          sub: 'Listas de verificação, armadilhas e exercícios no formato do Abitur do Leistungskurs com matéria do 11.º e do 12.º anos', when: 'Abril', ustd: 0 }
    ]
};

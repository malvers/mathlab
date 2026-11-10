/* kapitel.js — the chapters of the Portuguese edition (Portugal) of "Mathematik · Berufliches Gymnasium 13 · Leistungskurs"
 * (buch/mathe13lk/), in the order of the school year (Lehrplan Berufliches Gymnasium Mathematik, Sachsen, version 2026,
 * Leistungskurs Jahrgangsstufe 13: LB 3 → LB 4 → LB 5 → Wahlpflicht 1 or Wahlpflicht 2 → LB 7 → Abiturvorbereitung).
 * Book pt-5 (10.11.2026), the sibling of mathe12-pt. Terms as in tools/buch-pt/glossario.md. Single source for the table
 * of contents (index.html) and the previous/next cards at the end of every chapter. No print edition yet (druck: false).
 */
window.BUCH = {
    title: 'Matemática · Berufliches Gymnasium 13 · Leistungskurs',
    short: 'Matemática 13 LK',
    lang: 'pt',
    druck: false,
    description: 'Manual interativo de Matemática para o Berufliches Gymnasium (escola secundária alemã de orientação profissional), 13.º ano, Leistungskurs (curso de nível avançado), Saxónia: cálculo integral com o teorema fundamental e sólidos de revolução, variáveis aleatórias com distribuição normal, estatística inferencial, as duas áreas opcionais – retas e planos no espaço ou matrizes com o modelo de Leontief e modelos populacionais –, mais aplicações e um capítulo de preparação para o Abitur, com laboratórios, simulações, gráficos 3D e autoavaliações com resposta imediata.',
    chapters: [
        { file: 'lb3-1.html', lb: 'Área de aprendizagem 3', k: '3.1', title: 'Primitivas',
          sub: 'Derivar ao contrário, verificação, regras de primitivação, 1/x e ln|x|, CAS', when: 'Agosto · Setembro', ustd: 10 },
        { file: 'lb3-2.html', lb: 'Área de aprendizagem 3', k: '3.2', title: 'O integral definido e o teorema fundamental',
          sub: 'Reconstruir uma quantidade, propriedades, função integral, teorema fundamental com demonstração', when: 'Setembro', ustd: 10 },
        { file: 'lb3-3.html', lb: 'Área de aprendizagem 3', k: '3.3', title: 'Áreas',
          sub: 'Entre o gráfico e o eixo Ox, entre dois gráficos, áreas com parâmetro', when: 'Outubro', ustd: 8 },
        { file: 'lb3-4.html', lb: 'Área de aprendizagem 3', k: '3.4', title: 'Integração numérica e sólidos de revolução',
          sub: 'Métodos dos retângulos e dos trapézios, volume de revolução em torno do eixo Ox', when: 'Outubro · Novembro', ustd: 10 },
        { file: 'lb4.html', lb: 'Área de aprendizagem 4', k: '4', title: 'Variáveis aleatórias com distribuição normal',
          sub: 'Curva de Gauss, função densidade e função de distribuição, valor médio, desvio padrão, regras σ', when: 'Novembro', ustd: 12 },
        { file: 'lb5-1.html', lb: 'Área de aprendizagem 5', k: '5.1', title: 'População e amostra',
          sub: 'Estimar e testar, média amostral e variância amostral', when: 'Dezembro', ustd: 5 },
        { file: 'lb5-2.html', lb: 'Área de aprendizagem 5', k: '5.2', title: 'Testes de significância',
          sub: 'Testes unilaterais e bilaterais, região de rejeição, erros de tipo I e de tipo II, nível de confiança', when: 'Dezembro · Janeiro', ustd: 10 },
        { file: 'wp1-1.html', lb: 'Área opcional 1', k: 'W1.1', title: 'Retas e planos',
          sub: 'Equações paramétricas, produto vetorial, equação cartesiana, forma normal de Hesse', when: 'Janeiro', ustd: 9 },
        { file: 'wp1-2.html', lb: 'Área opcional 1', k: 'W1.2', title: 'Posições relativas e ângulos',
          sub: 'Ponto, reta, plano: interseções, traços, retas de interseção, ângulos', when: 'Janeiro · Fevereiro', ustd: 9 },
        { file: 'wp1-3.html', lb: 'Área opcional 1', k: 'W1.3', title: 'Distâncias, prismas e pirâmides',
          sub: 'Distância ponto–plano, reta–plano, plano–plano, área da superfície e volume', when: 'Fevereiro', ustd: 7 },
        { file: 'wp2-1.html', lb: 'Área opcional 2', k: 'W2.1', title: 'Multiplicar e inverter matrizes',
          sub: 'Produto de matrizes, matriz identidade, matriz inversa, sistemas de equações com a inversa', when: 'Janeiro', ustd: 8 },
        { file: 'wp2-2.html', lb: 'Área opcional 2', k: 'W2.2', title: 'Relações de produção e o modelo de Leontief',
          sub: 'Gozintogramas, produção em várias fases, cálculo de custos, análise input-output', when: 'Janeiro · Fevereiro', ustd: 9 },
        { file: 'wp2-3.html', lb: 'Área opcional 2', k: 'W2.3', title: 'Modelos populacionais',
          sub: 'Matrizes de transição, potências de matrizes, matriz limite e vetor fixo, evolução cíclica', when: 'Fevereiro', ustd: 8 },
        { file: 'lb7-1.html', lb: 'Área de aprendizagem 7', k: '7.1', title: 'Equações biquadradas e famílias de funções',
          sub: 'Substituição, famílias, parâmetros e número de soluções, lugares geométricos', when: 'Fevereiro · Março', ustd: 8 },
        { file: 'lb7-2.html', lb: 'Área de aprendizagem 7', k: '7.2', title: 'Parâmetros e extremos no espaço e na economia',
          sub: 'Sistemas de equações com parâmetro, matrizes de rotação, distâncias mínimas, custo, receita e lucro', when: 'Março', ustd: 7 },
        { file: 'abi.html', lb: 'Abitur', k: 'A', title: 'Preparado para o Abitur',
          sub: 'Listas de verificação, armadilhas e exercícios no formato do Abitur do Leistungskurs do 11.º, 12.º e 13.º anos', when: 'Março · Abril', ustd: 0 }
    ]
};

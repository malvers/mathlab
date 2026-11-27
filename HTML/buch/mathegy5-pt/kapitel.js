/* kapitel.js — the chapters of the Portuguese edition (Portugal) of "Mathematik · Gymnasium 5" (buch/mathegy5/), in the
 * order of the school year (Stoffverteilungsplan svp/mathe/mathegy5.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich 3;
 * 4 Ustd./week, 104 + 8 Ustd.). Doc, 27.11.2026 (block pt-21). Terms as in tools/buch-pt/glossario.md, sections mathe5-pt,
 * mathegy6-pt and mathegy5-pt. Single source for the table of contents (index.html) and the previous/next cards at the end
 * of every chapter. No print edition yet (druck: false).
 */
window.BUCH = {
    title: 'Matemática · Gymnasium 5',
    short: 'Matemática GY 5',
    lang: 'pt',
    druck: false,
    description: 'Manual interativo de Matemática para o Gymnasium (escola alemã que conduz ao Abitur), 5.º ano, Saxónia: números grandes, arredondamentos, propriedades das operações, potências, divisores e números primos, frações, números decimais e percentagens, coordenadas, ângulos, simetria e reflexão, retângulos e paralelepípedos, grandezas do dia a dia e a numeração dos egípcios, dos romanos e dos maias, com laboratórios, simulações e autoavaliações com resposta imediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizagem 1', k: '1.1', title: 'Números grandes',
          sub: 'Quadro de ordens e classes, reta numérica, estimar, arredondar, comparar e ordenar', when: 'Agosto · Setembro', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Área de aprendizagem 1', k: '1.2', title: 'Cálculo com números naturais',
          sub: 'Propriedades das operações e cálculo com jeito, estimativa, potências, divisão', when: 'Setembro', ustd: 12 },
        { file: 'lb1-3.html', lb: 'Área de aprendizagem 1', k: '1.3', title: 'Divisores e números primos',
          sub: 'Divisores e múltiplos, critérios de divisibilidade, o crivo de Eratóstenes, fatores primos', when: 'Setembro · Outubro', ustd: 3 },
        { file: 'lb2-1.html', lb: 'Área de aprendizagem 2', k: '2.1', title: 'Frações',
          sub: 'Representar partes, simplificar e escrever frações equivalentes, frações próprias e impróprias, comparar', when: 'Novembro', ustd: 12 },
        { file: 'lb2-2.html', lb: 'Área de aprendizagem 2', k: '2.2', title: 'Números decimais e percentagens',
          sub: 'Décimas, centésimas, milésimas, converter, percentagens, ordenar e arredondar', when: 'Novembro · Dezembro', ustd: 8 },
        { file: 'lb2-3.html', lb: 'Área de aprendizagem 2', k: '2.3', title: 'Cálculo com números decimais',
          sub: 'Adicionar e subtrair, deslocar a vírgula, multiplicar e dividir, média', when: 'Dezembro', ustd: 7 },
        { file: 'lb3-1.html', lb: 'Área de aprendizagem 3', k: '3.1', title: 'Coordenadas e ângulos',
          sub: 'Referencial cartesiano, retas paralelas e perpendiculares, medir ângulos, tipos de ângulos, pares de ângulos', when: 'Janeiro · Fevereiro', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Área de aprendizagem 3', k: '3.2', title: 'Simetria e reflexão',
          sub: 'Padrões, simetria axial e simetria central, translação, rotação, reflexão axial', when: 'Fevereiro · Março', ustd: 10 },
        { file: 'lb4-1.html', lb: 'Área de aprendizagem 4', k: '4.1', title: 'Retângulos',
          sub: 'Perímetro e área, unidades de área, figuras compostas', when: 'Março · Abril', ustd: 8 },
        { file: 'lb4-2.html', lb: 'Área de aprendizagem 4', k: '4.2', title: 'Paralelepípedos',
          sub: 'Vistas, perspetiva cavaleira, planificação, volume, unidades de capacidade, área total, projeto embalagens', when: 'Abril · Maio', ustd: 14 },
        { file: 'lb5.html', lb: 'Área de aprendizagem 5', k: '5', title: 'A Matemática no dia a dia',
          sub: 'Converter grandezas, valores aproximados, horários, problemas de Fermi, um projeto', when: 'Maio · Junho', ustd: 10 },
        { file: 'wb.html', lb: 'Área opcional', k: 'O', title: 'Contar e calcular – antes e agora',
          sub: 'Egípcios, romanos e maias, Adam Ries, o sistema binário', when: 'Junho', ustd: 8 }
    ]
};

/* kapitel.js — the chapters of the Portuguese edition (Portugal) of "Mathematik · Gymnasium 9" (buch/mathegy9/), in the
 * order of the school year (Stoffverteilungsplan svp/mathe/mathegy9.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich;
 * 4 Ustd./week, 104 + 8 Ustd.). Doc, 27.11.2026 (block pt-13). Terms as in tools/buch-pt/glossario.md, section mathegy9-pt.
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition yet (druck: false).
 */
window.BUCH = {
    title: 'Matemática · Gymnasium 9',
    short: 'Matemática GY 9',
    lang: 'pt',
    druck: false,
    description: 'Manual interativo de Matemática para o Gymnasium (escola alemã que conduz ao Abitur), 9.º ano, Saxónia: potências e raízes, funções potência, funções quadráticas e equações do 2.º grau, problemas de otimização, círculo, cilindro e esfera, o teorema de Pitágoras, trigonometria no triângulo retângulo, pirâmide e cone, análise de dados e a secção áurea, com laboratórios, simulações e autoavaliações com resposta imediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizagem 1', k: '1.1', title: 'Potências e raízes',
          sub: 'Potenciação e radiciação, regras das potências com expoentes racionais, equações com radicais', when: 'Agosto · Setembro', ustd: 12 },
        { file: 'lb1-2.html', lb: 'Área de aprendizagem 1', k: '1.2', title: 'Funções potência',
          sub: 'Expoentes inteiros e racionais, simetria, zeros e polos, assíntotas', when: 'Setembro', ustd: 12 },
        { file: 'lb1-3.html', lb: 'Área de aprendizagem 1', k: '1.3', title: 'Parâmetros e funções quadráticas',
          sub: 'Dilatar, transladar, refletir, parábola de referência e forma canónica, completar o quadrado', when: 'Outubro', ustd: 8 },
        { file: 'lb1-4.html', lb: 'Área de aprendizagem 1', k: '1.4', title: 'Equações do 2.º grau e extremos',
          sub: 'Fórmula resolvente, binómio discriminante, relações de Viète, problemas de otimização com o vértice', when: 'Novembro', ustd: 16 },
        { file: 'lb2.html', lb: 'Área de aprendizagem 2', k: '2', title: 'Círculo, cilindro e esfera',
          sub: 'Arco e setor circular, área da superfície, volume e massa, Arquimedes', when: 'Dezembro', ustd: 8 },
        { file: 'lb3-1.html', lb: 'Área de aprendizagem 3', k: '3.1', title: 'O teorema de Pitágoras e as relações métricas',
          sub: 'Teorema e demonstração, distâncias no plano e no espaço, teoremas da altura e dos catetos, recíproco', when: 'Janeiro · Fevereiro', ustd: 16 },
        { file: 'lb3-2.html', lb: 'Área de aprendizagem 3', k: '3.2', title: 'Trigonometria no triângulo retângulo',
          sub: 'Seno, cosseno e tangente, lados e ângulos, áreas, polígonos regulares e π', when: 'Fevereiro · Março', ustd: 12 },
        { file: 'lb3-3.html', lb: 'Área de aprendizagem 3', k: '3.3', title: 'Pirâmide e cone',
          sub: 'Área total e volume, projeto medição de terrenos', when: 'Março', ustd: 4 },
        { file: 'lb4.html', lb: 'Área de aprendizagem 4', k: '4', title: 'Analisar dados',
          sub: 'Moda, mediana, média, dispersão, histogramas, truques estatísticos', when: 'Abril', ustd: 12 },
        { file: 'lb5.html', lb: 'Área de aprendizagem 5', k: '5', title: 'A matemática e as tecnologias de cálculo modernas',
          sub: 'Resolver um problema com uma folha de cálculo e um CAS', when: 'Maio', ustd: 4 },
        { file: 'wb.html', lb: 'Área opcional', k: 'O', title: 'A secção áurea',
          sub: 'Dedução, construção, pentagrama, arte e arquitetura', when: 'Maio · Junho', ustd: 8 }
    ]
};

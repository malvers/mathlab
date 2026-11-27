/* kapitel.js — the chapters of the Portuguese edition (Portugal) of "Mathematik · Gymnasium 10" (buch/mathegy10/), in the
 * order of the school year (Stoffverteilungsplan svp/mathe/mathegy10.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich;
 * 4 Ustd./week). Doc, 27.11.2026 (block pt-20). Terms as in tools/buch-pt/glossario.md, section mathegy10-pt.
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition yet (druck: false).
 */
window.BUCH = {
    title: 'Matemática · Gymnasium 10',
    short: 'Matemática GY 10',
    lang: 'pt',
    druck: false,
    description: 'Manual interativo de Matemática para o Gymnasium (escola alemã que conduz ao Abitur), 10.º ano, Saxónia: crescimento e funções exponenciais, fenómenos periódicos e a função seno, variáveis aleatórias, valor médio e jogos equitativos, lei dos senos e lei dos cossenos, logaritmo e equações exponenciais, tangente, panorama das funções, sucessões e limites, cálculo de juros e números complexos, com laboratórios, simulações e autoavaliações com resposta imediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizagem 1', k: '1.1', title: 'Crescimento e funções exponenciais',
          sub: 'Linear, exponencial, limitado, recursivo e explícito, parâmetros e regressão', when: 'Agosto · Setembro', ustd: 12 },
        { file: 'lb1-2.html', lb: 'Área de aprendizagem 1', k: '1.2', title: 'Fenómenos periódicos e a função seno',
          sub: 'Período, amplitude, linha média, graus e radianos, parâmetros da função seno', when: 'Setembro · Outubro', ustd: 10 },
        { file: 'lb2-1.html', lb: 'Área de aprendizagem 2', k: '2.1', title: 'Variáveis aleatórias e regras do diagrama em árvore',
          sub: 'Distribuições de probabilidades, diagrama de barras, «exatamente k», «pelo menos k», «no máximo k»', when: 'Novembro', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Área de aprendizagem 2', k: '2.2', title: 'Valor médio e jogos equitativos',
          sub: 'Valor médio, variância e desvio padrão, jogos equitativos e não equitativos', when: 'Novembro', ustd: 8 },
        { file: 'lb3-1.html', lb: 'Área de aprendizagem 3', k: '3.1', title: 'Lei dos senos, lei dos cossenos e área',
          sub: 'Triângulos quaisquer, o caso ambíguo, Pitágoras como caso particular, a fórmula da área com o seno', when: 'Dezembro', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Área de aprendizagem 3', k: '3.2', title: 'Cálculos em triângulos e sólidos',
          sub: 'Plano de resolução, medições, pirâmide e cone, problemas da vida real', when: 'Janeiro', ustd: 8 },
        { file: 'lb4-1.html', lb: 'Área de aprendizagem 4', k: '4.1', title: 'Função inversa e logaritmo',
          sub: 'Invertibilidade, reflexão na reta y = x, o logaritmo, regras dos logaritmos', when: 'Janeiro · Fevereiro', ustd: 12 },
        { file: 'lb4-2.html', lb: 'Área de aprendizagem 4', k: '4.2', title: 'Funções logarítmicas e equações exponenciais',
          sub: 'Gráfico e propriedades, equações exponenciais, tempo de duplicação e meia-vida', when: 'Março', ustd: 8 },
        { file: 'lb4-3.html', lb: 'Área de aprendizagem 4', k: '4.3', title: 'Operações com funções, composição e a função tangente',
          sub: 'Soma, produto, quociente, função interior e exterior, tangente com polos', when: 'Março', ustd: 8 },
        { file: 'lb4-4.html', lb: 'Área de aprendizagem 4', k: '4.4', title: 'Panorama das funções',
          sub: 'Classificar famílias de funções, fichas de identidade, esboçar gráficos sem calculadora', when: 'Abril', ustd: 8 },
        { file: 'lb4-5.html', lb: 'Área de aprendizagem 4', k: '4.5', title: 'Sucessões e limites',
          sub: 'Termo geral e definição por recorrência, monotonia, majorantes e minorantes, limite, circunferência em forma paramétrica', when: 'Abril', ustd: 6 },
        { file: 'lb5.html', lb: 'Área de aprendizagem 5', k: '5', title: 'Cálculo de juros',
          sub: 'Juros e juro composto, crédito e plano de amortização, quanto custa realmente um crédito', when: 'Maio', ustd: 4 },
        { file: 'wb.html', lb: 'Área opcional', k: 'O', title: 'Números complexos',
          sub: 'Unidade imaginária, cálculo em ℂ, plano de Argand, módulo e argumento', when: 'Maio · Junho', ustd: 8 }
    ]
};

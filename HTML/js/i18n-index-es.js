/**
 * i18n extension for Index/Dashboard page — Español (es).
 * Loaded by js/i18n-index.js (loader) for the ACTIVE language only —
 * never referenced directly from HTML. One file per language.
 */
(function () {
    if (typeof CyberI18n === 'undefined') {
        console.error("CyberI18n not found! Load i18n.js before i18n-index-es.js");
        return;
    }
    const t = (CyberI18n.translations.es = CyberI18n.translations.es || {});
    t.index = {
            admin_gate: {
                title: "VERIFICAR AUTORIZACIÓN",
                pwd_placeholder: "Contraseña",
                access: "ACCESO",
                cancel: "CANCELAR"
            },
            ui: {
                coffee_title: "Invitar a un Cyber-Café",
                about_title: "Intro Cinemática — Doc Alvers",
                qr_title: "Código QR de esta página",
                sound_title: "Sonido Ambiente",
                search_placeholder: "INICIAR ESCANEO DE LABORATORIO...",
                mission_start: "Iniciar Misión",
                all_tools: "Todas las Herramientas",
                tools_subtitle_word: "Herramientas",
                tools_filter_hits: "RESULTADOS",
                tools_no_results: "Sin resultados para «{query}»",
                search_no_terms: "sin resultados",
                tools_close_aria: "Cerrar la vista de herramientas y volver a la selección de laboratorios",
                tools_footer_aria: "Pie de página",
                tools_universe_aria: "Abrir Universe · galería de laboratorios en el espacio",
                tools_doc_title: "Cyber-Laboratorio | Mission Control",
                education: "EDUCACIÓN",
                games: "Juegos",
                lgs: "Sistemas de Ecuaciones",
                pythagoras: "Pitágoras",
                triangles: "Triángulos",
                arithmetic: "Aritmética Básica",
                hot_stuff: "Cosas interesantes",
                neu: "Nuevo",
                apps: "Apps",
                fun: "Diversión",
                functions: "Funciones",
                highlights: "Destacados",
                fraktale: "Fractales",
                university: "Universidad",
                themes_count: "Temas",
                themes_top5_title: "Top Labs",
                grade_title: "Año",
                grade_uni: "Uni",
                grade_uni_tip: "Universidad · laboratorios particularmente complejos (Análisis, Física, Fractales, …)",
                grade_back_tip: "Volver a la selección de temas",
                universe_tip: "Universe · Galería de laboratorios en el espacio",
                credits: "CRÉDITOS",
                impressum: "AVISO LEGAL"
            },
            contact: {
                title: "Contacto",
                desc: "¿Tienes preguntas, comentarios o ideas para nuevos módulos de laboratorio? Espero tu mensaje, ya sea sobre matemáticas, conceptos didácticos o cooperación técnica.",
                close: "CERRAR"
            },
            qr: {
                title: "Código QR",
                desc: "Escanea con tu móvil – llévate esta página contigo."
            },
            donate: {
                title: "Invitar a un Cyber-Café",
                desc: "¿Te gustan los laboratorios interactivos y quieres apoyar el desarrollo del Cyber-Laboratorio? ¡Agradezco cada café virtual que me mantiene despierto programando por la noche! ☕️🚀",
                paypal: "DONAR AHORA CON PayPal"
            },
            header: {
                title: "Doc Alvers Mathe-Labor",
                subtitle: "EL UNIVERSO INTERACTIVO DE LAS MATEMÁTICAS",
                author: "GOOD VIBES por Dr. Michael R. Alvers"
            },
            view: {
                back_title: "Volver",
                title: "VISTA DE LABORATORIO"
            },
            admin: {
                active: "MODO DE EDICIÓN ACTIVO",
                export: "Exportar Cambios",
                exit: "Salir"
            },
            labs: {
                "fourier": { title: "Transformada de Fourier", description: "La música de las matemáticas. Descomponga formas complejas en oscilaciones circulares armónicas." },
                "mandelbrot-deep": { title: "Fractales", description: "Conjuntos de Mandelbrot y Julia en el plano complejo: dinámica de tiempo de escape de z↦z²+c mediante iteración en shader de fragmentos en GPU; exploración paramétrica de c con profundidad adaptativa en la frontera fractal." },
                "atomorbitale": { title: "Orbitales Atómicos", description: "Armónicos esféricos Y_ℓ^m in 3D: nubes de probabilidad y números cuánticos." },
                "galtonboard": { title: "Tablero de Galton", description: "Simulación interactiva de la distribución normal. Observe la curva de campana en vivo." },
                "opti-lens": { title: "Optimización de Lentes", description: "Optimización evolutiva de lentes (CMA-ES): simulación de rayos en tiempo real." },
                "addition": { title: "Suma Escrita", description: "Aprenda la suma escrita paso a paso. Visualiza la estructura de columnas." },
                "subtraktion": { title: "Resta Escrita", description: "Entrene la resta escrita con acarreo paso a paso." },
                "multiplikation": { title: "Multiplicación Escrita", description: "Visualiza la multiplicación escrita paso a paso." },
                "dividieren": { title: "División Escrita", description: "Domine la división escrita con el laboratorio interactivo ULTRA." },
                "cmaes": { title: "Optimización de Superficies", description: "CMA-ES in tiempo real: mejora evolutiva de polígonos cerrados y contornos libres." },
                "transformationen": { title: "Congruencia", description: "Explore la rotación, traslación y escalado de un triángulo de forma interactiva." },
                "winkelsumme3d": { title: "Suma de Ángulos 3D", description: "Experimente la suma de ángulos en el espacio 3D. Visualización dinámica." },
                "ausgleichsgerade": { title: "Línea de Ajuste", description: "Encuentre la mejor línea a través de una nube de puntos. Entienda la regresión." },
                "binomischeslabor": { title: "1ª Fórmula Binomial", description: "Visualice fórmulas binomiales geométricamente mediante descomposición de áreas." },
                "triangulierer": { title: "Delaunay", description: "Algoritmos de triangulación. Genere mallas de triángulos óptimas." },
                "differentiallabor": { title: "Laboratorio Diferencial", description: "Domine el cálculo diferencial. Relación entre función y derivada." },
                "parabellabor": { title: "Parábolas", description: "Manipulación de funciones cuadráticas. Entienda la influencia de los parámetros." },
                "potenzlabor": { title: "Laboratorio de Potencias", description: "Explore el comportamiento de las funciones de potencia y raíz de forma interactiva." },
                "steigung": { title: "Laboratorio de Pendientes", description: "Entienda la pendiente en cualquier punto de una curva. Base del análisis." },
                "winkellabor": { title: "Laboratorio de Ángulos", description: "Investigación interactiva de sumas de ángulos y tipos de triángulos." },
                "uhrzeitwinkel": { title: "Laboratorio de Reloj de Ángulos", description: "Examine el ángulo entre las manecillas del reloj en cualquier momento del día." },
                "logikspiel": { title: "Puzzle de Números", description: "¡Conviértase en un maestro de la matriz! Resuelva cuadrículas de números complejas." },
                "integralreaktor": { title: "Integrales", description: "La energía del área. Visualice sumas de Riemann y métodos de aproximación." },
                "lissajous": { title: "Lissajous", description: "Superposición de dos oscilaciones armónicas: frecuencia y fase." },
                "cool-squares": { title: "Cuadrados Geniales", description: "La prueba geométrica definitiva. Siga la espiral de cuadrados." },
                "fibonacci": { title: "Laboratorio Fibonacci", description: "Explore la espiral dorada y los patrones de crecimiento orgánico." },
                "fermatpunkt": { title: "Punto de Fermat", description: "Encuentre el punto con la suma mínima de distancias a los vértices." },
                "gleichungssysteme": { title: "Laboratorio de SLE", description: "Explore sistemas de ecuaciones lineales visualmente a través de líneas." },
                "pythagoras": { title: "Pitágoras", description: "Descubra el teorema de Pitágoras a través de comparaciones interactivas de áreas." },
                "pythagorasbeweis": { title: "Prueba de Pitágoras", description: "Prueba geométrica del teorema de Pitágoras mediante descomposición de áreas." },
                "gleichschenkligesDreieck": { title: "Triángulo Isósceles", description: "Calcule triángulos especiales y sus propiedades de forma interactiva." },
                "eulergerade": { title: "Euler Feuerbach y Napoleon", description: "La fascinante geometría del triángulo: recta de Euler y círculo de Feuerbach." },
                "easyhard": { title: "Puzzle de Geometría", description: "Un acertijo geométrico desafiante. Determine el ángulo que falta." },
                "winkelsumme": { title: "Laboratorio de Polígonos", description: "Calcule la suma de los ángulos en cualquier n-ágono." },
                "beweisinwinkellsumme": { title: "Prueba del Ángulo Interior", description: "¿Por qué la suma de los ángulos de un triángulo es siempre 180°? La prueba paso a paso." },
                "butterfly": { title: "Curva de Mariposa", description: "Una fascinante curva trascendente definida por coordenadas polares." },
                "heart3d": { title: "Superficie de Corazón 3D", description: "Visualización de una superficie 3D implícita detrás del corazón matemático." },
                "litchi3d": { title: "Laboratorio de Litchi 3D", description: "Explore interactivamente las complejas matemáticas de superficies 3D." },
                "cinematic-intro": { title: "Intro Cinemática", description: "Experimente el monumental comienzo del laboratorio del Doc Alvers. Identidad visual ULTRA v5.3.8." },
                "stanford-portal": { title: "Stanford University", description: "Universidad de investigación de élite en Silicon Valley: investigación de vanguardia, ideas abiertas y cultura de campus." },
                "happy-birthday-ulf": { title: "¡Feliz Cumpleaños Ulf!", description: "Una sorpresa matemática para el cumpleaños. ¡Celebra con el Doc Alvers!" }
            ,
                "einsundeins": { title: "1 + 1 = 2", description: "Una sola operación, cuatro niveles más abajo: lenguaje de alto nivel, ensamblador, bytes de máquina y un sumador completo hecho de puertas lógicas. La misma información en cada nivel, solo una abstracción más profunda." },
                "solita": { title: "Solita", description: "Solita: tu asistente personal de voz (Claude) en el Laboratorio de Matemáticas de Doc Alvers. Habla, escucha lecturas en voz alta, conserva el contexto." },
                "gameoflife": { title: "Game of Life", description: "El autómata celular de Conway: de tres reglas simples surgen planeadores, osciladores y mundos enteros. Dibuja un patrón inicial y observa cómo se alternan el orden y el caos." },
                "burningship": { title: "Burning Ship", description: "El fractal hermano oscuro del conjunto de Mandelbrot: un solo valor absoluto en la fórmula de iteración hace aparecer barcos en llamas en el horizonte. Amplía la estructura ardiente." },
                "reaction-diffusion": { title: "Reacción-Difusión", description: "Patrones de Turing en vivo: dos sustancias reaccionan y se difunden, y salen rayas, puntos y corales como en las pieles de los animales. Ajusta aporte y desintegración y cultiva tus propios patrones." },
                "gravitation": { title: "Gravitación", description: "La ley de la gravitación de Newton para tocarla: coloca masas en el espacio, dales una velocidad inicial y observa órbitas, capturas y colisiones en la danza de muchos cuerpos." },
                "glocken": { title: "Las campanas de Bagdad", description: "¿Cuándo suenan todas las campanas a la vez? Una historia de Bagdad conduce al mínimo común múltiplo, con un tutor que te acompaña paso a paso hasta el m.c.m. y las fracciones." },
                "langley": { title: "Laboratorio Langley", description: "El famoso problema del ángulo de Langley de 1922: un triángulo isósceles, dos líneas interiores y un ángulo que lleva cien años incomodando al mundo. Mide, prueba, demuestra." },
                "batman": { title: "Curva de Batman", description: "Una sola ecuación cuyo gráfico dibuja el logotipo de Batman: valores absolutos, raíces y distinciones de casos como matemática de superhéroes. Descompón la fórmula pieza a pieza." },
                "worldclock": { title: "Reloj mundial", description: "La Tierra como reloj: husos horarios, posición del Sol y línea día-noche en vivo sobre el mapamundi. Mira dónde amanece mientras aquí es medianoche." },
                "tracker": { title: "Doc Alvers Tracker", description: "Seguimiento por GPS como aplicación web: registra rutas con perfil de altitud, puntos de foto, voz y conocimiento, radar de lluvia y uso compartido en vivo. Funciona en el navegador y como aplicación Android." },
                "kaimbo": { title: "Kaimbo Studio", description: "Aprender idiomas con tus propias listas de tareas: organiza, filtra y practica vocabulario y frases como series de tareas. El estudio de la herramienta de idiomas de Doc, ahora en el navegador." },
                "pagode": { title: "Pagoda (230 SL)", description: "Un Mercedes 230 SL de 1964 se encuentra con Bluetooth: arranca el motor por radio, prueba canales, explora un esquema eléctrico interactivo, y Solita aprende a conducir. Electricidad clásica con mando a distancia por IA." },
                "voicerecorder": { title: "Grabadora de voz", description: "Grabar y transcribir en vivo: habla y el programa escucha, escribe y guarda. En el navegador con la Web Speech API, como aplicación Android con reconocimiento de voz nativo." },
                "mathtrainer": { title: "MathTrainer", description: "Practicar matemáticas con series de tareas: entrena el cálculo mental y los ejercicios escolares, elige una serie y aumenta el ritmo. School is cool: el SchoolTrainer como aplicación web." },
                "pinkerfinder": { title: "PinkerFinder", description: "El Finder de macOS recreado 1:1 — más facetas de búsqueda: tamaños de carpeta en la lista, duplicados por contenido, búsqueda por facetas en todo el Mac, actualización en vivo. App nativa para Mac, descarga gratuita." },
                "imaginarynumbers": { title: "Números imaginarios", description: "Números complejos en el plano de Gauss: parte real, parte imaginaria y la unidad imaginaria, para explorar de forma interactiva." },
                "kovarianz": { title: "Covarianza", description: "Una aplicación lineal A estira, gira y cizalla el plano. Aplicada a una nube de puntos redonda se convierte en una elipse — y justo su forma está en la matriz de covarianza: de Σ₀ = σ²E surge Σ = A Σ₀ Aᵀ. Ajusta la matriz celda a celda o arrastra la elipse imagen por su manilla; Σ, la correlación y los vectores propios como ejes principales se calculan en vivo a partir de los puntos dibujados. Con distribución normal y uniforme, coordenadas homogéneas y paralelas que muestran qué hace la aplicación con las rectas." },
                "irisvis": { title: "Conway's Iris", description: "Prolonga en cada vértice ambos lados por la longitud del lado opuesto: los seis extremos están sobre una circunferencia centrada en el incentro, R = √(r²+(s+d)²). Seis arcos tipo limpiaparabrisas forman con ellos una curva de anchura constante; un cuadrado la encierra en cualquier giro y CMA-ES busca su posición en vivo. Con vistas de demostración, mapa de calor del paisaje de búsqueda y el triángulo de Reuleaux con solo pulsar un botón." },
                "ascii": { title: "Arte ASCII", description: "Las imágenes son números: divide en celdas una foto, la imagen en vivo de la cámara o un ejemplo, calcula el valor de gris y elige el carácter — como caracteres, en color, en semitono o en braille, con dithering. Al hacer clic en un carácter se muestra el cálculo completo de esa celda; en el nivel 2 el alumnado escribe por sí mismo la asignación valor de gris → carácter." },
                "neuroaddierer": { title: "El sumador aprendido", description: "En el laboratorio 1 + 1 = 2 los sumadores completos están cableados; aquí no hay ningún cable. Una diminuta red neuronal de 32 números solo ve las ocho filas de la tabla de verdad y debe descubrir por sí misma cómo sumar: por evolución (CMA-ES), sin derivadas. Después ocho copias de la red aprendida calculan en serie cualquier suma hasta 255 — y se ve que sus salidas nunca son exactamente 0 o 1, sino 0,03 y 0,97." },
                "shell": { title: "Shell", description: "¿Cómo surge el patrón de un caracol marino? Seis capítulos construyen el mecanismo pieza a pieza: la imagen es un registro — una célula se enciende y escribe una V — dos ondas se aniquilan y cortan la punta de una tienda — el sustrato consumido explica por qué. Arriba vive el borde de la abertura, debajo crece la concha. Con botón de paso a paso." },
                "conuslab": { title: "Conus", description: "¿Por qué lleva un cono zigzags y tiendas? La concha solo crece en el borde de la abertura: una única fila de células decide «pigmento sí/no», y cada línea de crecimiento queda fijada para siempre. El patrón es, por tanto, un diagrama espacio-tiempo. Aquí ocurre en vivo: ondas de pigmento que viajan, se aniquilan al chocar y recortan así las tiendas — al lado, el mismo efecto como autómata celular (regla 30)." },
                "costablanca": { title: "Lo mejor de la Costa Blanca", description: "Excursiones por la Costa Blanca para ir tachando: 22 destinos documentados de Altea a Valencia con fotos, consejos de quien vive allí y barra de progreso — en cuatro idiomas (DE/EN/ES/IT)." },
                "bb84": { title: "BB84", description: "Intercambio cuántico de claves según Bennett y Brassard: Alice envía fotones individuales, cada uno en una de dos bases — + con los estados — y |, o × con / y \\. Bob elige su base al azar: la misma base da un resultado seguro, otra base da puro azar. Al pasar por encima de una columna se explica justo ese fotón. Con la espía Eve la tasa de error en la parte comparada públicamente sube a un cuarto — la probabilidad de detección es 1 − (3/4)^m, y mil rondas con un botón muestran que es realmente así. Además, un modo de enseñanza que recorre todos los casos una vez." },
                "jacquard": { title: "Jacquard", description: "Un telar de 1805, en 3D — la primera máquina que fabrica una imagen a partir de un plan escrito. Una tarjeta perforada controla cada hilo de urdimbre por separado: donde hay un agujero, la aguja pasa, el gancho se queda y la cuchilla levanta el hilo; donde hay cartón, el hilo baja y la trama azul lo cubre. Tarjeta a tarjeta, la imagen sale de la máquina. Motivo y máquina son dos cosas distintas: el mismo círculo sale más redondo con más hilos, y donde el dibujo es más fino que el tejido, el telar teje un patrón que no existe en el original." },
                "koerper": { title: "Cuerpos", description: "Sólidos platónicos, arquimedianos y de Catalan, prismas, antiprismas, pirámides y formas redondas — giratorios en 3D, con área, volumen, radios de la esfera circunscrita, tangente a las aristas e inscrita, ángulos diedros y fórmulas en vivo según la longitud de arista. Cada cuerpo se despliega en su desarrollo con un deslizador; los sólidos de Catalan surgen como duales de los arquimedianos por polaridad respecto a la esfera tangente a las aristas." },
                "kreisteilung": { title: "División del círculo", description: "n puntos sobre una circunferencia y todas las cuerdas trazadas: ¿en cuántas regiones se parte el disco? 1, 2, 4, 8, 16 … y después 31, no 32. El laboratorio no cuenta con una fórmula, sino que recorre el grafo real de arcos y trozos de cuerda. Por eso muestra también el caso degenerado: el hexágono regular solo da 30 regiones, porque tres diagonales se cortan en el centro. Arrastra un punto por la circunferencia y verás el salto de 30 a 31." },
                "brahmagupta": { title: "Teorema de Brahmagupta", description: "Un cuadrilátero cíclico cuyas diagonales se cortan perpendicularmente — y dos afirmaciones sobre él, ambas de Brahmagupta (siglo VII, India). El teorema: si desde el punto de corte P de las diagonales se traza la perpendicular a un lado y se prolonga más allá de P, corta el lado opuesto exactamente en su punto medio — porque P forma con los dos extremos un triángulo rectángulo y el pie de la perpendicular es su circuncentro. La fórmula: K = √((s−a)(s−b)(s−c)(s−d)) da el área, pero solo mientras los cuatro vértices estén sobre la circunferencia. Si se apartan de ella, K resulta demasiado grande — la fórmula de Herón para cuadriláteros, con una condición." }
            }
    };
})();

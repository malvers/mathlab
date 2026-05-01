/**
 * i18n extension for Credits page
 */
(function() {
    if (typeof CyberI18n === 'undefined') {
        console.error("CyberI18n not found! Load i18n.js before i18n-credits.js");
        return;
    }

    const creditsTranslations = {
        de: {
            title: "CREDITS",
            subtitle: "Genutzte oder erwähnte KI‑ und Medienwerkzeuge (ohne vollständige Ansprüche).",
            cursor_desc: "KI‑gestützter Editor / IDE für Entwicklung mit eingebauten Agenten.",
            gemini_desc: "Googles multimodales KI‑Modell (Chat, Reasoning, Tools).",
            codex_desc: "OpenAI Codex: Coding‑Agent / CLI für automatisierte Programmieraufgaben.",
            runway_desc: "KI‑Plattform für Video (Gen‑4 u. a.), Bild und Audio.",
            ideogram_desc: "KI‑Bildgenerator, oft mit gut lesbarem Text im Bild.",
            stanford_desc: "Auf der <strong>Universität</strong>-Themenkachel das Stanford-<strong>Cardinal-Block-S</strong> (Baum im „S“, Cardinal <code>#8c1515</code>) — Grafik aus <a href=\"https://commons.wikimedia.org/wiki/File:Stanford_Cardinal_logo.svg\" target=\"_blank\" rel=\"noopener noreferrer\">Wikimedia Commons</a>; Marke <strong>Stanford University</strong>. Marken- und Nutzungsregeln: <a href=\"https://identity.stanford.edu\" target=\"_blank\" rel=\"noopener noreferrer\">identity.stanford.edu</a>",
            back: "zurück"
        },
        en: {
            title: "CREDITS",
            subtitle: "AI and media tools used or mentioned (non-exhaustive list).",
            cursor_desc: "AI-powered editor / IDE for development with built-in agents.",
            gemini_desc: "Google's multimodal AI model (Chat, Reasoning, Tools).",
            codex_desc: "OpenAI Codex: Coding agent / CLI for automated programming tasks.",
            runway_desc: "AI platform for video (Gen-4 etc.), image and audio.",
            ideogram_desc: "AI image generator, often with highly legible text in images.",
            stanford_desc: "On the <strong>University</strong> theme tile the Stanford <strong>Cardinal Block S</strong> (tree in the \"S\", Cardinal <code>#8c1515</code>) — Image from <a href=\"https://commons.wikimedia.org/wiki/File:Stanford_Cardinal_logo.svg\" target=\"_blank\" rel=\"noopener noreferrer\">Wikimedia Commons</a>; Brand <strong>Stanford University</strong>. Trademark and usage rules: <a href=\"https://identity.stanford.edu\" target=\"_blank\" rel=\"noopener noreferrer\">identity.stanford.edu</a>",
            back: "back"
        },
        es: {
            title: "CRÉDITOS",
            subtitle: "Herramientas de IA y medios utilizadas o mencionadas (lista no exhaustiva).",
            cursor_desc: "Editor / IDE potenciado por IA para el desarrollo con agentes integrados.",
            gemini_desc: "Modelo de IA multimodal de Google (Chat, Razonamiento, Herramientas).",
            codex_desc: "OpenAI Codex: Agente de programación / CLI para tareas de programación automatizadas.",
            runway_desc: "Plataforma de IA para video (Gen-4, etc.), imagen y audio.",
            ideogram_desc: "Generador de imágenes de IA, a menudo con texto altamente legible en las imágenes.",
            stanford_desc: "En el mosaico del tema <strong>Universidad</strong>, el <strong>Cardinal Block S</strong> de Stanford (árbol en la \"S\", Cardinal <code>#8c1515</code>) — Imagen de <a href=\"https://commons.wikimedia.org/wiki/File:Stanford_Cardinal_logo.svg\" target=\"_blank\" rel=\"noopener noreferrer\">Wikimedia Commons</a>; Marca <strong>Stanford University</strong>. Reglas de marca y uso: <a href=\"https://identity.stanford.edu\" target=\"_blank\" rel=\"noopener noreferrer\">identity.stanford.edu</a>",
            back: "volver"
        }
    };

    // Inject into global dictionary
    for (let lang in creditsTranslations) {
        if (CyberI18n.translations[lang]) {
            CyberI18n.translations[lang].credits = creditsTranslations[lang];
        }
    }
})();

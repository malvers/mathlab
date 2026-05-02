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
        },
        fr: {
            title: "CRÉDITS",
            subtitle: "Outils d’IA et médias utilisés ou mentionnés (liste non exhaustive).",
            cursor_desc: "Éditeur / IDE assisté par IA pour le développement avec agents intégrés.",
            gemini_desc: "Modèle IA multimodal de Google (Chat, Raisonnement, Outils).",
            codex_desc: "OpenAI Codex : agent de code / CLI pour tâches de programmation automatisées.",
            runway_desc: "Plateforme IA pour la vidéo (Gen-4, etc.), l’image et l’audio.",
            ideogram_desc: "Générateur d’images IA, souvent avec texte très lisible dans l’image.",
            stanford_desc: "Sur la tuile thème <strong>Université</strong>, le <strong>Cardinal Block S</strong> de Stanford (arbre dans le « S », Cardinal <code>#8c1515</code>) — Image <a href=\"https://commons.wikimedia.org/wiki/File:Stanford_Cardinal_logo.svg\" target=\"_blank\" rel=\"noopener noreferrer\">Wikimedia Commons</a> ; marque <strong>Stanford University</strong>. Règles : <a href=\"https://identity.stanford.edu\" target=\"_blank\" rel=\"noopener noreferrer\">identity.stanford.edu</a>",
            back: "retour"
        },
        it: {
            title: "CREDITI",
            subtitle: "Strumenti di IA e media usati o menzionati (elenco non esaustivo).",
            cursor_desc: "Editor / IDE con IA per lo sviluppo con agenti integrati.",
            gemini_desc: "Modello IA multimodale di Google (Chat, Ragionamento, Strumenti).",
            codex_desc: "OpenAI Codex: agente di programmazione / CLI per attività automatizzate.",
            runway_desc: "Piattaforma IA per video (Gen-4 ecc.), immagine e audio.",
            ideogram_desc: "Generatore di immagini IA, spesso con testo molto leggibile.",
            stanford_desc: "Sulla tessera <strong>Università</strong>, lo Stanford <strong>Cardinal Block S</strong> (albero nella « S », Cardinal <code>#8c1515</code>) — Immagine da <a href=\"https://commons.wikimedia.org/wiki/File:Stanford_Cardinal_logo.svg\" target=\"_blank\" rel=\"noopener noreferrer\">Wikimedia Commons</a>; marchio <strong>Stanford University</strong>. Regole: <a href=\"https://identity.stanford.edu\" target=\"_blank\" rel=\"noopener noreferrer\">identity.stanford.edu</a>",
            back: "indietro"
        },
        pt: {
            title: "CRÉDITOS",
            subtitle: "Ferramentas de IA e mídia usadas ou mencionadas (lista não exaustiva).",
            cursor_desc: "Editor / IDE com IA para desenvolvimento com agentes integrados.",
            gemini_desc: "Modelo de IA multimodal do Google (Chat, Raciocínio, Ferramentas).",
            codex_desc: "OpenAI Codex: agente de código / CLI para tarefas automatizadas.",
            runway_desc: "Plataforma de IA para vídeo (Gen-4 etc.), imagem e áudio.",
            ideogram_desc: "Gerador de imagens por IA, muitas vezes com texto bem legível.",
            stanford_desc: "No ladrilho <strong>Universidade</strong>, o Stanford <strong>Cardinal Block S</strong> (árvore no « S », Cardinal <code>#8c1515</code>) — Imagem de <a href=\"https://commons.wikimedia.org/wiki/File:Stanford_Cardinal_logo.svg\" target=\"_blank\" rel=\"noopener noreferrer\">Wikimedia Commons</a>; marca <strong>Stanford University</strong>. Regras: <a href=\"https://identity.stanford.edu\" target=\"_blank\" rel=\"noopener noreferrer\">identity.stanford.edu</a>",
            back: "voltar"
        },
        nl: {
            title: "CREDITS",
            subtitle: "Gebruikte of genoemde AI- en mediatools (geen volledige lijst).",
            cursor_desc: "AI-gestuurde editor / IDE voor ontwikkeling met ingebouwde agents.",
            gemini_desc: "Googles multimodale AI (chat, redeneren, tools).",
            codex_desc: "OpenAI Codex: code-agent / CLI voor geautomatiseerde programmeertaaken.",
            runway_desc: "AI-platform voor video (o.a. Gen-4), beeld en audio.",
            ideogram_desc: "AI-beeldgenerator, vaak met goed leesbare tekst in afbeeldingen.",
            stanford_desc: "Op de tegel <strong>Universiteit</strong> het Stanford-<strong>Cardinal Block S</strong> (boom in de „S”, Cardinal <code>#8c1515</code>) — Afbeelding van <a href=\"https://commons.wikimedia.org/wiki/File:Stanford_Cardinal_logo.svg\" target=\"_blank\" rel=\"noopener noreferrer\">Wikimedia Commons</a>; merk <strong>Stanford University</strong>. Merk- en gebruiksregels: <a href=\"https://identity.stanford.edu\" target=\"_blank\" rel=\"noopener noreferrer\">identity.stanford.edu</a>",
            back: "terug"
        },
        sw: {
            title: "SHUKRANI",
            subtitle: "Zana za AI na media zilizotumiwa au kutajwa (orodha siyo kamili).",
            cursor_desc: "Hariri / IDE yenye AI na mawakala waliojengewa ndani.",
            gemini_desc: "Mfano wa AI wa Google anayebaini maumbo mbalimbali (Chat, mantiki, zana).",
            codex_desc: "OpenAI Codex: wakala wa uandishi wa programu / CLI kwa kazi zilizojiendesha.",
            runway_desc: "Jukwaa la AI kwa video (Gen-4 n.k.), picha na sauti.",
            ideogram_desc: "Jenereta ya picha za AI, mara nyingi na maandishi yanayosomeka vizuri.",
            stanford_desc: "Kwenye kadi ya <strong>Chuo kikuu</strong>, nembo ya Stanford <strong>Cardinal Block S</strong> (mti katika „S“, Cardinal <code>#8c1515</code>) — Picha kutoka <a href=\"https://commons.wikimedia.org/wiki/File:Stanford_Cardinal_logo.svg\" target=\"_blank\" rel=\"noopener noreferrer\">Wikimedia Commons</a>; chapa <strong>Stanford University</strong>. Sheria: <a href=\"https://identity.stanford.edu\" target=\"_blank\" rel=\"noopener noreferrer\">identity.stanford.edu</a>",
            back: "rudi"
        }
    };

    // Inject into global dictionary
    for (let lang in creditsTranslations) {
        if (CyberI18n.translations[lang]) {
            CyberI18n.translations[lang].credits = creditsTranslations[lang];
        }
    }
})();

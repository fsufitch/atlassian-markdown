import MarkdownIt from 'markdown-it';

import hljs from 'highlight.js/lib/common';

const commonOptions = {
    html: false,
    xhtmlOut: true,
    typographer: false,
    linkify: false,
    highlight: null,
}

export const mdPreviewHTML = MarkdownIt({...commonOptions, highlight: (content, language) => {
    if (!language || !hljs.getLanguage(language)) return '';
    try {
        return hljs.highlight(content, { language }).value;
    } catch (err) {
        console.error('code highlight failed', language, err);
        return '';
    }
}})

export const mdRawHTML = MarkdownIt({...commonOptions});

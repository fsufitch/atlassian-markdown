import MarkdownIt from "markdown-it";

import hljs from "highlight.js/lib/common";

const commonOptions = {
  html: false,
  xhtmlOut: true,
  typographer: false,
  linkify: false,
  highlight: null,
};

export const mdPreviewHTML = MarkdownIt({
  ...commonOptions,
  highlight: (content, language) => {
    if (!language || !hljs.getLanguage(language)) return "";
    try {
      return hljs.highlight(content, { language }).value;
    } catch (err) {
      console.error("code highlight failed", language, err);
      return "";
    }
  },
});

export const mdRawHTML = MarkdownIt({ ...commonOptions });

export const convertMarkdownToAtlassian = (md: string): string => {
  /*
    Implemented using:
        * https://spec.commonmark.org/0.31.2
        * https://confluence.atlassian.com/doc/confluence-wiki-markup-251003035.html
    */
  const output: string[] = [];
  const parsed = mdRawHTML.parse(md, {}).reverse();

  const prefixes: string[] = [];

  const pushListPrefix = (char: "*" | "#") => {
    if (prefixes.length && /^(\*|#) $/.test(prefixes[prefixes.length - 1])) {
      const lastPrefix = prefixes.pop()!;
      prefixes.push(lastPrefix[0]);
    }
    prefixes.push(`${char} `);
  };

  const popListPrefix = (char: "*" | "#") => {
    if (!prefixes.length || prefixes[prefixes.length - 1] != `${char} `) {
      throw "bad list prefix pop";
    }
    prefixes.pop();
    if (prefixes.length && ["*", "#"].includes(prefixes[prefixes.length - 1])) {
      const lastPrefix = prefixes.pop();
      prefixes.push(`${lastPrefix} `);
    }
  };

  while (parsed.length) {
    const token = parsed.pop();
    if (!token) {
      continue;
    }
    switch (token?.type) {
      case "inline":
        output.push(prefixes.join("") + token.content);
        console.log("INLINE", token);
        break;
      case "paragraph_open":
        break;
      case "paragraph_close":
        output.push("\n\n");
        break;
      case "hr":
        output.push("----\n\n");
        break;
      case "heading_open":
        output.push(`${token.tag}. `);
        break;
      case "heading_close":
        output.push("\n\n");
        break;
      case "fence": // fenced code block
        if (token.info) {
          // token.info holds the language if specified
          output.push(
            `{code:${token.info}}\n${token.content.endsWith("\n") ? "" : "\n"}${token.content}{code}\n`,
          );
        } else {
          output.push(
            `{code}\n${token.content}${token.content.endsWith("\n") ? "" : "\n"}{code}\n`,
          );
        }
        break;
      case "code_block":
        output.push(
          `{code}\n${token.content}${token.content.endsWith("\n") ? "" : "\n"}{code}\n`,
        );
        break;
      case "blockquote_open":
        prefixes.push("bq. ");
        break;
      case "blockquote_close":
        if (!prefixes.length || prefixes[prefixes.length - 1] != "bq. ") {
          console.error("Bad block quote close token", token);
          break;
        }
        output.push("BQQ");
        prefixes.pop();
        break;

      case "bullet_list_open":
        pushListPrefix("*");
        break;
      case "bullet_list_close":
        popListPrefix("*");
        break;
      case "ordered_list_open":
        pushListPrefix("#");
        break;
      case "ordered_list_close":
        popListPrefix("#");
        break;
      case "list_item_open":
        break;
      case "list_item_close":
        break;
      default:
        console.info("unrecognized token", token.type, token);
    }
  }

  return output.join("");
};

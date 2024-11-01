import { toHtml } from "hast-util-to-html";
import { createStarryNight, common } from "@wooorm/starry-night";
import "@wooorm/starry-night/style/light.css";
import { FC, useEffect, useRef } from "react";
import { match, P } from "ts-pattern";

export const Preview: FC<{ code: string; lang: string }> = ({ code, lang }) => {
  const highlighter = useRef<Awaited<ReturnType<typeof createStarryNight>>>();

  useEffect(() => {
    const init = async () => {
      var h = await createStarryNight(common);
      highlighter.current = h;
    };
    init();
  }, []);

  const scope = match(lang)
    // https://github.com/wooorm/starry-night/blob/3e7e9377f60827634b69321b3c110f17e22070d8/lib/common.js
    .with("html", () => "text.html.basic")
    .with("md", () => "source.gfm")
    .with("svg", () => "text.xml.svg")
    .with(
      P.union("css", "js", "json", "ts", "yaml"),
      (lang) => "source." + lang,
    )
    .otherwise(() => null);

  return (
    <pre style={{ margin: 10 }}>
      {match([highlighter.current, scope])
        .with([P.not(P.nullish), P.not(P.nullish)], ([h, scope]) => {
          return (
            <code
              dangerouslySetInnerHTML={{
                __html: toHtml(h.highlight(code, scope)),
              }}
            />
          );
        })
        .otherwise(() => {
          return <code>{code}</code>;
        })}
    </pre>
  );
};

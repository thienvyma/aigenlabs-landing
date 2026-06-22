import { Fragment } from "react";

interface AccentTextProps {
  text: string;
  accents: string[];
}

export function AccentText({ text, accents }: AccentTextProps) {
  const accent = accents.find((term) => term && text.includes(term));

  if (!accent) return <>{text}</>;

  const parts = text.split(accent);

  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={`${accent}-${index}`}>
          {part}
          {index < parts.length - 1 ? <span className="brand-gradient-text">{accent}</span> : null}
        </Fragment>
      ))}
    </>
  );
}

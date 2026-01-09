import { useState } from "react";

type Props = {
  src?: string | null;
  alt: string;
  className?: string;
};

export default function Poster({ src, alt, className }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const finalSrc = !src || errored ? "/no-movie.png" : src;

  return (
    <div className={`poster-wrap ${className || ""}`}>
      <img
        src={finalSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        className={`poster-img ${loaded ? "is-loaded" : ""}`}
      />
      {!loaded && <div className="poster-skeleton" />}
    </div>
  );
}

import type { Citation } from '../corpus/types';

interface Props {
  locator: string;
  quote: string;
  citation: Citation;
}

/**
 * The verse is the only block on the page that is quoted verbatim.
 * Locator above, quote in serif, provenance below — so a reader can walk
 * from the claim to the page of the book.
 */
export function VerseBlock({ locator, quote, citation }: Props) {
  return (
    <figure className="verse">
      <div className="verse-locator">{locator}</div>
      <blockquote>{quote}</blockquote>
      <figcaption>
        {citation.source}, {citation.year} · <a href={citation.url}>source</a>
        {citation.funding ? ` · funding: ${citation.funding}` : ''}
      </figcaption>
    </figure>
  );
}

interface Props {
  tone: 'myth' | 'fact' | 'no-source' | 'conditional';
  label: string;
}

/** Verdict is always a word first. Colour is decoration, not information. */
export function VerdictChip({ tone, label }: Props) {
  return <span className={`chip chip--${tone}`}>{label}</span>;
}

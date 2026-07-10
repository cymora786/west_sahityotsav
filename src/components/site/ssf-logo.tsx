export function SsfLogoMark({ className, white }: { className?: string; white?: boolean }) {
  const c1 = white ? "#ffffff" : "#cf426b";
  const c2 = white ? "#ffffff" : "#2e6ab1";
  return (
    <svg viewBox="0 0 43.95 29.25" className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <polygon points="5.65 29.25 0 0 5.65 0 11.3 29.23 5.65 29.25" fill={c1} />
      <polygon points="38.31 29.25 32.66 0 38.31 0 43.95 29.23 38.31 29.25" fill={c2} />
      <polygon points="16.95 29.25 22.6 0 16.95 0 11.3 29.23 16.95 29.25" fill={c1} />
      <polygon points="28.25 29.25 22.6 0 28.25 0 33.9 29.23 28.25 29.25" fill={c1} />
    </svg>
  );
}

type LogoProps = {
  className?: string;
};

export function Logo({ className = "h-10 w-auto" }: LogoProps) {
  return (
    <span
      className={`inline-flex items-center gap-[0.42em] leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] ${className}`}
    >
      {/* Native img keeps the supplied artwork exact. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/knight.png" alt="" className="h-full w-auto shrink-0" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/lord-bae-wordmark.png"
        alt="Lord Bae"
        className="h-[46%] w-auto shrink-0"
      />
    </span>
  );
}

type LogoProps = {
  className?: string;
};

export function Logo({ className = "h-10 w-auto" }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-[0.55em] leading-none ${className}`}>
      {/* Native img keeps the supplied artwork exact. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/knight.png" alt="" className="h-full w-auto shrink-0" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/lord-bae-wordmark.png"
        alt="Lord Bae"
        className="h-[40%] w-auto shrink-0"
      />
    </span>
  );
}

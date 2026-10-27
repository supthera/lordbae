type LogoProps = {
  className?: string;
};

export function Logo({ className = "h-10 w-auto" }: LogoProps) {
  return (
    // The lockup is the supplied brand file. Native img keeps the SVG vectors exact.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/Lord%20Bae.svg"
      alt="Lord Bae"
      className={className}
    />
  );
}

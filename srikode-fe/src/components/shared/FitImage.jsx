import Image from "next/image";

// Shows the whole image inside a fixed-size box (parent must be `relative`).
// A blurred, enlarged copy fills the leftover space with the image's own colours
// (ambient glow). It stays fully opaque and is scaled well past the box so the
// blur's transparent edges never show as pale bands.
export default function FitImage({ src, alt = "", sizes, priority = false, className = "" }) {
  return (
    <>
      <Image
        src={src}
        alt=""
        aria-hidden
        fill
        priority={priority}
        className="scale-150 object-cover blur-2xl saturate-150 brightness-90"
        sizes={sizes}
      />
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className={`object-contain ${className}`}
        sizes={sizes}
      />
    </>
  );
}

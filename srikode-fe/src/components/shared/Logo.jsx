import Image from "next/image";

export default function Logo({ className = "h-8 w-auto", priority = false }) {
  return (
    <span className="relative inline-flex items-center select-none">
      {/* Light Mode Logo (Dark "Sri" text on light background) */}
      <Image
        src="/srikode-logo-light.svg"
        alt="SriKode"
        width={130}
        height={46}
        priority={priority}
        className={`${className} dark:hidden block object-contain`}
      />
      {/* Dark Mode Logo (White "Sri" text on dark background) */}
      <Image
        src="/srikode-logo-dark.svg"
        alt="SriKode"
        width={130}
        height={46}
        priority={priority}
        className={`${className} hidden dark:block object-contain`}
      />
    </span>
  );
}

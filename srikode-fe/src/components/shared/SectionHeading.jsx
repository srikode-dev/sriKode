export default function SectionHeading({ title, subtitle }) {
  return (
    <div className="mb-12">
      <h2 className="h2">{title}</h2>

      {subtitle && <p className="mt-3 text-muted">{subtitle}</p>}
    </div>
  );
}

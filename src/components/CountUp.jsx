export default function CountUp({ to, suffix = "", prefix = "" }) {
  return <span>{prefix}{to.toLocaleString()}{suffix}</span>;
}

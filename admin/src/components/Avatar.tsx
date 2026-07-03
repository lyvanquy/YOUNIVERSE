interface AvatarProps {
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function getInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export default function Avatar({ name, size = "md", className = "" }: AvatarProps) {
  return (
    <span className={`avatar avatar--${size} ${className}`} title={name}>
      {getInitials(name)}
    </span>
  );
}

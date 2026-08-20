import * as LucideIcons from "lucide-react";
import * as GiIcons from "react-icons/gi";
import * as FaIcons from "react-icons/fa6";

interface IconRendererProps {
  name: string;
  className?: string;
}

export function IconRenderer({ name, className = "w-6 h-6" }: IconRendererProps) {
  if (name.startsWith('Gi')) {
    // @ts-ignore
    const Icon = GiIcons[name];
    if (Icon) return <Icon className={className} />;
  }
  if (name.startsWith('Fa')) {
    // @ts-ignore
    const Icon = FaIcons[name];
    if (Icon) return <Icon className={className} />;
  }

  // @ts-ignore
  const Icon = LucideIcons[name];
  
  if (!Icon) {
    return <LucideIcons.Activity className={className} />;
  }

  return <Icon className={className} />;
}

import type { ReactNode } from "react";
import { Moon, Star, Sun, SunDim, Sunrise, Sunset } from "lucide-react";
import { CiCloudSun } from "react-icons/ci";

export function renderPrayerIcon(icon: string, size = 28): ReactNode {
  const icons: Record<string, ReactNode> = {
    moon: <Moon size={size} />,
    sun: <Sun size={size} />,
    "sun-dim": <SunDim size={size} />,
    sunrise: <Sunrise size={size} />,
    sunset: <Sunset size={size} />,
    "cloud-sun": <CiCloudSun size={size} />,
    star: <Star size={size} />,
  };

  return icons[icon] ?? icons.star;
}

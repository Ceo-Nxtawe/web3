import React from "react";
import { ParallaxText } from "./ui/ParallaxText";
import { cn } from "../lib/utils";

interface VelocityScrollProps {
  text: string;
  default_velocity?: number;
  className?: string;
}

export const VelocityScroll: React.FC<VelocityScrollProps> = ({
  text,
  default_velocity = 5,
  className,
}) => {
  return (
    <section className="relative w-full">
      <ParallaxText baseVelocity={default_velocity} className={className}>
        {text}
      </ParallaxText>
      <ParallaxText baseVelocity={-default_velocity} className={className}>
        {text}
      </ParallaxText>
    </section>
  );
};
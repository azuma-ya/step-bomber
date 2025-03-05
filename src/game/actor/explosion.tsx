import { map } from "@/lib/utils";
import { useEffect, useState } from "react";

type Particle = {
  id: number;
  size: number;
  color: string;
  targetX: number;
  targetY: number;
  duration: number;
};

export const Explosion = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const colors = [
      "#FEF5BD",
      "#F8E152",
      "#FF8E3A",
      "#D9E0E6",
      "#D9E0E6",
      "#ff0000",
      "#ff4500",
      "#ff6347",
      "#c0c0c0",
      "#999999",
      "#ffffff",
    ];
    const particleCount = 30;
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 15 + 5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const temp = Math.random() * Math.PI * 2;
      const targetX = Math.cos(temp) * 50 + map(Math.random(), 0, 1, -50, 50);
      const targetY = Math.sin(temp) * 50 + map(Math.random(), 0, 1, -50, 50);
      const duration = Math.random() * 1000 + 500;

      newParticles.push({
        id: i,
        size,
        color,
        targetX,
        targetY,
        duration,
      });
    }

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
    }, 1500); // Maximum duration + buffer

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative size-full">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute inset-1/2 -translate-1/2"
          style={
            {
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              animation: `particle-fade ${particle.duration}ms ease-out forwards`,
              "--target-x": `${particle.targetX}px`,
              "--target-y": `${particle.targetY}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};

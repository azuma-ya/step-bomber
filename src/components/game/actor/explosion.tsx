import { map } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const colors = [
      "#FF4500", // オレンジレッド
      "#FF6347", // トマト
      "#FF8C00", // ダークオレンジ
      "#FFA500", // オレンジ
      "#FFD700", // ゴールド
      "#FFFF00", // イエロー
      "#FFFACD", // レモンシフォン（柔らかい光）
      "#FFF5EE", // シーシェル（ほのかな明るさ）
      "#FF7F50", // コーラル
      "#FFDAB9", // ピーチパフ
    ];
    const particleCount = 50;
    const newParticles: Particle[] = [];

    const baseSize = (containerRef?.current?.clientWidth ?? 50) / 10;

    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * baseSize + 5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const temp = Math.random() * Math.PI * 2;
      const targetX =
        Math.cos(temp) * baseSize +
        map(Math.random(), 0, 1, -baseSize * 10, baseSize * 10);
      const targetY =
        Math.sin(temp) * baseSize +
        map(Math.random(), 0, 1, -baseSize * 10, baseSize * 10);
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
    <div className="relative size-full" ref={containerRef}>
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

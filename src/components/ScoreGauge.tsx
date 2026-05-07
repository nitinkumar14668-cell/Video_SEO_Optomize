'use client';
import { motion } from "motion/react";

export function ScoreGauge({ score }: { score: number }) {
  const radius = 60;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = "text-red-500";
  if (score >= 50) color = "text-yellow-500";
  if (score >= 80) color = "text-[#1db8eb]"; // Or text-green-500, but let's use the brand color for perfect score

  return (
    <div className="relative flex items-center justify-center w-full h-48 mx-auto -mt-2">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90 drop-shadow-md"
      >
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="text-slate-100"
        />
        <motion.circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={`${color} transition-all duration-1000 ease-out`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
        <motion.span 
          key={score}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-5xl font-black text-slate-800 tracking-tighter"
        >
          {score}
        </motion.span>
        <span className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">/ 100</span>
      </div>
    </div>
  );
}

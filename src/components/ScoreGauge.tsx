import { motion } from "motion/react";

export function ScoreGauge({ score }: { score: number }) {
  const radius = 60;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = "text-rose-500";
  if (score >= 50) color = "text-amber-500";
  if (score >= 80) color = "text-indigo-600";

  return (
    <div className="relative flex items-center justify-center w-48 h-48 mx-auto -mt-4">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
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
          className="text-5xl font-extrabold text-slate-900"
        >
          {score}
        </motion.span>
        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">of 100</span>
      </div>
    </div>
  );
}

import { Achievement } from "@/lib/achievements"

export function AchievementBadge({ achievement }: { achievement: Achievement }) {
  const isUnlocked = !!achievement.unlockedAt

  return (
    <div className={`p-4 rounded-xl border flex items-center space-x-4 transition-all duration-300 ${
      isUnlocked 
        ? 'bg-[#111827] border-tvGreen/30 shadow-[0_0_15px_rgba(38,166,154,0.1)]' 
        : 'bg-black/20 border-white/5 opacity-50 grayscale hover:grayscale-0'
    }`}>
      <div className={`text-4xl w-16 h-16 rounded-full flex items-center justify-center border-2 ${
        isUnlocked ? 'border-tvGreen bg-tvGreen/10' : 'border-gray-800 bg-[#111827]'
      }`}>
        {achievement.icon}
      </div>
      <div>
        <h4 className={`font-bold font-heading w-full block ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
          {achievement.title}
        </h4>
        <p className={`text-xs ${isUnlocked ? 'text-gray-400' : 'text-gray-600'}`}>
          {achievement.description}
        </p>
        {isUnlocked && (
          <span className="text-xs font-bold text-tvGreen mt-1 inline-block">+{achievement.points} XP</span>
        )}
      </div>
    </div>
  )
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  points: number
  unlockedAt?: number
}

const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_blood', title: 'First Steps', description: 'Configure your first tracked asset.', icon: '🌱', points: 10 },
  { id: 'signal_hunter', title: 'Signal Hunter', description: 'View 5 different explicit signal cards.', icon: '🎯', points: 20 },
  { id: 'portfolio_manager', title: 'Portfolio Manager', description: 'Add your first paper trade.', icon: '💼', points: 30 },
  { id: 'weekend_warrior', title: 'Weekend Warrior', description: 'Access the Daily Briefing on a weekend.', icon: '⚔️', points: 50 },
  { id: 'matrix_analyst', title: 'Matrix Analyst', description: 'Compare 4 assets simultaneously.', icon: '📊', points: 40 },
  { id: 'diamond_hands', title: 'Diamond Hands', description: 'Hold a paper trade for over 7 virtual days.', icon: '💎', points: 100 }
]

export function getUnlockedAchievements(ids: string[]): Achievement[] {
  return ALL_ACHIEVEMENTS.map(a => ({
    ...a,
    unlockedAt: ids.includes(a.id) ? Date.now() : undefined
  }))
}

// Helper directly evaluating local logic states mapping array metrics
export function checkAchievements(state: any): string[] {
  const unlocked = []
  if (state.watchlist?.length > 0) unlocked.push('first_blood')
  if (state.portfolio?.length > 0) unlocked.push('portfolio_manager')
  // For MVP, randomly unlock Signal Hunter just to demonstrate the logic array working cleanly across user states
  unlocked.push('signal_hunter') 
  return unlocked
}

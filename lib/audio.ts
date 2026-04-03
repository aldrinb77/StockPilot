"use client"

// Refined interface sounds for tactical feel
export const playInterfaceSound = (type: 'SELECT' | 'SUCCESS' | 'ERROR' | 'HOVER' | 'CLICK') => {
  if (typeof window === 'undefined') return
  
  try {
    const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return
    
    const ctx = new AudioContextClass()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    switch (type) {
      case 'HOVER':
        osc.frequency.setValueAtTime(440, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05)
        gain.gain.setValueAtTime(0, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.01)
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.05)
        osc.start()
        osc.stop(ctx.currentTime + 0.05)
        break
      case 'CLICK':
        osc.frequency.setValueAtTime(1200, ctx.currentTime)
        gain.gain.setValueAtTime(0.02, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
        osc.start()
        osc.stop(ctx.currentTime + 0.1)
        break
      case 'SELECT':
        osc.frequency.setValueAtTime(600, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15)
        gain.gain.setValueAtTime(0.02, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)
        osc.start()
        osc.stop(ctx.currentTime + 0.15)
        break
      case 'SUCCESS':
        // Double blip
        osc.frequency.setValueAtTime(880, ctx.currentTime)
        osc.frequency.setValueAtTime(1760, ctx.currentTime + 0.1)
        gain.gain.setValueAtTime(0.02, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2)
        osc.start()
        osc.stop(ctx.currentTime + 0.2)
        break
      case 'ERROR':
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(220, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.2)
        gain.gain.setValueAtTime(0.02, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2)
        osc.start()
        osc.stop(ctx.currentTime + 0.2)
        break
    }
  } catch (e) {
    // Fail silently - audio not critical
  }
}

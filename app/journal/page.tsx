"use client"

import { useState } from "react"
import { useStore, JournalEntry } from "@/store/store"
import { BookText, Plus, Search, Trash2, Calendar, Smile, Meh, Frown, Save, X, Download, Terminal, Sparkles, Activity } from "lucide-react"
import { StaggerContainer, StaggerItem, FadeIn } from "@/components/ui/FadeIn"
import { motion, AnimatePresence } from "framer-motion"

export default function JournalPage() {
  const { journalEntries, addJournalEntry, removeJournalEntry } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState("")

  const filtered = journalEntries.filter(e => 
    e.symbol?.toLowerCase().includes(filter.toLowerCase()) || 
    e.notes.toLowerCase().includes(filter.toLowerCase())
  )

  const exportToCSV = () => {
    const headers = ["Date", "Symbol", "Type", "Notes", "Mood", "Lesson"]
    const rows = journalEntries.map(e => [
      e.date, 
      e.symbol || "N/A", 
      e.type, 
      `"${e.notes.replace(/"/g, '""')}"`, 
      e.mood, 
      `"${(e.lesson || "").replace(/"/g, '""')}"`
    ])
    const csvContent = [headers, ...rows].map(r => r.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `stoxpilot-journal-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <FadeIn>
      <div className="space-y-12 pb-20 max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
          <div className="space-y-2">
             <div className="flex items-center space-x-2 text-[#7c4dff]">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Cognitive Trading Protocol</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter flex items-center gap-4">
               <Terminal className="w-8 h-8 text-white/20" /> 
               Insight Journal
             </h1>
             <p className="text-[#8899a6] font-bold text-lg">Document your market psychometrics and strategic adjustments.</p>
          </div>
          <div className="flex gap-4">
             <button 
                onClick={exportToCSV}
                className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#f0f4f8] hover:bg-white/10 transition-all flex items-center gap-3 group"
             >
                <Download className="w-4 h-4" /> Export
             </button>
             <button 
                onClick={() => setShowForm(true)}
                className="px-8 py-4 bg-gradient-to-r from-[#7c4dff] to-[#651fff] text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-[#7c4dff20] flex items-center gap-3"
             >
                <Plus className="w-5 h-5" /> New Log Entry
             </button>
          </div>
        </div>

        <AnimatePresence>
           {showForm && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                  <JournalForm onClose={() => setShowForm(false)} onAdd={addJournalEntry} />
              </motion.div>
           )}
        </AnimatePresence>

        <div className="max-w-3xl">
           <div className="relative group">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5c6b7a] group-focus-within:text-[#7c4dff] transition-colors" />
             <input 
               type="text" 
               placeholder="Search logs by asset or keyword..." 
               value={filter}
               onChange={(e) => setFilter(e.target.value)}
               className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-5 pl-16 pr-6 text-white font-bold focus:border-[#7c4dff] focus:ring-4 focus:ring-[#7c4dff10] outline-none transition-all placeholder:text-[#5c6b7a]"
             />
           </div>
        </div>

        <div className="space-y-8 relative before:absolute before:left-10 before:top-4 before:bottom-4 before:w-px before:bg-white/5">
           <StaggerContainer>
              {filtered.map(entry => (
                <StaggerItem key={entry.id}>
                   <JournalEntryCard entry={entry} onRemove={removeJournalEntry} />
                </StaggerItem>
              ))}
           </StaggerContainer>
           
           {filtered.length === 0 && (
              <div className="text-center py-32 glass-card rounded-[3rem] border-2 border-dashed border-white/5">
                <BookText className="w-16 h-16 text-white/5 mx-auto mb-6" />
                <p className="text-[#5c6b7a] font-black uppercase tracking-widest text-sm">No encrypted logs found matching criteria</p>
              </div>
           )}
        </div>
      </div>
    </FadeIn>
  )
}

function JournalForm({ onClose, onAdd }: { onClose: () => void, onAdd: any }) {
  const [entry, setEntry] = useState({
    symbol: "",
    type: "Learning" as any,
    notes: "",
    mood: "NEUTRAL" as any,
    lesson: "",
    date: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(entry)
    onClose()
  }

  return (
    <div className="glass-card p-10 rounded-[2.5rem] border border-[#7c4dff30] relative overflow-hidden group">
       <div className="absolute top-0 right-0 w-64 h-64 bg-[#7c4dff] blur-[100px] opacity-10 pointer-events-none" />
       <button onClick={onClose} className="absolute top-8 right-8 text-[#5c6b7a] hover:text-white transition-all transform hover:rotate-90">
          <X className="w-6 h-6" />
       </button>
       <h2 className="text-2xl font-black text-white mb-10 tracking-tighter uppercase">Log Protocol Entry</h2>
       
       <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-8">
             <div className="space-y-3">
                <label className="text-[10px] font-black text-[#8899a6] uppercase tracking-[0.3em] px-2">Hardware/Ticker (Optional)</label>
                <input 
                  type="text" 
                  value={entry.symbol} 
                  onChange={e => setEntry({...entry, symbol: e.target.value.toUpperCase()})}
                  placeholder="e.g. NIFTY50"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold focus:border-[#7c4dff] outline-none transition-all focus:ring-4 focus:ring-[#7c4dff10]"
                />
             </div>
             
             <div className="space-y-3">
                <label className="text-[10px] font-black text-[#8899a6] uppercase tracking-[0.3em] px-2">Action Category</label>
                <div className="grid grid-cols-2 gap-3 p-2 bg-white/5 rounded-2xl border border-white/5">
                   {['Bought', 'Sold', 'Watching', 'Learning'].map(t => (
                      <button 
                        key={t}
                        type="button"
                        onClick={() => setEntry({...entry, type: t as any})}
                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${entry.type === t ? 'bg-[#7c4dff] text-white shadow-xl shadow-[#7c4dff20]' : 'text-[#8899a6] hover:bg-white/5 hover:text-white'}`}
                      >
                        {t}
                      </button>
                   ))}
                </div>
             </div>

             <div className="space-y-3">
                <label className="text-[10px] font-black text-[#8899a6] uppercase tracking-[0.3em] px-2">Psychometric State</label>
                <div className="flex gap-4">
                   {[
                      { id: 'HAPPY', emoji: <Smile className="w-5 h-5" />, color: 'text-[#00e676]' },
                      { id: 'NEUTRAL', emoji: <Meh className="w-5 h-5" />, color: 'text-[#ffab00]' },
                      { id: 'SAD', emoji: <Frown className="w-5 h-5" />, color: 'text-[#ff1744]' }
                   ].map(m => (
                      <button 
                        key={m.id}
                        type="button"
                        onClick={() => setEntry({...entry, mood: m.id as any})}
                        className={`flex-1 py-4 rounded-2xl border flex items-center justify-center transition-all ${entry.mood === m.id ? `bg-white/10 border-white/20 ${m.color} scale-105 shadow-xl` : 'border-white/5 text-[#5c6b7a] hover:bg-white/5'}`}
                      >
                         {m.emoji}
                      </button>
                   ))}
                </div>
             </div>
          </div>

          <div className="space-y-8">
             <div className="space-y-3">
                <label className="text-[10px] font-black text-[#8899a6] uppercase tracking-[0.3em] px-2">Strategic Observations</label>
                <textarea 
                   value={entry.notes}
                   onChange={e => setEntry({...entry, notes: e.target.value})}
                   rows={5}
                   required
                   placeholder="Document indicator alignment and entry rationale..."
                   className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold focus:border-[#7c4dff] outline-none transition-all focus:ring-4 focus:ring-[#7c4dff10] resize-none leading-relaxed"
                />
             </div>
             <div className="space-y-3">
                <label className="text-[10px] font-black text-[#8899a6] uppercase tracking-[0.3em] px-2">Protocol Lesson</label>
                <textarea 
                   value={entry.lesson}
                   onChange={e => setEntry({...entry, lesson: e.target.value})}
                   rows={3}
                   placeholder="Synthesize current insight for future execution..."
                   className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold focus:border-[#7c4dff] outline-none transition-all focus:ring-4 focus:ring-[#7c4dff10] resize-none leading-relaxed"
                />
             </div>
          </div>

          <div className="md:col-span-2 pt-6">
             <button type="submit" className="w-full py-5 bg-gradient-to-r from-[#7c4dff] to-[#651fff] text-white font-black rounded-2xl text-sm uppercase tracking-[0.2em] shadow-2xl shadow-[#7c4dff30] hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                <Save className="w-5 h-5" /> Commit Entry to Memory
             </button>
          </div>
       </form>
    </div>
  )
}

function JournalEntryCard({ entry, onRemove }: { entry: JournalEntry, onRemove: any }) {
  const MoodIcon = entry.mood === 'HAPPY' ? Smile : entry.mood === 'NEUTRAL' ? Meh : Frown
  const moodColor = entry.mood === 'HAPPY' ? 'text-[#00e676]' : entry.mood === 'NEUTRAL' ? 'text-[#ffab00]' : 'text-[#ff1744]'

  return (
    <div className="relative pl-24 group">
       <div className="absolute left-[34px] top-8 w-3 h-3 rounded-full bg-[#7c4dff] z-10 shadow-[0_0_20px_rgba(124,77,255,0.6)]" />

       <div className="glass-card p-10 rounded-[2.5rem] relative overflow-hidden hover:translate-y-[-4px] transition-all border border-white/5">
          <div className={cn("absolute -top-10 -right-10 w-48 h-48 blur-[80px] opacity-10 pointer-events-none transition-all group-hover:opacity-20", moodColor.replace('text-', 'bg-'))} />

          <button 
             onClick={() => onRemove(entry.id)}
             className="absolute top-8 right-8 p-3 rounded-xl opacity-0 group-hover:opacity-100 bg-[#ff174410] text-[#ff1744] hover:bg-[#ff1744] hover:text-white transition-all shadow-xl"
          >
             <Trash2 className="w-4 h-4" />
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
             <div className="flex items-center gap-6">
                <div className={cn("w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-transform group-hover:scale-110", moodColor)}>
                   <MoodIcon className="w-7 h-7" />
                </div>
                <div>
                   <h3 className="font-black text-white text-2xl tracking-tighter uppercase flex items-center gap-4">
                      {entry.symbol || "INSIGHT LOG"} 
                      <div className="h-1.5 w-1.5 rounded-full bg-white/10" />
                      <span className="text-[#7c4dff] text-xs font-black tracking-[0.3em] uppercase">{entry.type}</span>
                   </h3>
                   <div className="flex items-center gap-4 mt-2">
                      <p className="text-[10px] font-black text-[#5c6b7a] uppercase tracking-widest flex items-center gap-2">
                        <Calendar className="w-3 h-3" /> {entry.date}
                      </p>
                      <div className="h-1 w-1 rounded-full bg-white/10" />
                      <p className={cn("text-[10px] font-black uppercase tracking-widest", moodColor)}>
                        {entry.mood} STATE
                      </p>
                   </div>
                </div>
             </div>
          </div>

          <div className="space-y-6">
             <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 relative">
                <div className="absolute top-4 left-4 opacity-5">
                   <Activity className="w-12 h-12 text-white" />
                </div>
                <p className="text-[#8899a6] font-bold text-lg leading-relaxed italic relative z-10">
                  &ldquo;{entry.notes}&rdquo;
                </p>
             </div>
             
             {entry.lesson && (
               <div className="flex items-start gap-6 bg-[#7c4dff08] p-8 rounded-3xl border border-[#7c4dff10] group-hover:border-[#7c4dff30] transition-colors">
                  <div className="p-3 rounded-xl bg-[#7c4dff15] text-[#7c4dff] shrink-0 mt-1 shadow-lg">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                     <p className="text-[10px] font-black text-[#7c4dff] uppercase tracking-[0.3em]">Protocol Synthesis</p>
                     <p className="text-lg font-black text-white/90 leading-tight">{entry.lesson}</p>
                  </div>
               </div>
             )}
          </div>
       </div>
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

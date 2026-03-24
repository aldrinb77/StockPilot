"use client"

import { useState } from "react"
import { useStore, JournalEntry } from "@/store/store"
import { BookText, Plus, Search, Trash2, Calendar, Smile, Meh, Frown, Save, X, Download } from "lucide-react"

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
    <div className="space-y-8 animate-in fade-in pb-20 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center">
            <BookText className="w-8 h-8 text-tvPurple mr-4" /> Market Learning Journal
          </h1>
          <p className="text-gray-400 mt-1">Reflect on your trades and indicators readings to improve your discipline.</p>
        </div>
        <div className="flex space-x-3 w-full md:w-auto">
           <button 
              onClick={exportToCSV}
              className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-white/5 border border-gray-700 text-gray-300 hover:text-white transition-all"
           >
              <Download className="w-4 h-4" />
              <span className="text-sm font-bold">Export CSV</span>
           </button>
           <button 
              onClick={() => setShowForm(true)}
              className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-2 rounded-xl bg-tvPurple text-white font-bold shadow-lg shadow-tvPurple/20 hover:scale-105 transition-all"
           >
              <Plus className="w-4 h-4" />
              <span>New Entry</span>
           </button>
        </div>
      </div>

      {showForm && <JournalForm onClose={() => setShowForm(false)} onAdd={addJournalEntry} />}

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input 
          type="text" 
          placeholder="Search entries or symbols..." 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full bg-[#1E222D] border border-gray-700/50 rounded-2xl py-4 pl-12 pr-6 text-white focus:border-tvPurple outline-none transition-all shadow-inner"
        />
      </div>

      <div className="space-y-6 relative before:absolute before:left-8 before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-800">
        {filtered.map(entry => (
          <JournalEntryCard key={entry.id} entry={entry} onRemove={removeJournalEntry} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-gray-800">
            <BookText className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No journal entries found matching your search.</p>
          </div>
        )}
      </div>
    </div>
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
    <div className="glass-card p-8 rounded-2xl border-tvPurple/30 mb-8 relative animate-in slide-in-from-top-4 duration-300">
       <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
       <h2 className="text-xl font-bold text-white mb-8">Log Your Market Insight</h2>
       
       <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
             <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Stock Symbol (Optional)</label>
                <input 
                  type="text" 
                  value={entry.symbol} 
                  onChange={e => setEntry({...entry, symbol: e.target.value.toUpperCase()})}
                  placeholder="e.g. BTCUSDT"
                  className="w-full bg-black/40 border border-gray-700/50 rounded-xl py-3 px-4 text-white focus:border-tvPurple outline-none"
                />
             </div>
             
             <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Entry Category</label>
                <div className="flex bg-black/40 p-1 rounded-xl border border-gray-700/50">
                   {['Bought', 'Sold', 'Watching', 'Learning'].map(t => (
                      <button 
                        key={t}
                        type="button"
                        onClick={() => setEntry({...entry, type: t as any})}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${entry.type === t ? 'bg-tvPurple text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                      >
                        {t}
                      </button>
                   ))}
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Your Mood</label>
                <div className="flex space-x-4">
                   {[
                      { id: 'HAPPY', emoji: <Smile />, color: 'text-tvGreen' },
                      { id: 'NEUTRAL', emoji: <Meh />, color: 'text-tvAmber' },
                      { id: 'SAD', emoji: <Frown />, color: 'text-tvRed' }
                   ].map(m => (
                      <button 
                        key={m.id}
                        type="button"
                        onClick={() => setEntry({...entry, mood: m.id as any})}
                        className={`p-3 rounded-xl border transition-all ${entry.mood === m.id ? `bg-white/5 border-white ${m.color}` : 'border-gray-800 text-gray-600 hover:border-gray-700'}`}
                      >
                         {m.emoji}
                      </button>
                   ))}
                </div>
             </div>
          </div>

          <div className="space-y-6">
             <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Observations & Strategy</label>
                <textarea 
                   value={entry.notes}
                   onChange={e => setEntry({...entry, notes: e.target.value})}
                   rows={4}
                   required
                   placeholder="Describe what indicators you read, why you made the move..."
                   className="w-full bg-black/40 border border-gray-700/50 rounded-xl py-3 px-4 text-white focus:border-tvPurple outline-none resize-none"
                />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Key Lesson (The &quot;Why&quot;)</label>
                <textarea 
                   value={entry.lesson}
                   onChange={e => setEntry({...entry, lesson: e.target.value})}
                   rows={2}
                   placeholder="What did this teach you about the market today?"
                   className="w-full bg-black/40 border border-gray-700/50 rounded-xl py-3 px-4 text-white focus:border-tvPurple outline-none resize-none"
                />
             </div>
          </div>

          <div className="md:col-span-2 pt-4">
             <button type="submit" className="w-full py-4 bg-tvPurple text-white font-bold rounded-xl text-lg hover:scale-[1.01] transition-all flex items-center justify-center space-x-2">
                <Save className="w-5 h-5" />
                <span>Save Entry to Learning Lab</span>
             </button>
          </div>
       </form>
    </div>
  )
}

function JournalEntryCard({ entry, onRemove }: { entry: JournalEntry, onRemove: any }) {
  const MoodIcon = entry.mood === 'HAPPY' ? Smile : entry.mood === 'NEUTRAL' ? Meh : Frown
  const moodColor = entry.mood === 'HAPPY' ? 'text-tvGreen' : entry.mood === 'NEUTRAL' ? 'text-tvAmber' : 'text-tvRed'

  return (
    <div className="relative pl-20 animate-in slide-in-from-left-4 duration-500">
       <div className="absolute left-4 top-0 w-8 h-8 rounded-full bg-[#111827] border-2 border-tvPurple flex items-center justify-center z-10 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
          <div className="w-2 h-2 rounded-full bg-tvPurple animate-pulse" />
       </div>

       <div className="glass-card p-6 rounded-2xl group relative overflow-hidden">
          <div className={`absolute top-0 right-0 w-32 h-32 opacity-[0.03] -mr-8 -mt-8 ${moodColor}`}>
             <MoodIcon className="w-full h-full" />
          </div>

          <button 
             onClick={() => onRemove(entry.id)}
             className="absolute top-4 right-4 p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-tvRed/10 text-gray-600 hover:text-tvRed transition-all"
          >
             <Trash2 className="w-4 h-4" />
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
             <div className="flex items-center space-x-3">
                <span className="text-2xl">{MoodIcon === Smile ? '😀' : MoodIcon === Meh ? '😐' : '😟'}</span>
                <div>
                   <h3 className="font-bold text-white text-lg flex items-center">
                      {entry.symbol || "General Insight"} 
                      <span className="mx-3 w-1 h-1 rounded-full bg-gray-700" />
                      <span className="text-tvPurple text-sm uppercase tracking-widest">{entry.type}</span>
                   </h3>
                   <p className="text-xs font-bold text-gray-500 uppercase mt-1 flex items-center">
                     <Calendar className="w-3 h-3 mr-1.5" /> {entry.date}
                   </p>
                </div>
             </div>
          </div>

          <div className="space-y-4">
             <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                <p className="text-gray-300 leading-relaxed text-sm italic italic-quotes">
                  &quot;{entry.notes}&quot;
                </p>
             </div>
             
             {entry.lesson && (
               <div className="flex items-start space-x-3 bg-tvPurple/5 p-4 rounded-xl border border-tvPurple/10">
                  <div className="p-1.5 rounded bg-tvPurple/20 text-tvPurple shrink-0">
                    <BookText className="w-4 h-4" />
                  </div>
                  <div>
                     <p className="text-xs font-bold text-tvPurple uppercase tracking-widest mb-1">Lesson Learned</p>
                     <p className="text-sm font-medium text-gray-300">{entry.lesson}</p>
                  </div>
               </div>
             )}
          </div>
       </div>
    </div>
  )
}

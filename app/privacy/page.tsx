export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 mb-20 animate-in fade-in space-y-8 bg-[#131722]/80 border border-gray-800 rounded-xl mt-8">
      <h1 className="text-3xl font-bold font-heading text-white border-b border-gray-800 pb-4">Privacy Policy</h1>
      
      <div className="prose prose-invert prose-gray max-w-none text-gray-300">
        <p><strong>Last Updated:</strong> March 2026</p>
        
        <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Data Collection</h2>
        <p>StoxPilot prioritizes your privacy. We store your personalization data (such as watchlists and theme preferences) <strong>in your browser only</strong> via <code>localStorage</code>.</p>
        <p>We do not track, sell, or collect personally identifiable financial data to third-party advertisers.</p>
        
        <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Authentication Data</h2>
        <p>StoxPilot is currently fully client-side. We do not use any external OAuth providers or maintain a backend database containing your personal information. Any "God Mode" authentication or authorization logic is handled entirely on your local device for the duration of your session or via <code>localStorage</code>.</p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Local Storage</h2>
        <p>Clearing your browser cache or <code>localStorage</code> will permanently delete your saved watchlists and custom platform configurations. Since we do not store this on backend servers, it cannot be recovered by us.</p>
      </div>
    </div>
  )
}

import { useState, useRef } from 'react'

// ── Reusable PDF/Text upload zone ──
function CVUpload({ inputMode, setInputMode, cvText, setCvText, cvFile, setCvFile, fileInputRef, onDrop, onChange }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs font-display text-gray-400 uppercase tracking-wide">Twoje CV</label>
        <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
          {[{id:'text',label:'✏️ Tekst'},{id:'pdf',label:'📎 PDF'}].map(m => (
            <button key={m.id} onClick={() => { setInputMode(m.id); setCvFile(null) }}
              className={`text-xs px-3 py-1 rounded-md font-medium transition-all ${inputMode===m.id?'bg-white text-green-600 shadow-sm':'text-gray-400 hover:text-gray-600'}`}>
              {m.label}
            </button>
          ))}
        </div>
      </div>
      {inputMode === 'text' ? (
        <textarea className="input resize-none h-40" placeholder="Wklej tutaj swoje CV lub kluczowe umiejętności..."
          value={cvText} onChange={e => setCvText(e.target.value)} />
      ) : (
        <div
          className={`h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all
            ${cvFile ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50 hover:border-green-300 hover:bg-green-50/50'}`}
          onClick={() => fileInputRef.current?.click()}
          onDrop={onDrop} onDragOver={e => e.preventDefault()}>
          <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={onChange} />
          {cvFile ? (
            <>
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl">📄</div>
              <div className="text-center">
                <p className="text-sm font-semibold text-green-700">{cvFile.name}</p>
                <p className="text-xs text-green-500 mt-0.5">{(cvFile.size/1024).toFixed(0)} KB · PDF gotowy</p>
              </div>
              <button onClick={e => { e.stopPropagation(); setCvFile(null) }}
                className="text-xs text-gray-400 hover:text-red-400 transition-colors">Usuń plik</button>
            </>
          ) : (
            <>
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl">📎</div>
              <p className="text-sm font-medium text-gray-500">Przeciągnij PDF lub kliknij</p>
              <p className="text-xs text-gray-300">Maks. 5MB</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default function AIAssistant() {
  const [tab, setTab] = useState('cv')

  // CV Analysis
  const [jobDesc, setJobDesc] = useState('')
  const [cvText, setCvText] = useState('')
  const [cvFile, setCvFile] = useState(null)
  const [cvInputMode, setCvInputMode] = useState('text')
  const [cvResult, setCvResult] = useState(null)
  const [cvLoading, setCvLoading] = useState(false)
  const cvFileRef = useRef(null)

  // Skills Map
  const [goal, setGoal] = useState('')
  const [skillsCvText, setSkillsCvText] = useState('')
  const [skillsCvFile, setSkillsCvFile] = useState(null)
  const [skillsCvInputMode, setSkillsCvInputMode] = useState('text')
  const [skillsResult, setSkillsResult] = useState(null)
  const [skillsLoading, setSkillsLoading] = useState(false)
  const skillsFileRef = useRef(null)

  const [error, setError] = useState('')

  function makeFileHandler(setFile, setError) {
    return function(e) {
      const file = e.target.files?.[0] || e.dataTransfer?.files?.[0]
      if (!file) return
      if (file.type !== 'application/pdf') { setError('Tylko pliki PDF są obsługiwane.'); return }
      if (file.size > 5 * 1024 * 1024) { setError('Plik PDF nie może przekraczać 5MB.'); return }
      setFile(file); setError('')
    }
  }

  function makeDrop(setFile) {
    return function(e) {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (!file || file.type !== 'application/pdf') return
      setFile(file)
    }
  }

  async function analyzeCV() {
    if (!jobDesc.trim()) { setError('Wypełnij treść ogłoszenia.'); return }
    if (cvInputMode === 'text' && !cvText.trim()) { setError('Wklej treść CV.'); return }
    if (cvInputMode === 'pdf' && !cvFile) { setError('Wgraj plik PDF z CV.'); return }
    setCvLoading(true); setError(''); setCvResult(null)
    try {
      let body, headers = {}
      if (cvInputMode === 'pdf') {
        const fd = new FormData(); fd.append('jobDesc', jobDesc); fd.append('cvPdf', cvFile)
        body = fd
      } else {
        headers['Content-Type'] = 'application/json'
        body = JSON.stringify({ jobDesc, cvText })
      }
      const res = await fetch('/api/analyze-cv', { method: 'POST', headers, body })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Błąd serwera')
      setCvResult(data)
    } catch(e) { setError('Błąd analizy: ' + e.message) }
    setCvLoading(false)
  }

  async function analyzeSkills() {
    if (!goal.trim()) { setError('Podaj cel zawodowy.'); return }
    if (skillsCvInputMode === 'text' && !skillsCvText.trim()) { setError('Wklej CV lub wgraj PDF.'); return }
    if (skillsCvInputMode === 'pdf' && !skillsCvFile) { setError('Wgraj plik PDF z CV.'); return }
    setSkillsLoading(true); setError(''); setSkillsResult(null)
    try {
      let body, headers = {}
      if (skillsCvInputMode === 'pdf') {
        const fd = new FormData(); fd.append('goal', goal); fd.append('cvPdf', skillsCvFile)
        body = fd
      } else {
        headers['Content-Type'] = 'application/json'
        body = JSON.stringify({ goal, cvText: skillsCvText })
      }
      const res = await fetch('/api/analyze-skills', { method: 'POST', headers, body })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Błąd serwera')
      setSkillsResult(data)
    } catch(e) { setError('Błąd analizy: ' + e.message) }
    setSkillsLoading(false)
  }

  return (
    <div className="animate-fade-in max-w-4xl">
      <div className="flex border-b border-gray-100 mb-6">
        {[{id:'cv',icon:'📄',label:'Analiza CV pod ofertę'},{id:'skills',icon:'🗺️',label:'Mapa umiejętności'}].map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setError('') }}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-display font-semibold border-b-2 -mb-px transition-all ${tab===t.id?'text-green-600 border-green-600':'text-gray-300 border-transparent hover:text-gray-500'}`}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {error && <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

      {/* ── CV TAB ── */}
      {tab === 'cv' && (
        <div>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-100 rounded-xl p-4 mb-5 text-sm text-gray-500">
            🤖 Wklej treść ogłoszenia i swoje CV (lub wgraj PDF) – Claude przeanalizuje dopasowanie i zasugeruje konkretne zmiany.
          </div>
          <div className="card p-5 mb-5">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-display text-gray-400 uppercase tracking-wide mb-2">Treść ogłoszenia</label>
                <textarea className="input resize-none h-40" placeholder="Wklej tutaj treść ogłoszenia o pracę..."
                  value={jobDesc} onChange={e => setJobDesc(e.target.value)} />
              </div>
              <CVUpload
                inputMode={cvInputMode} setInputMode={setCvInputMode}
                cvText={cvText} setCvText={setCvText}
                cvFile={cvFile} setCvFile={setCvFile}
                fileInputRef={cvFileRef}
                onDrop={makeDrop(setCvFile)}
                onChange={makeFileHandler(setCvFile, setError)}
              />
            </div>
            <div className="flex justify-end">
              <button onClick={analyzeCV} disabled={cvLoading} className="btn-primary">
                {cvLoading ? <><span className="animate-spin inline-block">⏳</span> Analizuję...</> : '✨ Analizuj dopasowanie'}
              </button>
            </div>
          </div>
          {cvResult && <CVResult data={cvResult} />}
        </div>
      )}

      {/* ── SKILLS TAB ── */}
      {tab === 'skills' && (
        <div>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-100 rounded-xl p-4 mb-5 text-sm text-gray-500">
            🗺️ Podaj cel zawodowy i wklej CV (lub wgraj PDF) – Claude wyciągnie Twoje umiejętności i stworzy spersonalizowany plan rozwoju.
          </div>
          <div className="card p-5 mb-5">
            <div className="mb-4">
              <label className="block text-xs font-display text-gray-400 uppercase tracking-wide mb-2">🎯 Cel zawodowy</label>
              <input className="input" type="text"
                placeholder="np. Senior Product Manager, Data Scientist, DevOps Engineer..."
                value={goal} onChange={e => setGoal(e.target.value)} />
            </div>
            <CVUpload
              inputMode={skillsCvInputMode} setInputMode={setSkillsCvInputMode}
              cvText={skillsCvText} setCvText={setSkillsCvText}
              cvFile={skillsCvFile} setCvFile={setSkillsCvFile}
              fileInputRef={skillsFileRef}
              onDrop={makeDrop(setSkillsCvFile)}
              onChange={makeFileHandler(setSkillsCvFile, setError)}
            />
            <div className="flex justify-end mt-4">
              <button onClick={analyzeSkills} disabled={skillsLoading} className="btn-primary">
                {skillsLoading ? <><span className="animate-spin inline-block">⏳</span> Analizuję CV...</> : '🗺️ Generuj mapę umiejętności'}
              </button>
            </div>
          </div>
          {skillsResult && <SkillsResult data={skillsResult} />}
        </div>
      )}
    </div>
  )
}

function CVResult({ data }) {
  const score = data.matchScore || 0
  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex items-center gap-5 pb-5 mb-5 border-b border-gray-50">
        <div className="relative w-16 h-16 shrink-0">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="#f0fdf4" strokeWidth="6"/>
            <circle cx="32" cy="32" r="28" fill="none" stroke="#16a34a" strokeWidth="6"
              strokeDasharray={`${2*Math.PI*28}`} strokeDashoffset={`${2*Math.PI*28*(1-score/100)}`}
              strokeLinecap="round" className="transition-all duration-1000"/>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-display font-black text-green-600 text-sm">{score}%</span>
        </div>
        <div>
          <p className="font-display font-bold text-lg text-gray-800">{data.matchLabel || 'Analiza zakończona'}</p>
          <p className="text-sm text-gray-400 mt-0.5">{data.summary}</p>
        </div>
      </div>
      {data.matchedKeywords?.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">✅ Dopasowane słowa kluczowe</p>
          <div className="flex flex-wrap gap-2">{data.matchedKeywords.map(k => <span key={k} className="bg-green-50 text-green-700 text-xs px-3 py-1 rounded-lg font-medium">{k}</span>)}</div>
        </div>
      )}
      {data.missingKeywords?.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">❌ Brakujące słowa kluczowe</p>
          <div className="flex flex-wrap gap-2">{data.missingKeywords.map(k => <span key={k} className="bg-red-50 text-red-500 text-xs px-3 py-1 rounded-lg font-medium">{k}</span>)}</div>
        </div>
      )}
      {data.suggestions?.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">💡 Sugestie do CV</p>
          <div className="space-y-2">{data.suggestions.map((s,i) => <div key={i} className="bg-gray-50 border-l-4 border-green-500 rounded-r-xl px-4 py-3 text-sm text-gray-600">{s}</div>)}</div>
        </div>
      )}
    </div>
  )
}

function SkillsResult({ data }) {
  return (
    <div className="card p-6 animate-fade-in">
      <div className="mb-6">
        <p className="font-display font-bold text-gray-800 mb-3">📊 Twój obecny poziom gotowości</p>
        <div className="grid grid-cols-3 gap-3">
          {[{label:'Gotowość do roli',value:`${data.readiness||0}%`,color:'text-green-600'},{label:'Luki do uzupełnienia',value:data.gaps?.length||0,color:'text-yellow-500'},{label:'Szac. czas nauki',value:data.timeEstimate||'?',color:'text-blue-500'}].map(s => (
            <div key={s.label} className="card p-4 text-center">
              <p className={`font-display font-black text-2xl ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
      {data.skills?.length > 0 && (
        <div className="mb-6">
          <p className="font-display font-bold text-gray-800 mb-3">🔍 Analiza umiejętności</p>
          <div className="space-y-3">
            {data.skills.map((s,i) => (
              <div key={i} className="card p-4 flex items-center gap-4 hover:border-green-200 transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${s.status==='done'?'bg-green-50':s.status==='partial'?'bg-yellow-50':'bg-red-50'}`}>{s.status==='done'?'✅':s.status==='partial'?'⚡':'❌'}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{s.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.description}</p>
                </div>
                <div className="flex flex-col items-end gap-1 min-w-32">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.status==='done'?'bg-green-50 text-green-600':s.status==='partial'?'bg-yellow-50 text-yellow-600':'bg-red-50 text-red-500'}`}>{s.status==='done'?'Masz ✓':s.status==='partial'?'Do rozwinięcia':'Brakuje'}</span>
                  <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${s.status==='done'?'bg-green-500':s.status==='partial'?'bg-yellow-400':'bg-red-400'}`} style={{width:`${s.level||0}%`}}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-5">
        {data.roadmap?.length > 0 && (
          <div>
            <p className="font-display font-bold text-gray-800 mb-3">🚀 Plan działania</p>
            <div className="space-y-4">
              {data.roadmap.map((step,i) => (
                <div key={i} className="flex gap-3 relative">
                  {i < data.roadmap.length-1 && <div className="absolute left-4 top-9 w-0.5 h-full bg-gray-100"/>}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-display shrink-0 z-10 ${i===0?'bg-green-600 text-white':'bg-gray-100 text-gray-400 border-2 border-gray-200'}`}>{i+1}</div>
                  <div className="pt-1 pb-4">
                    <p className="text-sm font-semibold text-gray-700">{step.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{step.description}</p>
                    <p className="text-xs text-gray-300 mt-1">⏱ {step.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {data.courses?.length > 0 && (
          <div>
            <p className="font-display font-bold text-gray-800 mb-3">📚 Polecane kursy</p>
            <div className="space-y-2">
              {data.courses.map((c,i) => (
                <div key={i} className="card p-3 flex items-center gap-3 hover:border-green-200 transition-all hover:translate-x-1 cursor-pointer">
                  <span className={`text-xs font-bold px-2 py-1 rounded min-w-16 text-center ${c.free?'bg-green-50 text-green-600':'bg-gray-50 text-gray-400'}`}>{c.platform}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-700 truncate">{c.title}</p>
                    <p className="text-xs text-gray-300">{c.duration}</p>
                  </div>
                  <p className={`text-xs font-bold shrink-0 ${c.free?'text-green-600':'text-gray-500'}`}>{c.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

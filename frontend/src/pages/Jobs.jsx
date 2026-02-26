import { useState } from 'react'

const JOBS = [
  { id:1, title:'Senior React Developer', company:'Microsoft', location:'Warszawa', salary:'20 000–28 000 PLN', tags:['React','TypeScript','Azure'], source:'LinkedIn', posted:'Dziś', color:'text-blue-500' },
  { id:2, title:'Full Stack Python/React', company:'Startup XYZ', location:'Zdalnie', salary:'15 000–22 000 PLN', tags:['Python','React','PostgreSQL'], source:'NoFluffJobs', posted:'2h temu', color:'text-green-600', remote:true },
  { id:3, title:'UX Designer', company:'ABB', location:'Wrocław', salary:'10 000–15 000 PLN', tags:['Figma','UX Research','Prototyping'], source:'Pracuj.pl', posted:'1 dzień temu', color:'text-purple-500' },
  { id:4, title:'DevOps Engineer', company:'CloudFly', location:'Zdalnie', salary:'18 000–26 000 PLN', tags:['Kubernetes','Docker','Terraform'], source:'JustJoin.it', posted:'3h temu', color:'text-yellow-500', remote:true },
  { id:5, title:'Android Developer (Kotlin)', company:'AppStudio', location:'Kraków', salary:'14 000–19 000 PLN', tags:['Kotlin','Android','MVVM'], source:'LinkedIn', posted:'5h temu', color:'text-red-400' },
  { id:6, title:'Data Scientist (ML)', company:'DataSoft', location:'Zdalnie', salary:'16 000–24 000 PLN', tags:['Python','TensorFlow','SQL'], source:'NoFluffJobs', posted:'Wczoraj', color:'text-cyan-500', remote:true },
]

export default function Jobs({ onApply }) {
  const [applied, setApplied] = useState(new Set())

  function handleApply(job) {
    if (applied.has(job.id)) return
    setApplied(prev => new Set([...prev, job.id]))
    onApply(job.company, job.title)
  }

  return (
    <div className="animate-fade-in">
      {/* Search bar */}
      <div className="flex gap-3 mb-6">
        <input type="text" className="input flex-1" placeholder="🔍 Szukaj: React, Python, Designer..." />
        <select className="input w-40">
          <option>Cała Polska</option><option>Warszawa</option><option>Wrocław</option><option>Kraków</option><option>Zdalnie</option>
        </select>
        <select className="input w-36">
          <option>Wszystkie portale</option><option>LinkedIn</option><option>Pracuj.pl</option><option>NoFluffJobs</option><option>JustJoin.it</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {JOBS.map(job => (
          <div key={job.id} className="card p-5 hover:border-green-300 hover:-translate-y-0.5 transition-all duration-200 hover:shadow-md relative">
            <span className="absolute top-4 right-4 text-xs bg-gray-50 text-gray-300 px-2 py-0.5 rounded">{job.source}</span>
            <div className="flex items-start gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center font-display font-bold text-sm shrink-0 ${job.color}`}>
                {job.company.substring(0,2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm pr-16">{job.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{job.company} · {job.location}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {job.tags.map(t => (
                <span key={t} className="bg-gray-50 text-gray-400 text-xs px-2 py-0.5 rounded">{t}</span>
              ))}
              {job.remote && <span className="bg-green-50 text-green-600 text-xs px-2 py-0.5 rounded font-medium">Zdalnie</span>}
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
              <span className="text-sm font-bold text-green-600">{job.salary}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-300">{job.posted}</span>
                <button onClick={() => handleApply(job)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all
                    ${applied.has(job.id) ? 'bg-green-50 text-green-600 cursor-default' : 'btn-primary text-xs px-3 py-1.5'}`}>
                  {applied.has(job.id) ? '✓ Dodano' : 'Aplikuj'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

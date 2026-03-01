import { CHANGELOG } from '../data/changelog'

export default function ChangelogModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
        style={{backgroundColor: 'var(--bg-card)'}}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b"
          style={{borderColor: 'var(--border)'}}>
          <div>
            <h2 className="font-display font-black text-lg" style={{color: 'var(--text-primary)'}}>
              🆕 Co nowego?
            </h2>
            <p className="text-xs mt-0.5" style={{color: 'var(--text-muted)'}}>
              Historia zmian JobTrack
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:opacity-70"
            style={{color: 'var(--text-muted)'}}>
            ✕
          </button>
        </div>

        {/* Changelog list */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-6">
          {CHANGELOG.map((release, i) => (
            <div key={release.version}>
              {/* Version header */}
              <div className="flex items-center gap-3 mb-3">
                <span className={`font-display font-black text-sm px-2.5 py-1 rounded-lg ${
                  i === 0 ? 'bg-green-600 text-white' : 'bg-green-500/10 text-green-600'
                }`}>
                  v{release.version}
                </span>
                {i === 0 && (
                  <span className="text-xs font-semibold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                    Najnowsza
                  </span>
                )}
                <span className="text-xs ml-auto" style={{color: 'var(--text-muted)'}}>
                  {release.date}
                </span>
              </div>

              {/* Changes */}
              <div className="space-y-2">
                {release.changes.map((change, j) => (
                  <div key={j} className="flex items-start gap-2">
                    <p className="text-sm leading-relaxed" style={{color: 'var(--text-secondary)'}}>
                      {change}
                    </p>
                  </div>
                ))}
              </div>

              {/* Divider */}
              {i < CHANGELOG.length - 1 && (
                <div className="mt-5 border-b" style={{borderColor: 'var(--border)'}} />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t text-center" style={{borderColor: 'var(--border)'}}>
          <p className="text-xs" style={{color: 'var(--text-muted)'}}>
            Masz pomysł na funkcję?{' '}
            <a href="mailto:hello@jobtrack.pl" className="text-green-600 hover:underline font-medium">
              Napisz do nas
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

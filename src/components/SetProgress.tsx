interface Props {
  setCode: string;
  setName: string;
  owned: number;
  total: number;
}

export default function SetProgress({ setCode, setName, owned, total }: Props) {
  const pct = total > 0 ? Math.round((owned / total) * 100) : 0;
  const isComplete = pct === 100;

  return (
    <div
      className="rounded-xl p-4 border"
      style={{
        background: isComplete ? 'rgba(255,215,0,0.06)' : 'rgba(255,255,255,0.02)',
        borderColor: isComplete ? 'rgba(255,215,0,0.25)' : 'rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <div>
          <span className="text-sm font-semibold" style={{ color: isComplete ? '#ffd700' : '#e4e4e7' }}>
            {setCode}
          </span>
          <span className="text-xs ml-2" style={{ color: '#71717a' }}>{setName}</span>
        </div>
        <span
          className="text-sm font-bold font-orbitron"
          style={{ color: isComplete ? '#ffd700' : '#e4e4e7' }}
        >
          {owned}/{total} <span className="text-xs font-normal" style={{ color: '#71717a' }}>({pct}%)</span>
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.06)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: isComplete
              ? 'linear-gradient(90deg, #ffd700, #ffed4e)'
              : 'linear-gradient(90deg, #ff3d3d, #ff6b6b)',
          }}
        />
      </div>

      {isComplete && (
        <p className="text-xs mt-1.5 font-semibold" style={{ color: '#ffd700' }}>
          ✓ Set vollständig!
        </p>
      )}
    </div>
  );
}

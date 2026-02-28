import { useEffect, useState } from 'react';
import { useCollection } from '@/context/CollectionContext';

export default function AchievementToast() {
  const { newAchievement, clearNewAchievement } = useCollection();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (newAchievement) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(clearNewAchievement, 350);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [newAchievement, clearNewAchievement]);

  if (!newAchievement) return null;

  return (
    <div
      className={`fixed bottom-20 right-4 z-[60] flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-350 ${visible ? 'animate-slide-up' : 'opacity-0 translate-y-4'}`}
      style={{
        background: 'linear-gradient(135deg, rgba(18,18,26,0.98) 0%, rgba(30,25,10,0.98) 100%)',
        border: '2px solid #ffd700',
        boxShadow: '0 0 30px rgba(255,215,0,0.3), 0 8px 32px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(16px)',
        minWidth: '280px',
        maxWidth: '340px',
      }}
    >
      {/* Icon */}
      <div
        className="flex items-center justify-center w-12 h-12 rounded-xl text-2xl flex-shrink-0"
        style={{ background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.3)' }}
      >
        {newAchievement.icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold mb-0.5" style={{ color: '#ffd700' }}>
          Achievement freigeschaltet!
        </p>
        <p className="text-sm font-bold truncate" style={{ color: '#e4e4e7' }}>
          {newAchievement.title}
        </p>
        <p className="text-xs leading-snug" style={{ color: '#71717a' }}>
          {newAchievement.description}
        </p>
      </div>

      {/* Close */}
      <button
        onClick={() => { setVisible(false); setTimeout(clearNewAchievement, 350); }}
        className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-xs cursor-pointer border-0"
        style={{ background: 'rgba(255,255,255,0.08)', color: '#71717a' }}
      >
        ✕
      </button>
    </div>
  );
}

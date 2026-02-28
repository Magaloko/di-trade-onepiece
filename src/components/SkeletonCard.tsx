export default function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{
        background: '#12121a',
        borderColor: 'rgba(255,255,255,0.06)',
        aspectRatio: '2.5 / 3.5',
        position: 'relative',
      }}
    >
      {/* Shimmer overlay */}
      <div className="animate-shimmer absolute inset-0" />

      {/* Fake rarity badge */}
      <div
        className="absolute top-3 right-3 rounded-full"
        style={{ width: '48px', height: '18px', background: 'rgba(255,255,255,0.06)' }}
      />

      {/* Fake price bar at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 px-3 py-3 flex justify-between items-center"
        style={{ background: 'rgba(0,0,0,0.4)' }}
      >
        <div style={{ width: '50px', height: '14px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }} />
        <div style={{ width: '36px', height: '14px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }} />
      </div>
    </div>
  );
}

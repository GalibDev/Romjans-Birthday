export function StarField() {
  return (
    <div className="starfield" aria-hidden="true">
      {Array.from({ length: 48 }, (_, i) => (
        <i
          key={i}
          style={{
            left: `${(i * 37.17) % 100}%`,
            top: `${(i * 19.31) % 100}%`,
            animationDelay: `${i % 7}s`,
            width: i % 5 === 0 ? 3 : 1,
            height: i % 5 === 0 ? 3 : 1,
          }}
        />
      ))}
      <span className="hanging-star one">✧</span>
      <span className="hanging-star two">✧</span>
      <span className="hanging-star three">✦</span>
    </div>
  );
}

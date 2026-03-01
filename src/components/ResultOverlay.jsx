import { useEffect } from 'react'
import confetti from 'canvas-confetti'

export function ResultOverlay({ result, counts, onIncrementCount, onRollAgain, onEdit }) {
  useEffect(() => {
    if (!result) return
    const colors = ['#ff0000', '#ff6600', '#ffcc00', '#00cc44', '#0088ff', '#cc00ff', '#ff66cc']
    const fire = (origin) => confetti({
      particleCount: 80,
      spread: 120,
      origin,
      colors,
      startVelocity: 45,
      gravity: 0.8,
      ticks: 200,
    })
    fire({ x: 0.2, y: 0.5 })
    fire({ x: 0.5, y: 0.3 })
    fire({ x: 0.8, y: 0.5 })
    setTimeout(() => fire({ x: 0.1, y: 0.6 }), 200)
    setTimeout(() => fire({ x: 0.9, y: 0.6 }), 200)
    setTimeout(() => fire({ x: 0.5, y: 0.5 }), 400)
  }, [result])

  if (!result) return null

  const count = counts[result.label] || 0

  return (
    <div className="result-overlay">
      <div className="result-card">
        <div className="result-face">#{result.value}</div>
        <div className="result-label">{result.label}</div>
        <div className="result-count-row">
          <span className="count-label">Times landed:</span>
          <button className="count-btn" onClick={onIncrementCount}>
            {count} <span className="plus-icon">+</span>
          </button>
        </div>
        <div className="result-actions">
          <button className="action-btn primary" onClick={onRollAgain}>Roll again</button>
          <button className="action-btn secondary" onClick={onEdit}>Edit choices</button>
        </div>
      </div>
    </div>
  )
}

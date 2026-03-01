import { useEffect } from 'react'
import { useDiceBox } from '../hooks/useDiceBox'

const CONTAINER_ID = 'dice-canvas-container'

export function DiceCanvas({ mode, diceType, onRollComplete, onReady }) {
  const { roll, ready } = useDiceBox(`#${CONTAINER_ID}`, onRollComplete)

  // Show demo dice on ready
  useEffect(() => {
    onReady?.(ready)
    if (ready) roll(diceType, 5)
  }, [ready])

  // Re-roll preview when dice type changes (only during idle modes)
  useEffect(() => {
    if (!ready) return
    if (mode === 'rolling' || mode === 'result') return
    roll(diceType, 5)
  }, [diceType])

  // Actual roll
  useEffect(() => {
    if (mode === 'rolling') roll(diceType)
  }, [mode])

  const handleClick = () => {
    if (!ready || mode === 'rolling' || mode === 'result') return
    roll(diceType, 5)
  }

  return (
    <div
      className="dice-canvas-wrapper"
      onClick={handleClick}
      style={{ cursor: ready && mode !== 'rolling' && mode !== 'result' ? 'pointer' : 'default' }}
    >
      <div id={CONTAINER_ID} className="dice-canvas" />
    </div>
  )
}

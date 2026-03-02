import { useState, useEffect, useRef } from 'react'
import { DiceCanvas } from './components/DiceCanvas'
import { LandingPage } from './components/LandingPage'
import { ChoicesPanel } from './components/ChoicesPanel'
import { ResultOverlay } from './components/ResultOverlay'
import './App.css'

function getDiceType(count) {
  if (count <= 6) return 6
  if (count <= 8) return 8
  if (count <= 10) return 10
  if (count <= 12) return 12
  return 20
}

export function getDiceLabel(sides) {
  const labels = { 6: 'Cube', 8: 'Octa', 10: 'Deca', 12: 'Dodeca', 20: 'Icosa' }
  return labels[sides] ?? `${sides}-sided`
}

export default function App() {
  const [choices, setChoices] = useState(() => {
    try {
      const saved = localStorage.getItem('dice-choices')
      if (saved) return JSON.parse(saved)
    } catch {}
    return ['', '']
  })

  useEffect(() => {
    localStorage.setItem('dice-choices', JSON.stringify(choices))
  }, [choices])
  const [mode, setMode] = useState('landing') // 'landing' | 'edit' | 'rolling' | 'result'
  const [result, setResult] = useState(null)
  const [counts, setCounts] = useState({})
  const [diceReady, setDiceReady] = useState(false)
  const [muted, setMuted] = useState(false)
  const diceAudioRef = useRef(null)

  const filledChoices = choices.filter(c => c.trim())
  const diceType = getDiceType(choices.length)

  const handleRoll = () => {
    setResult(null)
    setMode('rolling')
    if (!muted) {
      const audio = new Audio('/assets/dice-final.mp3')
      diceAudioRef.current = audio
      audio.play().catch(() => {})
    }
  }

  const handleRollComplete = (value) => {
    if (value == null || mode !== 'rolling' || filledChoices.length === 0) return
    if (diceAudioRef.current) {
      diceAudioRef.current.pause()
      diceAudioRef.current = null
    }
    const idx = ((value - 1) % filledChoices.length + filledChoices.length) % filledChoices.length
    const label = filledChoices[idx]
    setTimeout(() => {
      setResult({ value, label })
      setMode('result')
      if (!muted) new Audio('/assets/result-final.mp3').play().catch(() => {})
    }, 700)
  }

  const handleIncrementCount = () => {
    if (!result) return
    setCounts(prev => ({ ...prev, [result.label]: (prev[result.label] || 0) + 1 }))
  }

  return (
    <div className="app">
      {/* Dice canvas always mounted in background */}
      <DiceCanvas
        mode={mode}
        diceType={diceType}
        onRollComplete={handleRollComplete}
        onReady={setDiceReady}
      />

      {mode === 'landing' && (
        <LandingPage onStart={() => setMode('edit')} />
      )}

      {mode === 'edit' && (
        <ChoicesPanel
          choices={choices}
          setChoices={setChoices}
          diceType={diceType}
          diceReady={diceReady}
          onRoll={handleRoll}
        />
      )}

      {mode === 'rolling' && (
        <div className="rolling-indicator">Rolling...</div>
      )}

      {mode === 'result' && result && (
        <ResultOverlay
          result={result}
          counts={counts}
          onIncrementCount={handleIncrementCount}
          onRollAgain={() => { setResult(null); setMode('rolling') }}
          onEdit={() => { setResult(null); setMode('edit') }}
        />
      )}

      <button className="mute-btn" onClick={() => setMuted(m => !m)} title={muted ? 'Unmute' : 'Mute'}>
        {muted ? '🔇' : '🔊'}
      </button>

      <a className="made-by" href="https://www.justdraftone.xyz/" target="_blank" rel="noreferrer">
        <span style={{ marginTop: '3px', fontFamily: 'Arial, Helvetica, sans-serif' }}>by</span>
        <img src="/draftone.svg" alt="Draftone" className="made-by-wordmark" />
      </a>
    </div>
  )
}

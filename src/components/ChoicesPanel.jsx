import { useState, useRef } from 'react'
import { getDiceLabel } from '../App'

export function ChoicesPanel({ choices, setChoices, diceType, diceReady, onRoll }) {
  const [inputVal, setInputVal] = useState('')
  const inputRef = useRef(null)

  const canRoll = choices.filter(c => c.trim()).length >= 2 && diceReady

  const update = (i, val) => {
    const next = [...choices]
    next[i] = val
    setChoices(next)
  }

  const remove = (i) => {
    if (choices.length > 2) setChoices(choices.filter((_, idx) => idx !== i))
  }

  const duplicate = (i) => {
    if (choices.length < 20) {
      const next = [...choices]
      next.splice(i + 1, 0, choices[i])
      setChoices(next)
    }
  }

  const shuffle = () => {
    const next = [...choices]
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]]
    }
    setChoices(next)
  }

  const addSingle = () => {
    const val = inputVal.trim()
    if (choices.length >= 20) return
    setChoices([...choices, val])
    setInputVal('')
    inputRef.current?.focus()
  }

  const handlePaste = (e) => {
    const text = e.clipboardData.getData('text')
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
    if (lines.length <= 1) return // single line — let default paste handle it
    e.preventDefault()
    const combined = [...choices.filter(c => c.trim()), ...lines].slice(0, 20)
    while (combined.length < 2) combined.push('')
    setChoices(combined)
    setInputVal('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (inputVal.trim()) addSingle()
    }
  }

  // On mobile: start low (few choices) and rise as choices grow
  const mobileTop = Math.max(10, 62 - ((choices.length - 2) / 18) * 52)

  return (
    <div className="choices-panel" style={{ '--mobile-top': `${mobileTop}vh` }}>
      <div className="panel-header">
        <h2>Choices <span className="choices-count">{choices.filter(c => c.trim()).length}</span></h2>
        <div className="panel-header-actions">
          <button className="header-btn" onClick={shuffle}>⇅ Shuffle</button>
          <span className="dice-badge">{getDiceLabel(diceType)}</span>
        </div>
      </div>

      <div className="choices-list">
        {choices.length < 20 && (
          <div className="choice-add-row">
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onPaste={handlePaste}
              onKeyDown={handleKeyDown}
              placeholder="Type or paste multiple lines..."
              className="choice-input add-input"
            />
            <button className="icon-btn add-plus-btn" onClick={addSingle} title="Add">+</button>
          </div>
        )}

        <div className="list-divider" />

        {choices.map((choice, i) => (
          <div key={i} className="choice-row">
            <span className="choice-num">{i + 1}</span>
            <input
              type="text"
              value={choice}
              onChange={e => update(i, e.target.value)}
              placeholder={`Choice ${i + 1}`}
              className="choice-input"
              maxLength={40}
            />
            {choices.length < 20 && (
              <button className="icon-btn" onClick={() => duplicate(i)} title="Duplicate">⧉</button>
            )}
            {choices.length > 2 && (
              <button className="icon-btn remove-btn" onClick={() => remove(i)} title="Remove">×</button>
            )}
          </div>
        ))}
      </div>

      <div className="panel-actions">
        <button className="roll-btn" onClick={onRoll} disabled={!canRoll}>
          {diceReady ? 'Roll' : 'Loading...'}
        </button>
      </div>
    </div>
  )
}

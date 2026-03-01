import { useEffect, useRef, useState } from 'react'
import DiceBox from '@3d-dice/dice-box'

export function useDiceBox(selector, onRollComplete) {
  const diceBoxRef = useRef(null)
  const initializedRef = useRef(false)
  const onRollCompleteRef = useRef(onRollComplete)
  const pendingRollRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    onRollCompleteRef.current = onRollComplete
  })

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    requestAnimationFrame(() => {
      const box = new DiceBox({
        container: selector,
        assetPath: '/assets/dice-box/',
        theme: 'smooth-pip',
        themeColor: '#ffffff',
        offscreen: false,
        gravity: 2,
        mass: 1,
        friction: 0.8,
        restitution: 0.3,
        angularDamping: 0.4,
        linearDamping: 0.4,
        spinForce: 8,
        throwForce: 5,
        startingHeight: 15,
        settleTimeout: 5000,
        scale: 7,
      })

      box.init()
        .then(() => {
          box.resizeWorld()
          box.onRollComplete = (results) => {
            onRollCompleteRef.current(results[0]?.value)
          }
          diceBoxRef.current = box
          setReady(true)
          if (pendingRollRef.current) {
            const { notation, theme } = pendingRollRef.current
            box.roll(notation, { theme })
            pendingRollRef.current = null
          }
        })
        .catch((err) => {
          console.error('[DiceBox] init failed:', err)
        })
    })
  }, [])

  const roll = (sides, count = 1) => {
    const isPip = sides === 6
    const notation = isPip ? `${count}dpip` : `${count}d${sides}`
    const theme = isPip ? 'smooth-pip' : 'smooth'
    if (diceBoxRef.current) {
      diceBoxRef.current.roll(notation, { theme })
    } else {
      pendingRollRef.current = { notation, theme }
    }
  }

  return { roll, ready }
}

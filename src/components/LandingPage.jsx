export function LandingPage({ onStart }) {
  return (
    <div className="landing">
      <div className="landing-content">
        <img src="/dice.png" alt="dice" className="landing-logo" />
        <h1 className="landing-title">Roll the Dice</h1>
        <p className="landing-desc">
          Add your choices, roll the dice,<br />let fate decide.
        </p>
        <button className="landing-btn" onClick={onStart}>
          Get Started
        </button>
      </div>
    </div>
  )
}

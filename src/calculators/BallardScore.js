import { useState } from "react";

function BallardScore() {
  const [scores, setScores] = useState({
    posture: 0,
    squareWindow: 0,
    armRecoil: 0,
    poplitealAngle: 0,
    scarfSign: 0,
    heelToEar: 0,
    skin: 0,
    lanugo: 0,
    plantarCreases: 0,
    breast: 0,
    eyeEar: 0,
    genitals: 0,
  });

  const handleChange = (param, value) => {
    setScores({ ...scores, [param]: parseInt(value) });
  };

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  // Convert to GA (New Ballard Score: GA = (score × 0.4) + 24)
  const gestAge = (totalScore * 0.4 + 24).toFixed(1);

  const category =
    gestAge < 37 ? "Preterm" : gestAge <= 42 ? "Term" : "Post-term";

  return (
    <div className="ballard-container">
      <h2>Prematurity Assessment (New Ballard Score)</h2>

      <div className="ballard-grid">
        {/* Example inputs */}
        <div>
          <label>Posture</label>
          <select onChange={(e) => handleChange("posture", e.target.value)}>
            <option value="0">0 - Limp</option>
            <option value="1">1 - Slight flexion</option>
            <option value="2">2 - Moderate flexion</option>
            <option value="3">3 - Well flexed</option>
            <option value="4">4 - Full flexion</option>
          </select>
        </div>
<p></p>
        <div>
          <label>Square Window (Wrist)</label>
          <select onChange={(e) => handleChange("squareWindow", e.target.value)}>
            <option value="0">0 - >90°</option>
            <option value="1">1 - 60°</option>
            <option value="2">2 - 45°</option>
            <option value="3">3 - 30°</option>
            <option value="4">4 - 0°</option>
          </select>
        </div>
<p></p>
        <div>
          <label>Arm Recoil</label>
          <select onChange={(e) => handleChange("armRecoil", e.target.value)}>
            <option value="0">0 - No recoil</option>
            <option value="1">1 - Slight recoil</option>
            <option value="2">2 - Strong recoil</option>
            <option value="3">3 - Immediate recoil</option>
          </select>
        </div>

      </div>

      <div className="ballard-result">
        <h3>Total Score: {totalScore}</h3>
        <h3>Estimated GA: {gestAge} weeks</h3>
        <h3>Status: <span className={category.toLowerCase()}>{category}</span></h3>
      </div>
    </div>
  );
}

export default BallardScore;

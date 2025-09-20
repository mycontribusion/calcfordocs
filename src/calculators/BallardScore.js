import { useState } from "react";

export default function BallardScore() {
  const [scores, setScores] = useState({
    // Neuromuscular Maturity
    posture: 0,
    squareWindow: -1,
    armRecoil: 0,
    poplitealAngle: -1,
    scarfSign: -1,
    heelToEar: -1,
    // Physical Maturity
    skin: -1,
    lanugo: 0,
    plantarCreases: -1,
    breast: -1,
    eyeEar: -1,
    genitals: -1,
    maleGenitals: -1,   // 👈 added
    femaleGenitals: -1, // 👈 added
  });
  const [sex, setSex] = useState("male");

  const handleChange = (param, value) => {
    setScores({ ...scores, [param]: parseInt(value) });
  };

  const genitalScore = sex === "male" ? scores.maleGenitals : scores.femaleGenitals || 0;


  const totalScore =
    Object.entries(scores)
      .filter(([key]) => key !== "maleGenitals" && key !== "femaleGenitals")
      .reduce((a, [, b]) => a + b, 0) + genitalScore;

  // Approximate GA mapping
  const getGestationalAge = (score) => {
    if (score <= 5) {
      const gaMapping = {
        "-10": 20,
        "-5": 22,
        "0": 24,
        "5": 26,
      };
      return gaMapping[score.toString()] || "N/A";
    }
    return (score * 0.4 + 24).toFixed(1);
  };

  const gestAge = getGestationalAge(totalScore);
  const category =
    gestAge < 37 ? "Preterm" : gestAge <= 42 ? "Term" : "Post-term";

  return (
    <div className="ballard-container">
      <h2>Prematurity Assessment (Dubowitz/Ballard)</h2>
      <p>Fill out the scores for a complete assessment.</p>

      <div>
        <label>
          <input
            type="radio"
            value="male"
            checked={sex === "male"}
            onChange={() => setSex("male")}
          />
          Male
        </label>
        <label style={{ marginLeft: "1rem" }}>
          <input
            type="radio"
            value="female"
            checked={sex === "female"}
            onChange={() => setSex("female")}
          />
          Female
        </label>
      </div>

      <div className="ballard-grid">
        {/* Neuromuscular Maturity */}
        <div className="ballard-section">
          <h3>Neuromuscular Maturity</h3>

          <div className="param-group">
            <label>Posture</label>
            <select onChange={(e) => handleChange("posture", e.target.value)}>
              <option value="0">0 - Limp</option>
              <option value="1">1 - Slight flexion</option>
              <option value="2">2 - Moderate flexion</option>
              <option value="3">3 - Well flexed</option>
              <option value="4">4 - Full flexion</option>
            </select>
          </div>

          <div className="param-group">
            <label>Square Window (Wrist)</label>
            <select onChange={(e) => handleChange("squareWindow", e.target.value)}>
              <option value="-1">-1 - &gt;90°</option>
              <option value="0">0 - 90°</option>
              <option value="1">1 - 60°</option>
              <option value="2">2 - 45°</option>
              <option value="3">3 - 30°</option>
              <option value="4">4 - 0°</option>
            </select>
          </div>

          <div className="param-group">
            <label>Arm Recoil</label>
            <select onChange={(e) => handleChange("armRecoil", e.target.value)}>
              <option value="0">0 - 180°</option>
              <option value="1">1 - 140° - 180°</option>
              <option value="2">2 - 110° - 140°</option>
              <option value="3">3 - 90° - 110°</option>
              <option value="4">4 - &lt;90°</option>
            </select>
          </div>

          <div className="param-group">
            <label>Popliteal Angle</label>
            <select onChange={(e) => handleChange("poplitealAngle", e.target.value)}>
              <option value="-1">-1 - 180°</option>
              <option value="0">0 - 160°</option>
              <option value="1">1 - 140°</option>
              <option value="2">2 - 120°</option>
              <option value="3">3 - 100°</option>
              <option value="4">4 - 90°</option>
              <option value="5">5 - &lt;90°</option>
            </select>
          </div>

          <div className="param-group">
            <label>Scarf Sign</label>
            <select onChange={(e) => handleChange("scarfSign", e.target.value)}>
              <option value="-1">-1 - Elbow reaches neck</option>
              <option value="0">0 - Elbow at contralateral axillary line</option>
              <option value="1">1 - Elbow at contralateral nipple line</option>
              <option value="2">2 - Elbow at xiphoid process</option>
              <option value="3">3 - Elbow at ipsilateral nipple line</option>
              <option value="4">4 - Elbow at ipsilateral axillary line</option>
            </select>
          </div>

          <div className="param-group">
            <label>Heel to Ear</label>
            <select onChange={(e) => handleChange("heelToEar", e.target.value)}>
              <option value="-1">-1 - Heel reaches ear</option>
              <option value="0">0 - Heel at nose</option>
              <option value="1">1 - Heel at chin</option>
              <option value="2">2 - Heel at nipple line</option>
              <option value="3">3 - Heel at umbilicus</option>
              <option value="4">4 - Heel at femoral crease</option>
            </select>
          </div>
        </div>

        {/* Physical Maturity */}
        <div className="ballard-section">
          <h3>Physical Maturity</h3>

          <div className="param-group">
            <label>Skin</label>
            <select onChange={(e) => handleChange("skin", e.target.value)}>
              <option value="-1">-1 - Sticky, friable, transparent</option>
              <option value="0">0 - Gelatinous red, translucent</option>
              <option value="1">1 - Smooth pink, visible veins</option>
              <option value="2">2 - Superficial peeling and/or rash, few veins</option>
              <option value="3">3 - Cracking, pale areas, rare veins</option>
              <option value="4">4 - Parchment, deep cracking, no vessels</option>
              <option value="5">5 - Leathery, cracked, wrinkled</option>
            </select>
          </div>

          <div className="param-group">
            <label>Lanugo</label>
            <select onChange={(e) => handleChange("lanugo", e.target.value)}>
              <option value="-1">-1 - None</option>
              <option value="0">0 - Sparse</option>
              <option value="1">1 - Abundant</option>
              <option value="2">2 - Thinning</option>
              <option value="3">3 - Bald areas</option>
              <option value="4">4 - Mostly bald</option>
            </select>
          </div>

          <div className="param-group">
            <label>Plantar Creases</label>
            <select onChange={(e) => handleChange("plantarCreases", e.target.value)}>
              <option value="-1">-1 - Heel-toe 40–50 mm</option>
              <option value="0">0 - Heel-toe &lt;50 mm, no creases</option>
              <option value="1">1 - Faint red marks</option>
              <option value="2">2 - Anterior transverse crease only</option>
              <option value="3">3 - Creases over anterior 2/3</option>
              <option value="4">4 - Creases over entire sole</option>
            </select>
          </div>

          <div className="param-group">
            <label>Breast</label>
            <select onChange={(e) => handleChange("breast", e.target.value)}>
              <option value="-1">-1 - Imperceptible</option>
              <option value="0">0 - Barely perceptible</option>
              <option value="1">1 - Flat areola, no bud</option>
              <option value="2">2 - Stippled areola, 1–2 mm bud</option>
              <option value="3">3 - Raised areola, 3–4 mm bud</option>
              <option value="4">4 - Full areola, 5–10 mm bud</option>
            </select>
          </div>

          <div className="param-group">
            <label>Eye & Ear</label>
            <select onChange={(e) => handleChange("eyeEar", e.target.value)}>
              <option value="-1">-1 - Lids fused, loosely</option>
              <option value="0">0 - Lids open, pinna flat</option>
              <option value="1">1 - Pinna slightly curved, slow recoil</option>
              <option value="2">2 - Pinna well curved, ready recoil</option>
              <option value="3">3 - Pinna formed and firm, instant recoil</option>
              <option value="4">4 - Thick cartilage, ear stiff</option>
            </select>
          </div>
          {sex === "male" && (
            <div className="param-group">
              <label>Male Genitals</label>
              <select onChange={(e) => handleChange("maleGenitals", e.target.value)}>
                <option value="-1">-1 - Scrotum flat, smooth</option>
                <option value="0">0 - Empty scrotum, faint rugae</option>
                <option value="1">1 - Testes in upper canal, rare rugae</option>
                <option value="2">2 - Testes descending, few rugae</option>
                <option value="3">3 - Testes down, good rugae</option>
                <option value="4">4 - Testes pendulous, deep rugae</option>
              </select>
            </div>
          )}

          {sex === "female" && (
            <div className="param-group">
              <label>Female Genitals</label>
              <select onChange={(e) => handleChange("femaleGenitals", e.target.value)}>
                <option value="-1">-1 - Prominent clitoris, flat labia</option>
                <option value="0">0 - Prominent clitoris, small labia minora</option>
                <option value="1">1 - Majora and minora equally prominent</option>
                <option value="2">2 - Majora large, minora small</option>
                <option value="3">3 - Majora covers clitoris and minora</option>
                <option value="4">4 - Majora fully covers clitoris and minora</option>
              </select>
            </div>
          )}
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
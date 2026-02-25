import React, { useMemo } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const INITIAL_STATE = {
  posture: 0,
  squareWindow: -1,
  armRecoil: 0,
  poplitealAngle: -1,
  scarfSign: -1,
  heelToEar: -1,
  skin: -1,
  lanugo: -1,
  plantar: -1,
  breast: -1,
  eyeEar: -1,
  genitalsMale: -1,
  genitalsFemale: -1,
  sex: "male",
  // Global Sync Keys
  age: "",
};

export default function BallardScoreCalculator() {
  const { values, updateField: handleChange, reset } = useCalculator(INITIAL_STATE);

  // ✅ Official New Ballard Score lookup chart
  const scoreMap = {
    "-10": 20, "-9": 20, "-8": 20, "-7": 21, "-6": 21,
    "-5": 22, "-4": 22, "-3": 22, "-2": 23, "-1": 23,
    "0": 24, "1": 24, "2": 24, "3": 25, "4": 25,
    "5": 26, "6": 26, "7": 26, "8": 27, "9": 27,
    "10": 28, "11": 28, "12": 28, "13": 29, "14": 29,
    "15": 30, "16": 30, "17": 30, "18": 31, "19": 31,
    "20": 32, "21": 32, "22": 32, "23": 33, "24": 33,
    "25": 34, "26": 34, "27": 34, "28": 35, "29": 35,
    "30": 36, "31": 36, "32": 36, "33": 37, "34": 37,
    "35": 37, "36": 38, "37": 38, "38": 39, "39": 39,
    "40": 39, "41": 40, "42": 40, "43": 41, "44": 41,
    "45": 41, "46": 42, "47": 42, "48": 43, "49": 43,
    "50": 44,
  };

  const totalScore = useMemo(() => {
    let {
      posture,
      squareWindow,
      armRecoil,
      poplitealAngle,
      scarfSign,
      heelToEar,
      skin,
      lanugo,
      plantar,
      breast,
      eyeEar,
      genitalsMale,
      genitalsFemale,
      sex,
    } = values;

    return (
      posture +
      squareWindow +
      armRecoil +
      poplitealAngle +
      scarfSign +
      heelToEar +
      skin +
      lanugo +
      plantar +
      breast +
      eyeEar +
      (sex === "male" ? genitalsMale : genitalsFemale)
    );
  }, [values]);

  const estimatedGA = scoreMap[totalScore] || "N/A";

  const getStatus = () => {
    if (estimatedGA < 28) return "Extremely preterm";
    if (estimatedGA >= 28 && estimatedGA < 32) return "Very preterm";
    if (estimatedGA >= 32 && estimatedGA < 34) return "Moderate preterm";
    if (estimatedGA >= 34 && estimatedGA < 37) return "Late preterm";
    if (estimatedGA >= 37 && estimatedGA <= 42) return "Term";
    if (estimatedGA > 42) return "Post-term";
    return "";
  };

  return (
    <div className="calc-container">
      {/* Sex Selection */}
      <div className="calc-box">
        <label className="calc-label">Sex:</label>
        <div style={{ display: 'flex', gap: '16px', marginTop: 8 }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="radio"
              name="sex"
              value="male"
              checked={values.sex === "male"}
              onChange={() => handleChange("sex", "male")}
              style={{ marginRight: 6 }}
            />
            Male
          </label>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="radio"
              name="sex"
              value="female"
              checked={values.sex === "female"}
              onChange={() => handleChange("sex", "female")}
              style={{ marginRight: 6 }}
            />
            Female
          </label>
        </div>
      </div>

      {/* Neuromuscular Parameters */}
      <h3 style={{ fontSize: '1rem', marginTop: 20, marginBottom: 12, color: '#333' }}>Neuromuscular Maturity</h3>
      <div className="ballard-grid">
        <div className="calc-box">
          <label className="calc-label">Posture</label>
          <select className="calc-select" value={values.posture} onChange={(e) => handleChange("posture", parseInt(e.target.value))}>
            <option value="0">0 - Limp</option>
            <option value="1">1 - Some flexion</option>
            <option value="2">2 - Moderate flexion</option>
            <option value="3">3 - Strong flexion</option>
            <option value="4">4 - Tight flexion</option>
          </select>
        </div>

        <div className="calc-box">
          <label className="calc-label">Square Window</label>
          <select className="calc-select" value={values.squareWindow} onChange={(e) => handleChange("squareWindow", parseInt(e.target.value))}>
            <option value="-1">-1 - &gt;90°</option>
            <option value="0">0 - 90°</option>
            <option value="1">1 - 60°</option>
            <option value="2">2 - 45°</option>
            <option value="3">3 - 30°</option>
            <option value="4">4 - 0°</option>
          </select>
        </div>

        <div className="calc-box">
          <label className="calc-label">Arm Recoil</label>
          <select className="calc-select" value={values.armRecoil} onChange={(e) => handleChange("armRecoil", parseInt(e.target.value))}>
            <option value="1">1 - 140° - 180°</option>
            <option value="2">2 - 110° - 140°</option>
            <option value="3">3 - 90° - 110°</option>
            <option value="4">4 - &lt;90°</option>
          </select>
        </div>

        <div className="calc-box">
          <label className="calc-label">Popliteal Angle</label>
          <select className="calc-select" value={values.poplitealAngle} onChange={(e) => handleChange("poplitealAngle", parseInt(e.target.value))}>
            <option value="-1">-1 - 180°</option>
            <option value="0">0 - 160°</option>
            <option value="1">1 - 140°</option>
            <option value="2">2 - 120°</option>
            <option value="3">3 - 100°</option>
            <option value="4">4 - 90°</option>
            <option value="5">5 - &lt;90°</option>
          </select>
        </div>

        <div className="calc-box">
          <label className="calc-label">Scarf Sign</label>
          <select className="calc-select" value={values.scarfSign} onChange={(e) => handleChange("scarfSign", parseInt(e.target.value))}>
            <option value="-1">-1 - Elbow reaches neck</option>
            <option value="0">0 - Elbow at contralateral axillary line</option>
            <option value="1">1 - Elbow at contralateral nipple line</option>
            <option value="2">2 - Elbow at xiphoid process</option>
            <option value="3">3 - Elbow at ipsilateral nipple line</option>
            <option value="4">4 - Elbow at ipsilateral axillary line</option>
          </select>
        </div>

        <div className="calc-box">
          <label className="calc-label">Heel to Ear</label>
          <select className="calc-select" value={values.heelToEar} onChange={(e) => handleChange("heelToEar", parseInt(e.target.value))}>
            <option value="-1">-1 - Heel reaches ear</option>
            <option value="0">0 - Heel reaches nose</option>
            <option value="1">1 - Heel to chin</option>
            <option value="2">2 - Heel to nipple</option>
            <option value="3">3 - Heel to umbilicus</option>
            <option value="4">4 - Heel at femoral crease</option>
          </select>
        </div>
      </div>

      {/* Physical Maturity Parameters */}
      <h3 style={{ fontSize: '1rem', marginTop: 20, marginBottom: 12, color: '#333' }}>Physical Maturity</h3>
      <div className="ballard-grid">
        <div className="calc-box">
          <label className="calc-label">Skin</label>
          <select className="calc-select" value={values.skin} onChange={(e) => handleChange("skin", parseInt(e.target.value))}>
            <option value="-1">-1 - Sticky, friable, transparent</option>
            <option value="0">0 - Gelatinous red, translucent</option>
            <option value="1">1 - Smooth pink, visible veins</option>
            <option value="2">2 - Superficial peeling and/or rash, few veins</option>
            <option value="3">3 - Cracking, pale areas, rare veins</option>
            <option value="4">4 - Parchment, deep cracking, no vessels</option>
            <option value="5">5 - Leathery, cracked, wrinkled</option>
          </select>
        </div>

        <div className="calc-box">
          <label className="calc-label">Lanugo</label>
          <select className="calc-select" value={values.lanugo} onChange={(e) => handleChange("lanugo", parseInt(e.target.value))}>
            <option value="-1">-1 - None</option>
            <option value="0">0 - Sparse</option>
            <option value="1">1 - Abundant</option>
            <option value="2">2 - Thinning</option>
            <option value="3">3 - Bald areas</option>
            <option value="4">4 - Mostly bald</option>
          </select>
        </div>

        <div className="calc-box">
          <label className="calc-label">Plantar Creases</label>
          <select className="calc-select" value={values.plantar} onChange={(e) => handleChange("plantar", parseInt(e.target.value))}>
            <option value="-1">-1 - Heel-toe 40–50 mm</option>
            <option value="0">0 - Heel-toe &lt;50 mm, no creases</option>
            <option value="1">1 - Faint red marks</option>
            <option value="2">2 - Anterior transverse crease only</option>
            <option value="3">3 - Creases over anterior 2/3</option>
            <option value="4">4 - Creases over entire sole</option>
          </select>
        </div>

        <div className="calc-box">
          <label className="calc-label">Breast</label>
          <select className="calc-select" value={values.breast} onChange={(e) => handleChange("breast", parseInt(e.target.value))}>
            <option value="-1">-1 - Imperceptible</option>
            <option value="0">0 - Barely perceptible</option>
            <option value="1">1 - Flat areola, no bud</option>
            <option value="2">2 - Stippled areola, 1–2 mm bud</option>
            <option value="3">3 - Raised areola, 3–4 mm bud</option>
            <option value="4">4 - Full areola, 5–10 mm bud</option>
          </select>
        </div>

        <div className="calc-box">
          <label className="calc-label">Eye & Ear</label>
          <select className="calc-select" value={values.eyeEar} onChange={(e) => handleChange("eyeEar", parseInt(e.target.value))}>
            <option value="-1">-1 - Lids fused loosely</option>
            <option value="0">0 - Lids open, pinna flat</option>
            <option value="1">1 - Pinna slightly curved, slow recoil</option>
            <option value="2">2 - Pinna well curved, ready recoil</option>
            <option value="3">3 - Pinna formed and firm, instant recoil</option>
            <option value="4">4 - Thick cartilage, ear stiff</option>
          </select>
        </div>

        {/* Genitals (Male/Female) */}
        {values.sex === "male" ? (
          <div className="calc-box">
            <label className="calc-label">Male Genitals</label>
            <select className="calc-select" value={values.genitalsMale} onChange={(e) => handleChange("genitalsMale", parseInt(e.target.value))}>
              <option value="-1">-1 - Scrotum flat, smooth</option>
              <option value="0">0 - Faint rugae</option>
              <option value="1">1 - Few rugae, testes high</option>
              <option value="2">2 - Rugae anterior, testes descending</option>
              <option value="3">3 - Testes descended, good rugae</option>
              <option value="4">4 - Testes pendulous, deep rugae</option>
            </select>
          </div>
        ) : (
          <div className="calc-box">
            <label className="calc-label">Female Genitals</label>
            <select className="calc-select" value={values.genitalsFemale} onChange={(e) => handleChange("genitalsFemale", parseInt(e.target.value))}>
              <option value="-1">-1 - Clitoris prominent, labia flat</option>
              <option value="0">0 - Prominent clitoris, small labia</option>
              <option value="1">1 - Clitoris prominent, enlarging labia</option>
              <option value="2">2 - Labia majora enlarging</option>
              <option value="3">3 - Labia majora covering clitoris</option>
              <option value="4">4 - Labia majora large, covering completely</option>
            </select>
          </div>
        )}
      </div>

      {/* Results */}
      <h3 style={{ fontSize: '1rem', marginTop: 20, marginBottom: 12, color: '#333' }}>Results</h3>
      <div className="calc-result">
        <p>Total Score: {totalScore}</p>
        <p style={{ marginTop: 8 }}>Estimated GA: {estimatedGA} weeks ({getStatus()})</p>
      </div>
      <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>
    </div>
  );
}

import React, { useMemo, useState } from "react";
import { useCalc, ResetButton, SelectField, FormulaBox, InterpText } from "./CalcFields";

function polarToCartesian(cx, cy, radius, angleDeg) {
  const angleRad = (angleDeg * Math.PI) / 180;
  return { x: cx + radius * Math.cos(angleRad), y: cy + radius * Math.sin(angleRad) };
}

function describeArc(cx, cy, radius, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, radius, startAngle);
  const end = polarToCartesian(cx, cy, radius, endAngle);
  const sweep = endAngle - startAngle <= 180 ? 0 : 1;
  return [`M ${cx} ${cy}`, `L ${start.x} ${start.y}`, `A ${radius} ${radius} 0 ${sweep} 1 ${end.x} ${end.y}`, "Z"].join(" ");
}

const SECTORS = {
  left: { start: 270, end: 330, color: "#60a5fa", label: "LAD", mid: 300 },
  normal: { start: 330, end: 450, color: "#34d399", label: "NORMAL", mid: 30 },
  right: { start: 90, end: 180, color: "#fb923c", label: "RAD", mid: 135 },
  extreme: { start: 180, end: 270, color: "#f87171", label: "EAD", mid: 225 },
};

const INITIAL_STATE = { lead1: "positive", leadAvf: "positive" };

// 12-angle hexaxial reference dial (every 30°), with the six limb-lead axes.
// Clockwise from 0°: +30, +60, +90, +120, +150 (right/inferior side).
// Anticlockwise from 0°: -30, -60, -90, -120, -150, -180 (left/superior side).
const DIAL_ANGLES = [0, 30, 60, 90, 120, 150, -150, -120, -90, -60, -30];
const DIAL_LABELS = [0, 30, 60, 90, 120, 150, "−150°", "−120°", "−90°", "−60°", "−30°"];
const LEAD_AXES = [
  { angle: 0, label: "I" },
  { angle: 60, label: "II" },
  { angle: 120, label: "III" },
  { angle: -150, label: "aVR" },
  { angle: -30, label: "aVL" },
  { angle: 90, label: "aVF" },
];

// Shared detailed hexaxial dial used by both methods.
function HexaxialDial({ size = 300, sectorKey = "", axis = null, estimates = [] }) {
  const cx = size / 2, cy = size / 2, r = size * 0.37;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* reference circle */}
      <circle cx={cx} cy={cy} r={r} stroke="#374151" strokeWidth="1" fill="#fff" />

      {/* horizontal 0° / ±180° reference line */}
      <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="#d1d5db" strokeWidth="1" />

      {/* diagnosis sectors */}
      {Object.entries(SECTORS).map(([key, s]) => (
        <path
          key={key}
          d={describeArc(cx, cy, r, s.start, s.end)}
          fill={key === sectorKey ? s.color : "#fff"}
          opacity={key === sectorKey ? 0.22 : 0.07}
          stroke={key === sectorKey ? s.color : "#e5e7eb"}
        />
      ))}

      {/* sector abbreviations: LAD / NORMAL / RAD / EAD */}
      {Object.entries(SECTORS).map(([key, s]) => {
        const p = polarToCartesian(cx, cy, r * 0.62, s.mid);
        const active = key === sectorKey;
        return (
          <text
            key={`sector-${key}`}
            x={p.x}
            y={p.y}
            fontSize={s.label === "NORMAL" ? 7 : 8}
            fontWeight="700"
            fill={active ? s.color : "#9ca3af"}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {s.label}
          </text>
        );
      })}

      {/* 12 spokes every 30° */}
      {DIAL_ANGLES.map((a) => {
        const outer = polarToCartesian(cx, cy, r, a);
        const inner = polarToCartesian(cx, cy, r * 0.18, a);
        return <line key={`spoke-${a}`} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="#e5e7eb" strokeWidth="1" />;
      })}

      {/* limb-lead axes (full diameter) + labels */}
      {LEAD_AXES.map((axisDef) => {
        const pos = polarToCartesian(cx, cy, r, axisDef.angle);
        const neg = polarToCartesian(cx, cy, r, axisDef.angle + 180);
        const posLbl = polarToCartesian(cx, cy, r + 14, axisDef.angle);
        const negLbl = polarToCartesian(cx, cy, r + 14, axisDef.angle + 180);
        return (
          <g key={`axis-${axisDef.label}`}>
            <line x1={neg.x} y1={neg.y} x2={pos.x} y2={pos.y} stroke="#d1d5db" strokeWidth="1" />
            <text x={posLbl.x} y={posLbl.y} fontSize="9" fontWeight="700" fill="#015c9c" textAnchor="middle" dominantBaseline="middle">{axisDef.label}</text>
            <text x={negLbl.x} y={negLbl.y} fontSize="8" fill="#9ca3af" textAnchor="middle" dominantBaseline="middle">{axisDef.label}</text>
          </g>
        );
      })}

      {/* 30° tick labels — clockwise positive (+30..+150), anticlockwise negative (−30..−180) */}
      {DIAL_ANGLES.map((a, i) => {
        const p = polarToCartesian(cx, cy, r - 10, a);
        const text = typeof DIAL_LABELS[i] === "number" ? `${DIAL_LABELS[i]}°` : DIAL_LABELS[i];
        return <text key={`deg-${a}`} x={p.x} y={p.y} fontSize="7" fill="#6b7280" textAnchor="middle" dominantBaseline="middle">{text}</text>;
      })}

      {/* −180° label at the left end of the Lead I (0°) line */}
      {(() => {
        const p = polarToCartesian(cx, cy, r - 10, 180);
        return <text x={p.x} y={p.y} fontSize="7" fill="#6b7280" textAnchor="middle" dominantBaseline="middle">−180°</text>;
      })()}

      {/* individual estimate vectors (dashed) */}
      {estimates.map((est) => {
        const p = polarToCartesian(cx, cy, r - 6, est.angle);
        return <line key={`est-${est.key}`} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="4 3" strokeLinecap="round" />;
      })}

      {/* final axis vector (solid) */}
      {axis !== null && axis !== undefined && (() => {
        const p = polarToCartesian(cx, cy, r - 6, axis);
        return (
          <>
            <line x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx={cx} cy={cy} r={3} fill="#dc2626" />
          </>
        );
      })()}
    </svg>
  );
}

/* ==========================================================================
   3-LEAD METHOD — existing implementation, preserved unchanged.
   ========================================================================== */
function ThreeLeadMethod() {
  const { values, updateField: setField, reset } = useCalc(INITIAL_STATE);

  const result = useMemo(() => {
    const { lead1, leadAvf } = values;
    if (lead1 === "positive" && leadAvf === "positive") return { interpretation: "Normal Axis", equiphasic: "aVL", sector: "normal" };
    if (lead1 === "positive" && leadAvf === "negative") return { interpretation: "Left Axis Deviation", equiphasic: "Lead II", sector: "left" };
    if (lead1 === "negative" && leadAvf === "positive") return { interpretation: "Right Axis Deviation", equiphasic: "Lead III", sector: "right" };
    if (lead1 === "negative" && leadAvf === "negative") return { interpretation: "Extreme Axis", equiphasic: "aVR", sector: "extreme" };
    return { interpretation: "Indeterminate", equiphasic: "", sector: "" };
  }, [values]);

  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <div style={{ flex: "1 1 280px" }}>
        <FormulaBox title="How the 3-Lead Method works">
          <p style={{ margin: "0 0 6px" }}>
            The <strong>3-lead method</strong> estimates the cardiac axis from the net QRS deflection
            in two leads: <strong>Lead I</strong> and <strong>Lead aVF</strong>.
          </p>
          <p style={{ margin: "0 0 6px" }}>
            <strong>Reading the leads:</strong> a <strong>Positive</strong> deflection means the net QRS
            points toward that lead's positive pole; <strong>Negative</strong> means it points away.
          </p>
          <p style={{ margin: "0 0 6px" }}>
            <strong>Quadrant method:</strong> Lead I is 0° and aVF is +90°.
          </p>
          <ul style={{ margin: "0 0 6px", paddingLeft: 18 }}>
            <li>I Positive, aVF Positive → <strong>Normal Axis</strong> (equiphasic aVL)</li>
            <li>I Positive, aVF Negative → <strong>Left Axis Deviation</strong> (equiphasic Lead II)</li>
            <li>I Negative, aVF Positive → <strong>Right Axis Deviation</strong> (equiphasic Lead III)</li>
            <li>I Negative, aVF Negative → <strong>Extreme Axis</strong> (equiphasic aVR)</li>
          </ul>
          <p style={{ margin: 0 }}>
            <strong>Interpretation:</strong> Normal −30° to +90°; Left axis &lt; −30°; Right axis
            &gt; +90°; Extreme (right superior) beyond ±150°.
          </p>
        </FormulaBox>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 120px", minWidth: 0 }}>
            <SelectField label="Lead I: " field="lead1" values={values} setField={setField} options={[{value: "positive", label: "Positive"}, {value: "negative", label: "Negative"}]} />
          </div>
          <div style={{ flex: "1 1 120px", minWidth: 0 }}>
            <SelectField label="Lead aVF: " field="leadAvf" values={values} setField={setField} options={[{value: "positive", label: "Positive"}, {value: "negative", label: "Negative"}]} />
          </div>
        </div>
        <ResetButton onClick={reset} />
        <div className="calc-result" style={{ marginTop: 16 }}>
          <p><strong>Interpretation:</strong> <InterpText text={result.interpretation} good={["Normal Axis"]} bad={["Left Axis Deviation", "Right Axis Deviation", "Extreme Axis"]} /></p>
          <p><strong>Equiphasic lead:</strong> {result.equiphasic}</p>
        </div>
      </div>
      <div style={{ flex: "1 1 300px", minWidth: 280, textAlign: "center", margin: 'auto' }}>
        <HexaxialDial size={300} sectorKey={result.sector} axis={null} />
      </div>
    </div>
  );
}

/* ==========================================================================
   EQUIPHASIC LEAD METHOD — separate, independent implementation.
   Uses the established hexaxial reference system.
   ========================================================================== */

// Standard hexaxial reference: each limb lead's positive-pole angle, and the
// lead that is perpendicular to it (with that perpendicular lead's own angle).
const HEXAXIAL = {
  I:   { angle: 0,    perpendicular: "aVF", perpAngle: 90,   perpAxis: "aVF axis" },
  II:  { angle: 60,   perpendicular: "aVR", perpAngle: -150, perpAxis: "aVR axis" },
  III: { angle: 120,  perpendicular: "aVL", perpAngle: -30,  perpAxis: "aVL axis" },
  aVR: { angle: -150, perpendicular: "III", perpAngle: 120,  perpAxis: "III axis" },
  aVL: { angle: -30,  perpendicular: "II",  perpAngle: 60,   perpAxis: "II axis" },
  aVF: { angle: 90,   perpendicular: "I",   perpAngle: 0,    perpAxis: "I axis" },
};

const LIMB_LEADS = ["I", "II", "III", "aVR", "aVL", "aVF"];

// Normalize an angle into the (-180, +180] range.
function normalizeAngle(deg) {
  let a = deg;
  while (a <= -180) a += 360;
  while (a > 180) a -= 360;
  return a;
}

// Classify an axis in degrees using the same sector boundaries the 3-Lead
// method already encodes (Normal -30°..+90°, LAD < -30°, RAD > +90°..180°,
// Extreme -90°..-150°). Returns a key into SECTORS.
function classifyAxis(deg) {
  const a = normalizeAngle(deg);
  if (a >= -30 && a <= 90) return "normal";
  if (a < -30 && a >= -90) return "left";
  if (a > 90 && a <= 180) return "right";
  return "extreme";
}

// Shortest signed angular difference (b - a) wrapped into (-180, +180].
function angularDiff(a, b) {
  return normalizeAngle(b - a);
}

// Circular mean of two angles (degrees), correct across the ±180° wraparound.
// Uses the vector (sin/cos) averaging method rather than a naive arithmetic mean.
function circularMean(a, b) {
  const rad = Math.PI / 180;
  const x = Math.cos(a * rad) + Math.cos(b * rad);
  const y = Math.sin(a * rad) + Math.sin(b * rad);
  if (x === 0 && y === 0) return null; // perfectly opposed — no defined mean
  return normalizeAngle((Math.atan2(y, x) * 180) / Math.PI);
}

// Compute the axis angle implied by ONE equiphasic lead and the chosen polarity
// of its perpendicular lead. Returns null until a polarity is chosen.
function axisFromEquiphasic(lead, polarity) {
  if (!lead || !polarity) return null;
  const ref = HEXAXIAL[lead];
  if (!ref) return null;
  return normalizeAngle(polarity === "positive" ? ref.perpAngle : ref.perpAngle + 180);
}

const EQUIPHASIC_INITIAL = {
  lead1: "",
  lead2: "",
  polarity1: "",
  polarity2: "",
};

function EquiphasicMethod() {
  const { values, updateField: setField, reset } = useCalc(EQUIPHASIC_INITIAL);

  const lead1 = values.lead1;
  const lead2 = values.lead2;
  const hasTwo = Boolean(lead1 && lead2);

  // Each equiphasic lead is resolved independently.
  const angle1 = useMemo(() => axisFromEquiphasic(lead1, values.polarity1), [lead1, values.polarity1]);
  const angle2 = useMemo(() => (hasTwo ? axisFromEquiphasic(lead2, values.polarity2) : null), [hasTwo, lead2, values.polarity2]);

  const result = useMemo(() => {
    // No equiphasic lead identified → cannot apply this method.
    if (!lead1) {
      return { status: "empty" };
    }

    // One equiphasic lead: a valid perpendicular polarity must be chosen first.
    if (!hasTwo) {
      if (angle1 === null) {
        return { status: "awaiting", lead: lead1 };
      }
      return {
        status: "single",
        axis: angle1,
        sector: classifyAxis(angle1),
        entries: [
          { lead: lead1, perpendicular: HEXAXIAL[lead1].perpendicular, polarity: values.polarity1, angle: angle1 },
        ],
      };
    }

    // Two equiphasic leads: both individual angles must be valid before averaging.
    if (angle1 === null || angle2 === null) {
      return { status: "awaiting", lead: null };
    }

    const entries = [
      { lead: lead1, perpendicular: HEXAXIAL[lead1].perpendicular, polarity: values.polarity1, angle: angle1 },
      { lead: lead2, perpendicular: HEXAXIAL[lead2].perpendicular, polarity: values.polarity2, angle: angle2 },
    ];

    // Directional consistency: the two independent estimates should point in
    // roughly the same direction. If they are opposed (or wildly divergent),
    // flag the discrepancy rather than presenting a misleading average.
    const diff = Math.abs(angularDiff(angle1, angle2));
    if (diff > 90) {
      return {
        status: "inconsistent",
        entries,
        diff,
        note: `The two estimates (${angle1}° and ${angle2}°) point in conflicting directions (${Math.round(diff)}° apart). Check the polarity selections — the axis cannot be averaged reliably.`,
      };
    }

    const axis = circularMean(angle1, angle2);
    if (axis === null) {
      return {
        status: "inconsistent",
        entries,
        diff: 180,
        note: "The two estimates are exactly opposed, so no single averaged axis can be derived. Re-check the polarity selections.",
      };
    }

    return {
      status: "average",
      axis,
      sector: classifyAxis(axis),
      entries,
      diff,
      note: `Two independent estimates (${angle1}° and ${angle2}°) averaged circularly to ${Math.round(axis * 10) / 10}°.`,
    };
  }, [lead1, lead2, hasTwo, values.polarity1, values.polarity2, angle1, angle2]);

  const leadOptions = [
    { value: "", label: "— Select lead —" },
    ...LIMB_LEADS.map((l) => ({ value: l, label: `Lead ${l}` })),
  ];

  // Prevent selecting the same equiphasic lead twice.
  const lead2Options = leadOptions.filter((o) => o.value === "" || o.value !== lead1);

  const polarityOptions = [
    { value: "", label: "— Select polarity —" },
    { value: "positive", label: "Positive" },
    { value: "negative", label: "Negative" },
  ];

  const sectorKey = result.status === "single" || result.status === "average" ? result.sector : "";

  const renderEntry = (entry) => (
    <div key={entry.lead} style={{ marginBottom: 10, padding: 10, border: "1px solid var(--border-color)", borderRadius: 8, background: "var(--bg-app)" }}>
      <p style={{ margin: "0 0 4px", fontWeight: 600 }}>
        Lead {entry.lead} → perpendicular lead {entry.perpendicular}
      </p>
      <p style={{ margin: "0 0 2px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
        Perpendicular polarity: <strong>{entry.polarity === "positive" ? "Positive" : "Negative"}</strong>
      </p>
      <p style={{ margin: 0, fontSize: "0.85rem" }}>
        Calculated axis: <strong>{entry.angle}°</strong>
      </p>
    </div>
  );

  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <div style={{ flex: "1 1 280px" }}>
        <FormulaBox title="How the Equiphasic Lead Method works">
          <p style={{ margin: "0 0 6px" }}>
            The <strong>equiphasic (isoelectric) lead</strong> is the limb lead whose QRS complex is
            closest to zero — the smallest net deflection. The electrical axis lies roughly
            perpendicular to that lead.
          </p>
          <p style={{ margin: "0 0 6px" }}>
            <strong>Steps:</strong> (1) pick the equiphasic lead; (2) the perpendicular lead appears
            automatically; (3) set that perpendicular lead's polarity — the axis points toward its
            positive pole (Positive) or the opposite direction (Negative).
          </p>
          <p style={{ margin: "0 0 6px" }}>
            <strong>Perpendicular pairs (hexaxial reference):</strong> I ↔ aVF, II ↔ aVR, III ↔ aVL.
          </p>
          <p style={{ margin: "0 0 6px" }}>
            <strong>Two equiphasic leads:</strong> each lead is calculated independently, then the two
            angles are averaged using circular (vector) averaging so the ±180° boundary is handled
            correctly. If the two estimates point in conflicting directions (&gt;90° apart) the result
            is flagged rather than averaged.
          </p>
          <p style={{ margin: 0 }}>
            <strong>Interpretation:</strong> Normal −30° to +90°; Left axis &lt; −30°; Right axis
            &gt; +90°; Extreme (right superior) beyond ±150°.
          </p>
        </FormulaBox>

        {/* Each equiphasic lead is immediately followed by its own perpendicular-lead polarity dropdown. */}
        <SelectField
          label="1st Equiphasic lead: "
          field="lead1"
          values={values}
          setField={(field, value) => {
            setField(field, value);
            setField("polarity1", "");
          }}
          options={leadOptions}
        />
        {lead1 && (
          <SelectField
            label={`${HEXAXIAL[lead1].perpendicular} (Perpendicular Lead):`}
            field="polarity1"
            values={values}
            setField={setField}
            options={polarityOptions}
          />
        )}

        <SelectField
          label="2nd Equiphasic lead (optional): "
          field="lead2"
          values={values}
          setField={(field, value) => {
            setField(field, value);
            setField("polarity2", "");
          }}
          options={lead2Options}
        />
        {hasTwo && (
          <SelectField
            label={`${HEXAXIAL[lead2].perpendicular} (Perpendicular Lead):`}
            field="polarity2"
            values={values}
            setField={setField}
            options={polarityOptions}
          />
        )}

        <ResetButton onClick={reset} />

        <div className="calc-result" style={{ marginTop: 16 }}>
          {result.status === "empty" && (
            <p>Select the equiphasic lead to determine the cardiac axis.</p>
          )}

          {result.status === "awaiting" && (
            <p>Select the perpendicular lead polar{lead1 && !hasTwo ? "ity" : "ities"} to calculate the axis.</p>
          )}

          {result.status === "inconsistent" && (
            <>
              <p><strong>Interpretation:</strong> Inconsistent — cannot average</p>
              {result.entries.map(renderEntry)}
              <p style={{ fontSize: "0.85rem" }}>{result.note}</p>
            </>
          )}

          {(result.status === "single" || result.status === "average") && (
            <>
              {result.entries.map(renderEntry)}
              <p style={{ marginTop: 8 }}><strong>Final cardiac axis:</strong> {Math.round(result.axis * 10) / 10}°</p>
              <p><strong>Interpretation:</strong> <InterpText text={result.sector === "normal" ? "Normal Axis" : result.sector === "left" ? "Left Axis Deviation" : result.sector === "right" ? "Right Axis Deviation" : "Extreme Axis"} good={["Normal Axis"]} bad={["Left Axis Deviation", "Right Axis Deviation", "Extreme Axis"]} /></p>
              {result.status === "average" && (
                <p style={{ fontSize: "0.8rem", opacity: 0.85 }}>{result.note}</p>
              )}
            </>
          )}
        </div>
      </div>

      <div style={{ flex: "1 1 300px", minWidth: 280, textAlign: "center", margin: 'auto' }}>
        <HexaxialDial
          size={300}
          sectorKey={sectorKey}
          axis={result.status === "single" || result.status === "average" ? result.axis : null}
          estimates={result.entries ? result.entries.map((e) => ({ key: e.lead, angle: e.angle })) : []}
        />
      </div>
    </div>
  );
}

/* ==========================================================================
   METHOD SELECTOR
   ========================================================================== */
const METHODS = [
  { id: "threeLead", label: "3-Lead Method" },
  { id: "equiphasic", label: "Equiphasic Lead Method" },
];

export default function AxisInterpreter() {
  // Default to the 3-Lead Method on every entry. No persistence: the component
  // unmounts when the calculator is closed, so re-entry always resets to this.
  const [method, setMethod] = useState("threeLead");

  return (
    <div className="calc-container" style={{ maxWidth: 720 }}>
      <div className="calc-method-tabs" role="tablist" aria-label="Cardiac axis method">
        {METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={method === m.id}
            className={`calc-method-tab ${method === m.id ? "active" : ""}`}
            onClick={() => setMethod(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {method === "threeLead" && <ThreeLeadMethod />}
      {method === "equiphasic" && <EquiphasicMethod />}
    </div>
  );
}

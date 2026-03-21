import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import CalcForDocs from "./CalcForDocs";

function App() {
  return (
    <div>
      <CalcForDocs />
      <Analytics />
      <SpeedInsights />
    </div>
  )
}

export default App;
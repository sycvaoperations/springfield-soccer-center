/* Tweaks panel — applies brand/motion knobs to the vanilla page via CSS vars + body classes. */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "displayFont": "Oswald",
  "accent": "#f26200",
  "atmosphere": "subtle",
  "motion": true
}/*EDITMODE-END*/;

const FONT_STACK = {
  Oswald: "'Oswald', system-ui, sans-serif",
  Inter: "'Inter', system-ui, sans-serif",
};
const ACCENTS = {
  "#f26200": ["#f26200", "#ff7d1f", "#c44e00"],
  "#ff6a00": ["#ff6a00", "#ff8c3a", "#d65400"],
  "#e8521f": ["#e8521f", "#ff7044", "#bf3f12"],
};
const ATMOS = { off: 0, subtle: 0.5, bold: 1 };

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    const r = document.documentElement.style;
    r.setProperty("--font-display", FONT_STACK[t.displayFont] || FONT_STACK.Oswald);
    const a = ACCENTS[t.accent] || ACCENTS["#f26200"];
    r.setProperty("--accent", a[0]);
    r.setProperty("--accent-bright", a[1]);
    r.setProperty("--accent-deep", a[2]);
    r.setProperty("--grain", String(ATMOS[t.atmosphere] ?? 0.5));
    document.body.classList.toggle("nomotion", !t.motion);
  }, [t.displayFont, t.accent, t.atmosphere, t.motion]);

  return (
    <TweaksPanel>
      <TweakSection label="Brand" />
      <TweakRadio
        label="Display font"
        value={t.displayFont}
        options={["Oswald", "Inter"]}
        onChange={(v) => setTweak("displayFont", v)}
      />
      <TweakColor
        label="Accent"
        value={t.accent}
        options={["#f26200", "#ff6a00", "#e8521f"]}
        onChange={(v) => setTweak("accent", v)}
      />
      <TweakSection label="Atmosphere" />
      <TweakRadio
        label="Grain & light"
        value={t.atmosphere}
        options={["off", "subtle", "bold"]}
        onChange={(v) => setTweak("atmosphere", v)}
      />
      <TweakToggle
        label="Motion & reveals"
        value={t.motion}
        onChange={(v) => setTweak("motion", v)}
      />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("tweaks-root")).render(<App />);

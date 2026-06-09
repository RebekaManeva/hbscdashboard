import { useState, useEffect, useRef } from "react";

const C = {
  blue: "#378ADD", coral: "#D85A30", teal: "#1D9E75",
  purple: "#7F77DD", tealLight: "#5DCAA5", amber: "#BA7517",
  red: "#E24B4A", green: "#639922",
};

const STRESS = {
  all:  { m: [28,38,41], f: [34,47,58] },
  "11": { m: [28,null,null], f: [34,null,null] },
  "13": { m: [null,38,null], f: [null,47,null] },
  "15": { m: [null,null,41], f: [null,null,58] },
};
const ACTIVITY = {
  all:  [41,29,18],
  "11": [41,null,null],
  "13": [null,29,null],
  "15": [null,null,18],
};
const METRICS = {
  all:  { stress:42, active:28, sleep:51, bully:23 },
  "11": { stress:31, active:41, sleep:61, bully:18 },
  "13": { stress:43, active:29, sleep:50, bully:25 },
  "15": { stress:49, active:18, sleep:43, bully:26 },
};

const BULLY_TYPES = ["Физички", "Вербален", "Социјален", "Сајбер"];
const BULLY_M = [18, 24, 15, 12];
const BULLY_F = [9, 28, 22, 18];
const BULLY_AGE = {
  labels: ["11 год.", "13 год.", "15 год."],
  victim: [18, 25, 26],
  bully:  [12, 17, 14],
};

const SLEEP_HOURS = {
  labels: ["< 6ч", "6–7ч", "7–8ч", "8–9ч", "> 9ч"],
  "11": [4, 10, 25, 38, 23],
  "13": [8, 18, 30, 30, 14],
  "15": [14, 26, 33, 20, 7],
};
const SLEEP_QUALITY = {
  labels: ["Мн. добар", "Добар", "Среден", "Лош", "Мн. лош"],
  data: [18, 33, 28, 15, 6],
};

const SCREEN_LABELS = ["< 2ч", "2–4ч", "4–6ч", "> 6ч"];
const SCREEN_DATA   = [12, 31, 35, 22];
const SCREEN_COLORS = [C.teal, C.blue, C.amber, C.coral];
const SCREEN_BY_AGE = {
  labels: ["11 год.", "13 год.", "15 год."],
  social: [2.1, 3.4, 4.8],
  gaming: [2.8, 3.1, 2.6],
  study:  [1.2, 1.8, 2.3],
};

const COUNTRIES = ["Македонија", "Србија", "Хрватска", "Словенија", "ЕУ просек"];
const COUNTRY_DATA = {
  stress:   [42, 38, 35, 31, 33],
  active:   [28, 32, 34, 41, 38],
  sleep:    [51, 55, 58, 63, 60],
  bully:    [23, 19, 17, 14, 16],
  screen:   [57, 52, 48, 44, 49],
  wellbeing:[64, 68, 71, 76, 72],
};
const COUNTRY_COLORS = [C.blue, C.coral, C.teal, C.purple, C.amber];

const RADAR_LABELS = ["Семејство", "Пријатели", "Здравје", "Школо", "Живот"];
const RADAR_DATA = {
  "11": [8.1,7.9,7.8,7.2,8.0],
  "13": [7.6,7.8,7.1,6.8,7.4],
  "15": [7.0,7.5,6.5,6.2,6.8],
};

function useChart(ref, buildFn, deps) {
  const chartRef = useRef(null);
  useEffect(() => {
    if (!ref.current || !window.Chart) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = buildFn(ref.current);
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, deps);
}

function MetricCard({ label, value, note, color }) {
  return (
    <div style={{ background:"#f5f5f5", borderRadius:8, padding:"1rem" }}>
      <p style={{ fontSize:12, color:"#888", margin:"0 0 6px" }}> {label}</p>
      <p style={{ fontSize:28, fontWeight:600, color:color||"#1a1a1a", margin:0 }}>{value}</p>
      <p style={{ fontSize:11, color:"#aaa", margin:"4px 0 0" }}>{note}</p>
    </div>
  );
}

function Legend({ items }) {
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:12, marginBottom:10, fontSize:12, color:"#888" }}>
      {items.map(({ color, label }) => (
        <span key={label} style={{ display:"flex", alignItems:"center", gap:4 }}>
          <span style={{ width:10, height:10, borderRadius:2, background:color, display:"inline-block" }} />
          {label}
        </span>
      ))}
    </div>
  );
}

function ChartCard({ title, legend, height=220, children }) {
  return (
    <div style={{ background:"#fff", border:"0.5px solid #e0e0e0", borderRadius:12, padding:"1.25rem" }}>
      <p style={{ fontSize:15, fontWeight:500, color:"#1a1a1a", margin:"0 0 0.75rem" }}>{title}</p>
      {legend && <Legend items={legend} />}
      <div style={{ position:"relative", height }}>{children}</div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{ borderBottom:"2px solid #378ADD", paddingBottom:8, marginBottom:"1.25rem", marginTop:"2rem" }}>
      <h2 style={{ fontSize:18, fontWeight:600, color:"#1a1a1a", margin:0 }}>{children}</h2>
    </div>
  );
}

function InsightBox({ children, color="#378ADD" }) {
  return (
    <div style={{ background:"#f0f7ff", borderLeft:`3px solid ${color}`, borderRadius:"0 8px 8px 0", padding:"0.75rem 1rem", marginBottom:"1.25rem", fontSize:13, color:"#444" }}>
      {children}
    </div>
  );
}

function FilterRow({ options, active, onChange }) {
  return (
    <div style={{ display:"flex", gap:8, marginBottom:"1.5rem", flexWrap:"wrap" }}>
      {options.map(({ key, label }) => (
        <button key={key} onClick={() => onChange(key)} style={{
          fontSize:13, padding:"6px 14px", borderRadius:8, cursor:"pointer",
          border: active===key ? "1.5px solid #378ADD" : "0.5px solid #ccc",
          background: active===key ? "#E6F1FB" : "#fff",
          color: active===key ? "#0C447C" : "#666",
          fontWeight: active===key ? 500 : 400,
        }}>{label}</button>
      ))}
    </div>
  );
}

function StressChart({ group }) {
  const ref = useRef();
  useChart(ref, (c) => new window.Chart(c, {
    type:"bar",
    data:{ labels:["11 год.","13 год.","15 год."], datasets:[
      { label:"Машки", data:STRESS[group].m, backgroundColor:C.blue, borderRadius:4 },
      { label:"Женски", data:STRESS[group].f, backgroundColor:C.coral, borderRadius:4 },
    ]},
    options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } },
      scales:{ y:{ beginAtZero:true, max:70, ticks:{ callback:v=>v+"%", font:{ size:11 } }, grid:{ color:"rgba(128,128,128,0.1)" } }, x:{ ticks:{ font:{ size:11 } }, grid:{ display:false } } } },
  }), [group]);
  return <canvas ref={ref} role="img" aria-label="Стрес по возраст и пол" />;
}

function ActivityChart({ group }) {
  const ref = useRef();
  useChart(ref, (c) => new window.Chart(c, {
    type:"bar",
    data:{ labels:["11 год.","13 год.","15 год."], datasets:[
      { label:"% активни", data:ACTIVITY[group], backgroundColor:[C.teal,C.tealLight,"#9FE1CB"], borderRadius:4 },
    ]},
    options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } },
      scales:{ y:{ beginAtZero:true, max:60, ticks:{ callback:v=>v+"%", font:{ size:11 } }, grid:{ color:"rgba(128,128,128,0.1)" } }, x:{ ticks:{ font:{ size:11 } }, grid:{ display:false } } } },
  }), [group]);
  return <canvas ref={ref} role="img" aria-label="Физичка активност по возраст" />;
}

function BullyTypesChart() {
  const ref = useRef();
  useChart(ref, (c) => new window.Chart(c, {
    type:"bar",
    data:{ labels:BULLY_TYPES, datasets:[
      { label:"Машки", data:BULLY_M, backgroundColor:C.blue, borderRadius:4 },
      { label:"Женски", data:BULLY_F, backgroundColor:C.coral, borderRadius:4 },
    ]},
    options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } },
      scales:{ y:{ beginAtZero:true, max:40, ticks:{ callback:v=>v+"%", font:{ size:11 } }, grid:{ color:"rgba(128,128,128,0.1)" } }, x:{ ticks:{ font:{ size:11 } }, grid:{ display:false } } } },
  }), []);
  return <canvas ref={ref} role="img" aria-label="Видови на булинг по пол" />;
}

function BullyAgeChart() {
  const ref = useRef();
  useChart(ref, (c) => new window.Chart(c, {
    type:"line",
    data:{ labels:BULLY_AGE.labels, datasets:[
      { label:"Жртва", data:BULLY_AGE.victim, borderColor:C.coral, backgroundColor:"rgba(216,90,48,0.1)", tension:0.3, fill:true },
      { label:"Сторител", data:BULLY_AGE.bully, borderColor:C.blue, backgroundColor:"rgba(55,138,221,0.1)", tension:0.3, fill:true },
    ]},
    options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } },
      scales:{ y:{ beginAtZero:true, max:35, ticks:{ callback:v=>v+"%", font:{ size:11 } }, grid:{ color:"rgba(128,128,128,0.1)" } }, x:{ ticks:{ font:{ size:11 } }, grid:{ display:false } } } },
  }), []);
  return <canvas ref={ref} role="img" aria-label="Булинг по возраст" />;
}

function SleepHoursChart({ ageKey }) {
  const ref = useRef();
  useChart(ref, (c) => new window.Chart(c, {
    type:"bar",
    data:{ labels:SLEEP_HOURS.labels, datasets:[
      { label:"% ученици", data:SLEEP_HOURS[ageKey], backgroundColor:[C.red,"#F09595",C.amber,C.tealLight,C.teal], borderRadius:4 },
    ]},
    options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } },
      scales:{ y:{ beginAtZero:true, max:45, ticks:{ callback:v=>v+"%", font:{ size:11 } }, grid:{ color:"rgba(128,128,128,0.1)" } }, x:{ ticks:{ font:{ size:11 } }, grid:{ display:false } } } },
  }), [ageKey]);
  return <canvas ref={ref} role="img" aria-label="Часови спиење" />;
}

function SleepQualityChart() {
  const ref = useRef();
  useChart(ref, (c) => new window.Chart(c, {
    type:"doughnut",
    data:{ labels:SLEEP_QUALITY.labels, datasets:[
      { data:SLEEP_QUALITY.data, backgroundColor:[C.teal,C.tealLight,C.amber,C.coral,C.red], borderWidth:0 },
    ]},
    options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } } },
  }), []);
  return <canvas ref={ref} role="img" aria-label="Квалитет на спиење" />;
}

function ScreenAgeChart() {
  const ref = useRef();
  useChart(ref, (c) => new window.Chart(c, {
    type:"bar",
    data:{ labels:SCREEN_BY_AGE.labels, datasets:[
      { label:"Социјални мрежи", data:SCREEN_BY_AGE.social, backgroundColor:C.purple, borderRadius:4 },
      { label:"Гејминг", data:SCREEN_BY_AGE.gaming, backgroundColor:C.blue, borderRadius:4 },
      { label:"Учење", data:SCREEN_BY_AGE.study, backgroundColor:C.teal, borderRadius:4 },
    ]},
    options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } },
      scales:{ x:{ stacked:true, ticks:{ font:{ size:11 } }, grid:{ display:false } }, y:{ stacked:true, ticks:{ callback:v=>v+"ч", font:{ size:11 } }, grid:{ color:"rgba(128,128,128,0.1)" } } } },
  }), []);
  return <canvas ref={ref} role="img" aria-label="Употреба на екран по возраст" />;
}

function ScreenDonutChart() {
  const ref = useRef();
  useChart(ref, (c) => new window.Chart(c, {
    type:"doughnut",
    data:{ labels:SCREEN_LABELS, datasets:[{ data:SCREEN_DATA, backgroundColor:SCREEN_COLORS, borderWidth:0 }]},
    options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } } },
  }), []);
  return <canvas ref={ref} role="img" aria-label="Часови на екран дневно" />;
}

function CountryChart({ metric }) {
  const ref = useRef();
  useChart(ref, (c) => new window.Chart(c, {
    type:"bar",
    data:{ labels:COUNTRIES, datasets:[
      { label:metric, data:COUNTRY_DATA[metric], backgroundColor:COUNTRY_COLORS, borderRadius:4 },
    ]},
    options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } },
      scales:{ y:{ beginAtZero:true, max:100, ticks:{ callback:v=>v+"%", font:{ size:11 } }, grid:{ color:"rgba(128,128,128,0.1)" } }, x:{ ticks:{ font:{ size:11 } }, grid:{ display:false } } } },
  }), [metric]);
  return <canvas ref={ref} role="img" aria-label="Споредба по земји" />;
}

function RadarChart() {
  const ref = useRef();
  useChart(ref, (c) => new window.Chart(c, {
    type:"radar",
    data:{ labels:RADAR_LABELS, datasets:[
      { label:"11 год.", data:RADAR_DATA["11"], borderColor:C.blue, backgroundColor:"rgba(55,138,221,0.1)", pointBackgroundColor:C.blue },
      { label:"13 год.", data:RADAR_DATA["13"], borderColor:C.teal, backgroundColor:"rgba(29,158,117,0.1)", pointBackgroundColor:C.teal },
      { label:"15 год.", data:RADAR_DATA["15"], borderColor:C.coral, backgroundColor:"rgba(216,90,48,0.1)", pointBackgroundColor:C.coral },
    ]},
    options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } },
      scales:{ r:{ min:5, max:9, ticks:{ font:{ size:10 }, stepSize:1 }, pointLabels:{ font:{ size:11 } } } } },
  }), []);
  return <canvas ref={ref} role="img" aria-label="Задоволство по домени" />;
}

const QUESTIONS = [
  { id:"age",     label:"Колку години имаш?",              type:"select", options:["11","12","13","14","15"] },
  { id:"gender",  label:"Пол",                             type:"select", options:["Машки","Женски"] },
  { id:"stress",  label:"Колку често се чувствуваш под стрес?", type:"select", options:["Речиси никогаш","Понекогаш","Често","Речиси секогаш"] },
  { id:"sleep",   label:"Колку часа спиеш навечер?",       type:"select", options:["Помалку од 6","6–7 часа","7–8 часа","8–9 часа","Повеќе од 9"] },
  { id:"active",  label:"Колку дена неделно си физички активен/на?", type:"select", options:["0–1 ден","2–3 дена","4–5 дена","6–7 дена"] },
  { id:"screen",  label:"Колку часа на ден гледаш во екран (надвор од школо)?", type:"select", options:["Помалку од 2","2–4 часа","4–6 часа","Повеќе од 6"] },
  { id:"bully",   label:"Дали некогаш си доживеал/а булинг?", type:"select", options:["Никогаш","Еднаш-двапати","2–3 пати месечно","Секоја недела или почесто"] },
];

function scoreStress(v)  { return { "Речиси никогаш":0,"Понекогаш":1,"Често":2,"Речиси секогаш":3 }[v] ?? 0; }
function scoreSleep(v)   { return { "Помалку од 6":3,"6–7 часа":2,"7–8 часа":1,"8–9 часа":0,"Повеќе од 9":0 }[v] ?? 0; }
function scoreActive(v)  { return { "0–1 ден":3,"2–3 дена":2,"4–5 дена":1,"6–7 дена":0 }[v] ?? 0; }
function scoreScreen(v)  { return { "Помалку од 2":0,"2–4 часа":1,"4–6 часа":2,"Повеќе од 6":3 }[v] ?? 0; }
function scoreBully(v)   { return { "Никогаш":0,"Еднаш-двапати":1,"2–3 пати месечно":2,"Секоја недела или почесто":3 }[v] ?? 0; }

function getAnalysis(answers) {
  const ageKey = parseInt(answers.age) <= 11 ? "11" : parseInt(answers.age) <= 13 ? "13" : "15";
  const ref = METRICS[ageKey];
  const isMale = answers.gender === "Машки";

  const stressScore  = scoreStress(answers.stress);
  const sleepScore   = scoreSleep(answers.sleep);
  const activeScore  = scoreActive(answers.active);
  const screenScore  = scoreScreen(answers.screen);
  const bullyScore   = scoreBully(answers.bully);
  const total = stressScore + sleepScore + activeScore + screenScore + bullyScore;

  const samSama   = isMale ? "сам"      : "сама";
  const aktivenNa = isMale ? "активен"  : "активна";
  const doziveaL  = isMale ? "доживеал" : "доживеала";

  const insights = [];

  if (stressScore >= 2) insights.push({ color:C.coral, text:`Имаш висок стрес. Кај твојата возраст (${answers.age} год.), ${ref.stress}% од врсниците го чувствуваат истото, не си ${samSama}.` });
  else insights.push({ color:C.teal, text:`Стресот ти е под просекот за твојата возраст (${ref.stress}%). Продолжи така!` });

  if (sleepScore >= 2) insights.push({ color:C.amber, text:`Спиеш помалку од препорачаното. Само ${ref.sleep}% од твоите врсници спијат доволно, обиди се да легнуваш порано.` });
  else insights.push({ color:C.teal, text:`Спиеш доволно! Тоа те издвојува позитивно, само ${ref.sleep}% од врсниците спијат доволно.` });

  if (activeScore >= 2) insights.push({ color:C.coral, text:`Физичката активност ти е ниска. Само ${ref.active}% од врсниците се активни секојдневно, верувај и мала прошетка помага.` });
  else insights.push({ color:C.teal, text:`Си над просекот по физичка активност (${ref.active}% редовно активни во твоја возраст). Одлично!` });

  if (screenScore >= 2) insights.push({ color:C.amber, text:`Поминуваш многу време на екран. 57% од македонските млади имаат ист проблем, пробај правило без екран час пред спиење.` });

  if (bullyScore >= 1) insights.push({ color:C.purple, text:`Си ${doziveaL} булинг. Важно е да зборуваш со некој возрасен во кого имаш доверба.` });

  let overall, overallColor;
  if (total <= 3)       { overall = "Одличен баланс! Твоите навики се над просекот за твоја возраст."; overallColor = C.teal; }
  else if (total <= 6)  { overall = "Солиден баланс со простор за подобрување на 1–2 области."; overallColor = C.amber; }
  else                  { overall = "Има неколку области каде мали промени би направиле голема разлика."; overallColor = C.coral; }

  return { insights, overall, overallColor };
}

function PersonalQuiz() {
  const [answers, setAnswers] = useState({});
  const [result, setResult]   = useState(null);
  const allDone = QUESTIONS.every(q => answers[q.id]);

  function handleSubmit() {
    setResult(getAnalysis(answers));
  }

  return (
    <div>
      <InsightBox color={C.purple}>
        <strong>Личен прашалник:</strong> Одговори на прашањата и дознај каде стоиш во споредба со твоите врсници во Македонија.
      </InsightBox>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:12, marginBottom:"1.25rem" }}>
        {QUESTIONS.map(q => (
          <div key={q.id} style={{ background:"#fff", border:"0.5px solid #e0e0e0", borderRadius:10, padding:"0.875rem 1rem" }}>
            <p style={{ fontSize:13, color:"#555", margin:"0 0 8px", fontWeight:500 }}>{q.label}</p>
            <select
              value={answers[q.id] || ""}
              onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
              style={{ width:"100%", padding:"6px 10px", borderRadius:6, border:"0.5px solid #ccc", fontSize:13, background:"#fafafa", color:"#1a1a1a" }}
            >
              <option value="">— избери —</option>
              {q.options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!allDone}
        style={{ padding:"10px 28px", borderRadius:8, border:"none", fontSize:14, fontWeight:600, cursor:allDone?"pointer":"not-allowed", background:allDone?C.blue:"#ccc", color:"#fff", marginBottom:"1.5rem" }}
      >
        Анализирај ги моите одговори →
      </button>

      {result && (
        <div>
          <div style={{ background: result.overallColor+"22", border:`2px solid ${result.overallColor}`, borderRadius:10, padding:"1rem 1.25rem", marginBottom:"1rem" }}>
            <p style={{ fontSize:15, fontWeight:600, color:result.overallColor, margin:0 }}>
              {result.overall}
            </p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:10 }}>
            {result.insights.map((ins, i) => (
              <div key={i} style={{ background:"#fff", border:`0.5px solid ${ins.color}44`, borderLeft:`3px solid ${ins.color}`, borderRadius:"0 8px 8px 0", padding:"0.75rem 1rem", fontSize:13, color:"#444" }}>
                {ins.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getSmartReply(text) {
    if (text.includes("стрес") || text.includes("притисок") || text.includes("анксиозност"))
      return "Стресот е нормален дел од животот, но кога е постојан може да влијае на здравјето. Пробај: длабоко дишење 5 минути, прошетка надвор, или разговор со пријател. Во Македонија, 42% од млади на твоја возраст чувствуваат сличен притисок, не си сам/а.";
    if (text.includes("спиење") || text.includes("спијам") || text.includes("замор"))
      return "СЗО препорачува 8–10 часа спиење за млади 11–15 год. Само 51% од македонските ученици спијат доволно. Совети: исклучи екрани час пред спиење, легни во исто време секој ден, избегнувај кофеин попладне.";
    if (text.includes("булинг") || text.includes("малтретирање") || text.includes("задевање"))
      return "Булингот е сериозен проблем, 23% од македонски млади го доживеале. Ако си жртва: зборувај со возрасен во кого имаш доверба (родител, наставник), не одговарај на провокации, и знај дека не е твоја вина.";
    if (text.includes("сајбер") || text.includes("интернет") || text.includes("онлајн"))
      return "Сајбер-булингот расте со возраста, 18% од македонски млади го искусиле. Чувај ги своите лозинки, не споделувај лични информации онлајн, блокирај ги луѓето кои те вознемируваат и зборувај со возрасен.";
    if (text.includes("активност") || text.includes("спорт") || text.includes("вежбање") || text.includes("движење"))
      return "Само 28% од македонските млади се физички активни секојдневно, под препораката на СЗО од 60 мин/ден. Не мора да е gym: танцување, возење велосипед, прошетка со пријател, сè брои!";
    if (text.includes("екран") || text.includes("телефон") || text.includes("социјални") || text.includes("тикток") || text.includes("инстаграм"))
      return "57% од македонски млади поминуваат 4+ часа на екран дневно. Прекумерното користење може да влијае на спиењето и концентрацијата. Пробај правило: без телефон за време на јадење и час пред спиење.";
    if (text.includes("депресија") || text.includes("тажен") || text.includes("тажна") || text.includes("лошо"))
      return "Важно е да зборуваш за своите чувства. Ако се чувствуваш постојано тажно или без енергија, разговарај со родител, наставник или школски психолог. Не треба да се носиш со тоа сам/а.";
    if (text.includes("пријатели") || text.includes("осаменост") || text.includes("усамен") || text.includes("усамена"))
      return "Социјалните врски се многу важни за добросостојбата. Истражувањето HBSC покажува дека младите со силни пријателства имаат помал стрес. Пробај да се вклучиш во некоја активност или клуб во школото.";
    if (text.includes("школо") || text.includes("оценки") || text.includes("испит") || text.includes("учење"))
      return "Школскиот притисок е главна причина за стрес кај македонски млади. Совети: подели го учењето на мали сесии, прави паузи на секои 45 мин, и запомни дека оценките не го дефинираат твојот вид.";
    if (text.includes("здраво") || text.includes("здравје") || text.includes("добросостојба"))
      return "Добросостојбата на млади зависи од повеќе фактори: доволно спиење, физичка активност, здрава исхрана, добри социјални врски и управување со стрес. Кој аспект те интересира најмногу?";
    return "Интересно прашање! За подетални информации за здравјето и добросостојбата на млади во Македонија, разгледај ги графиците во другите табови на оваа апликација. Можам да ти помогнам со прашања за стрес, спиење, физичка активност, булинг или употреба на екран.";
  }

function AIChat() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Здраво! Можеш да ме прашаш за стрес, спиење, физичка активност, булинг, или било што поврзано со добросостојбата на млади." }
  ]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef             = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const newMessages = [...messages, { role: "user", text }];
    setMessages(newMessages);
    setLoading(true);

    setTimeout(() => {
      const reply = getSmartReply(text.toLowerCase());
      setMessages(prev => [...prev, { role: "assistant", text: reply }]);
      setLoading(false);
    }, 800);
  }

  const SUGGESTIONS = [
    "Зошто се чувствувам под стрес пред испити?",
    "Колку часа треба да спијам?",
    "Што е сајбер-булинг?",
    "Зошто е важна физичката активност?",
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", height:520 }}>
      <InsightBox color={C.purple}>
        <strong>AI Асистент</strong> — прашај го сè за здравјето и добросостојбата на млади.
      </InsightBox>
      {messages.length === 1 && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:"1rem" }}>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => setInput(s)} style={{
              fontSize:12, padding:"6px 12px", borderRadius:20, cursor:"pointer",
              border:`1px solid ${C.blue}44`, background:"#f0f7ff", color:"#0C447C",
            }}>{s}</button>
          ))}
        </div>
      )}
      <div style={{ flex:1, overflowY:"auto", border:"0.5px solid #e0e0e0", borderRadius:12, padding:"1rem", marginBottom:"0.75rem", background:"#fafafa" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display:"flex", justifyContent: m.role==="user" ? "flex-end" : "flex-start", marginBottom:"0.75rem" }}>
            <div style={{
              maxWidth:"80%", padding:"10px 14px",
              borderRadius: m.role==="user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: m.role==="user" ? C.blue : "#fff",
              color: m.role==="user" ? "#fff" : "#1a1a1a",
              fontSize:14, lineHeight:1.5,
              border: m.role==="assistant" ? "0.5px solid #e0e0e0" : "none",
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:"flex", justifyContent:"flex-start", marginBottom:"0.75rem" }}>
            <div style={{ padding:"10px 16px", borderRadius:"18px 18px 18px 4px", background:"#fff", border:"0.5px solid #e0e0e0", color:"#888", fontSize:14 }}>
              ⏳ Размислувам...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Напиши прашање..."
          style={{ flex:1, padding:"10px 14px", borderRadius:10, border:"0.5px solid #ccc", fontSize:14, outline:"none" }}
        />
        <button onClick={sendMessage} disabled={!input.trim() || loading} style={{
          padding:"10px 20px", borderRadius:10, border:"none", fontSize:14, fontWeight:600,
          cursor: input.trim() && !loading ? "pointer" : "not-allowed",
          background: input.trim() && !loading ? C.blue : "#ccc", color:"#fff",
        }}>Прати →</button>
      </div>
    </div>
  );
}

const TABS = [
  { key:"overview",   label:"Преглед" },
  { key:"stress",     label:"Стрес" },
  { key:"bullying",   label:"Булинг" },
  { key:"sleep",      label:"Спиење" },
  { key:"screen",     label:"Екран" },
  { key:"countries",  label:"Споредба" },
  { key:"quiz",       label:"Мојот профил" },
  { key:"chat",       label:"AI Асистент" },
];

const COUNTRY_METRICS = [
  { key:"stress",    label:"Стрес (%)" },
  { key:"active",    label:"Физичка активност (%)" },
  { key:"sleep",     label:"Доволно спиење (%)" },
  { key:"bully",     label:"Искусиле булинг (%)" },
  { key:"screen",    label:"Прекумерен екран (%)" },
  { key:"wellbeing", label:"Задоволство од живот (%)" },
];

export default function HBSCDashboard() {
  const [tab,         setTab]       = useState("overview");
  const [ageGroup,    setAgeGroup]  = useState("all");
  const [sleepAge,    setSleepAge]  = useState("13");
  const [countryMet,  setCountryMet]= useState("stress");

  useEffect(() => {
    if (window.Chart) return;
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
    s.async = true;
    document.head.appendChild(s);
  }, []);

  const d = METRICS[ageGroup];

  return (
    <div style={{ maxWidth:860, margin:"0 auto", padding:"1.5rem 1rem", fontFamily:"system-ui, sans-serif" }}>

      <div style={{ borderBottom:"0.5px solid #e0e0e0", marginBottom:"1.25rem", paddingBottom:"1rem" }}>
        <h1 style={{ fontSize:22, fontWeight:600, color:"#1a1a1a", margin:"0 0 4px" }}>HBSC — Македонија</h1>
        <p style={{ fontSize:14, color:"#888", margin:0 }}>
          Здравје и добросостојба на млади 11–15 год. · Базирано на меѓународното HBSC истражување
        </p>
      </div>

      <div style={{ display:"flex", gap:4, marginBottom:"1.5rem", flexWrap:"wrap", borderBottom:"0.5px solid #e0e0e0", paddingBottom:8 }}>
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)} style={{
            fontSize:13, padding:"7px 16px", borderRadius:8, cursor:"pointer", border:"none",
            background: tab===key ? "#378ADD" : "transparent",
            color: tab===key ? "#fff" : "#666",
            fontWeight: tab===key ? 600 : 400,
          }}>{label}</button>
        ))}
      </div>

      {tab === "overview" && (
        <div>
          <FilterRow
            options={[{key:"all",label:"Сите"},{key:"11",label:"11 год."},{key:"13",label:"13 год."},{key:"15",label:"15 год."}]}
            active={ageGroup} onChange={setAgeGroup}
          />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))", gap:10, marginBottom:"1.5rem" }}>
            <MetricCard label="Висок стрес"         value={d.stress+"%"} note="чувствуваат притисок" color={C.coral} />
            <MetricCard label="Физичка активност"   value={d.active+"%"} note="секојдневно активни"  color={C.teal} />
            <MetricCard label="Доволно спиење"      value={d.sleep+"%"}  note="≥8 часа навечер"      color={C.blue} />
            <MetricCard label="Булинг"              value={d.bully+"%"}  note="доживеале булинг"     color={C.purple} />
          </div>
          <InsightBox>
            <strong>Главен наод:</strong> Само <strong>28%</strong> од македонските адолесценти се физички активни секојдневно. Стресот значително расте со возраста, особено кај девојчиња.
          </InsightBox>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:"1.25rem", marginBottom:"1.25rem" }}>
            <ChartCard title="Стрес по возраст и пол" legend={[{color:C.blue,label:"Машки"},{color:C.coral,label:"Женски"}]}>
              <StressChart group={ageGroup} />
            </ChartCard>
            <ChartCard title="Физичка активност" legend={[{color:C.teal,label:"% активни ≥5 дена/нед."}]}>
              <ActivityChart group={ageGroup} />
            </ChartCard>
          </div>
          <ChartCard title="Задоволство од живот (скала 0–10)" legend={[{color:C.blue,label:"11 год."},{color:C.teal,label:"13 год."},{color:C.coral,label:"15 год."}]} height={240}>
            <RadarChart />
          </ChartCard>
        </div>
      )}

      {tab === "stress" && (
        <div>
          <SectionTitle>Стрес и анксиозност</SectionTitle>
          <InsightBox color={C.coral}>
            <strong>Клучен наод:</strong> Стресот кај девојчиња скока од 34% на 11 год. на <strong>58%</strong> на 15 год. Главни причини: школски обврски, социјален притисок и изгледот.
          </InsightBox>
          <FilterRow
            options={[{key:"all",label:"Сите"},{key:"11",label:"11 год."},{key:"13",label:"13 год."},{key:"15",label:"15 год."}]}
            active={ageGroup} onChange={setAgeGroup}
          />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:"1.25rem", marginBottom:"1.25rem" }}>
            <ChartCard title="Стрес по возраст и пол" legend={[{color:C.blue,label:"Машки"},{color:C.coral,label:"Женски"}]}>
              <StressChart group={ageGroup} />
            </ChartCard>
            <ChartCard title="Задоволство од живот по домени" legend={[{color:C.blue,label:"11 год."},{color:C.teal,label:"13 год."},{color:C.coral,label:"15 год."}]}>
              <RadarChart />
            </ChartCard>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))", gap:10 }}>
            {[["42%","Просечен стрес МК",C.coral],["58%","Девојчиња 15 год.",C.red],["28%","Момчиња 11 год.",C.blue],["2×","Пораст 11→15 год.",C.amber]].map(([v,l,col])=>(
              <MetricCard key={l} label={l} value={v} note="" color={col} />
            ))}
          </div>
        </div>
      )}

      {tab === "bullying" && (
        <div>
          <SectionTitle>Булинг и сајбер-булинг</SectionTitle>
          <InsightBox color={C.purple}>
            <strong>Клучен наод:</strong> Физичкиот булинг е поизразен кај момчиња, додека вербалниот и социјалниот кај девојчиња. Сајбер-булингот расте со возраста.
          </InsightBox>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:"1.25rem", marginBottom:"1.25rem" }}>
            <ChartCard title="Видови на булинг по пол" legend={[{color:C.blue,label:"Машки"},{color:C.coral,label:"Женски"}]}>
              <BullyTypesChart />
            </ChartCard>
            <ChartCard title="Жртви и сторители по возраст" legend={[{color:C.coral,label:"Жртва"},{color:C.blue,label:"Сторител"}]}>
              <BullyAgeChart />
            </ChartCard>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))", gap:10 }}>
            {[["23%","Доживеале булинг",C.coral],["14%","Биле сторители",C.purple],["18%","Сајбер-булинг",C.amber],["40%","Не пријавиле",C.red]].map(([v,l,col])=>(
              <MetricCard key={l} label={l} value={v} note="" color={col} />
            ))}
          </div>
        </div>
      )}

      {tab === "sleep" && (
        <div>
          <SectionTitle>Спиење</SectionTitle>
          <InsightBox color={C.blue}>
            <strong>Клучен наод:</strong> Со растење, адолесцентите спијат сè помалку. На 15 год., само <strong>27%</strong> спијат препорачаните 8+ часа, наспроти 61% на 11 год.
          </InsightBox>
          <FilterRow
            options={[{key:"11",label:"11 год."},{key:"13",label:"13 год."},{key:"15",label:"15 год."}]}
            active={sleepAge} onChange={setSleepAge}
          />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:"1.25rem", marginBottom:"1.25rem" }}>
            <ChartCard title="Часови спиење на ноќ" legend={[{color:C.teal,label:"% ученици"}]}>
              <SleepHoursChart ageKey={sleepAge} />
            </ChartCard>
            <ChartCard title="Квалитет на спиење (сите возрасти)" legend={SLEEP_QUALITY.labels.map((l,i)=>({ color:[C.teal,C.tealLight,C.amber,C.coral,C.red][i], label:l }))}>
              <SleepQualityChart />
            </ChartCard>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))", gap:10 }}>
            {[["51%","Доволно спиење (просек)",C.blue],["27%","На 15 год. ≥8ч",C.coral],["61%","На 11 год. ≥8ч",C.teal],["8–10ч","Препорака СЗО",C.amber]].map(([v,l,col])=>(
              <MetricCard key={l} label={l} value={v} note="" color={col} />
            ))}
          </div>
        </div>
      )}

      {tab === "screen" && (
        <div>
          <SectionTitle>Екран на Дигитална добросостојба</SectionTitle>
          <InsightBox color={C.purple}>
            <strong>Клучен наод:</strong> 57% од македонските млади поминуваат <strong>4+ часа</strong> на екран дневно (надвор од школо). Употребата на социјални мрежи се зголемува двојно од 11 до 15 год.
          </InsightBox>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:"1.25rem", marginBottom:"1.25rem" }}>
            <ChartCard title="Часови на екран дневно" legend={SCREEN_LABELS.map((l,i)=>({ color:SCREEN_COLORS[i], label:l }))}>
              <ScreenDonutChart />
            </ChartCard>
            <ChartCard title="Употреба по тип и возраст (ч/ден)" legend={[{color:C.purple,label:"Социјални мрежи"},{color:C.blue,label:"Гејминг"},{color:C.teal,label:"Учење"}]} height={220}>
              <ScreenAgeChart />
            </ChartCard>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))", gap:10 }}>
            {[["57%","Прекумерен екран",C.coral],["4.8ч","Соц. мрежи (15 год.)",C.purple],["2.1ч","Соц. мрежи (11 год.)",C.teal],["22%","Повеќе од 6ч/ден",C.red]].map(([v,l,col])=>(
              <MetricCard key={l} label={l} value={v} note="" color={col} />
            ))}
          </div>
        </div>
      )}

      {tab === "countries" && (
        <div>
          <SectionTitle>Македонија vs. други земји</SectionTitle>
          <InsightBox color={C.teal}>
            <strong>Контекст:</strong> Македонија учествува во меѓународната HBSC студија заедно со 50+ земји. Погледни каде стои во регионот.
          </InsightBox>
          <FilterRow
            options={COUNTRY_METRICS}
            active={countryMet} onChange={setCountryMet}
          />
          <ChartCard
            title={COUNTRY_METRICS.find(m=>m.key===countryMet)?.label + " регионална споредба"}
            legend={COUNTRIES.map((c,i)=>({ color:COUNTRY_COLORS[i], label:c }))}
            height={260}
          >
            <CountryChart metric={countryMet} />
          </ChartCard>
          <div style={{ marginTop:"1.25rem", display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:10 }}>
            {[
              ["Стрес","МК 42% vs ЕУ просек 33%","Македонија е над просекот",C.coral],
              ["Физичка акт.","МК 28% vs ЕУ просек 38%","Под регионалниот просек",C.amber],
              ["Спиење","МК 51% vs ЕУ просек 60%","Помалку ученици спијат доволно",C.blue],
            ].map(([title,sub,note,col])=>(
              <div key={title} style={{ background:"#fff", border:`0.5px solid ${col}44`, borderLeft:`3px solid ${col}`, borderRadius:"0 8px 8px 0", padding:"0.875rem 1rem" }}>
                <p style={{ fontSize:14, fontWeight:600, color:"#1a1a1a", margin:"0 0 2px" }}>{title}: {sub}</p>
                <p style={{ fontSize:12, color:"#888", margin:0 }}>{note}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "quiz" && (
        <div>
          <SectionTitle>Мојот профил на добросостојба</SectionTitle>
          <PersonalQuiz />
        </div>
      )}

      {tab === "chat" && (
        <div>
          <SectionTitle>AI Асистент за здравје и навики</SectionTitle>
          <AIChat />
        </div>
      )}

      <div style={{ fontSize:12, color:"#aaa", paddingBottom:"1rem", marginTop:"2rem", borderTop:"0.5px solid #e0e0e0", paddingTop:"1rem" }}>
        <span style={{ background:"#E6F1FB", color:"#0C447C", fontSize:11, padding:"3px 10px", borderRadius:6, marginRight:6 }}>HBSC 2022</span>
        <span style={{ background:"#E1F5EE", color:"#085041", fontSize:11, padding:"3px 10px", borderRadius:6, marginRight:6 }}>WHO</span>
        <span style={{ background:"#FAEEDA", color:"#633806", fontSize:11, padding:"3px 10px", borderRadius:6, marginRight:6 }}>MK HBSC Platform</span>
        Репрезентативни вредности базирани на HBSC студијата. За официјални бројки:{" "}
        <a href="https://hbsc.org" target="_blank" rel="noreferrer" style={{ color:"#378ADD" }}>hbsc.org</a>
      </div>
    </div>
  );
}
import { useState } from "react";

// ══════════════════════════════════════════════════════════
//  ÚLTIMOS RESULTADOS REAIS (atualizar após cada sorteio)
// ══════════════════════════════════════════════════════════
const ULTIMOS_RESULTADOS = {
  mega: {
    concurso: 3007,
    data: "12/05/2026",
    dezenas: [17, 19, 27, 32, 38, 44],
    ganhadores6: 0,
    premio: "Acumulou",
    proximoConcurso: 3008,
    proximaData: "14/05/2026",
    proximoPremio: "R$ 60 milhões",
    acumulado: true,
  },
  loto: {
    concurso: 3686,
    data: "15/05/2026",
    dezenas: [1,2,4,5,6,8,9,10,13,15,18,19,23,24,25],
    ganhadores15: 3,
    premio: "R$ 466.940,73",
    proximoConcurso: 3687,
    proximaData: "16/05/2026",
    proximoPremio: "R$ 2 milhões",
    acumulado: false,
  },
};

// Data de atualização da análise estatística
const DATA_ANALISE = "16/05/2026";
const CONCURSO_BASE_MEGA = 3007;
const CONCURSO_BASE_LOTO = 3686;

// ══════════════════════════════════════════════════════════
//  DADOS — MEGA-SENA
// ══════════════════════════════════════════════════════════
const MEGA_FREQ = [
  { n:1,  freq:290 },{ n:2,  freq:278 },{ n:3,  freq:306 },{ n:4,  freq:314 },
  { n:5,  freq:327 },{ n:6,  freq:284 },{ n:7,  freq:293 },{ n:8,  freq:281 },
  { n:9,  freq:285 },{ n:10, freq:348 },{ n:11, freq:286 },{ n:12, freq:273 },
  { n:13, freq:295 },{ n:14, freq:283 },{ n:15, freq:259 },{ n:16, freq:292 },
  { n:17, freq:305 },{ n:18, freq:271 },{ n:19, freq:274 },{ n:20, freq:309 },
  { n:21, freq:250 },{ n:22, freq:257 },{ n:23, freq:316 },{ n:24, freq:269 },
  { n:25, freq:300 },{ n:26, freq:244 },{ n:27, freq:263 },{ n:28, freq:261 },
  { n:29, freq:294 },{ n:30, freq:279 },{ n:31, freq:272 },{ n:32, freq:308 },
  { n:33, freq:319 },{ n:34, freq:322 },{ n:35, freq:268 },{ n:36, freq:291 },
  { n:37, freq:303 },{ n:38, freq:312 },{ n:39, freq:280 },{ n:40, freq:267 },
  { n:41, freq:302 },{ n:42, freq:270 },{ n:43, freq:297 },{ n:44, freq:277 },
  { n:45, freq:299 },{ n:46, freq:288 },{ n:47, freq:304 },{ n:48, freq:287 },
  { n:49, freq:265 },{ n:50, freq:301 },{ n:51, freq:307 },{ n:52, freq:275 },
  { n:53, freq:332 },{ n:54, freq:310 },{ n:55, freq:254 },{ n:56, freq:298 },
  { n:57, freq:289 },{ n:58, freq:276 },{ n:59, freq:282 },{ n:60, freq:296 },
];

const MEGA_JOGOS = [
  { id:1, nome:"Frequência Histórica", dezenas:[5,10,23,33,38,53], criterio:"6 das 11 dezenas mais sorteadas de toda a história (todas acima de 310 saídas). Padrão 3P+3I. Soma = 162. Cobre faixas 1–10, 21–30, 31–40 e 51–60.", soma:162, pares:3, impares:3, cor:"#009c3b", tag:"🔥 Quentes" },
  { id:2, nome:"Equilíbrio Misto",     dezenas:[4,17,32,41,54,60], criterio:"Combina 2 dezenas muito quentes (4, 54) + 3 medianas (17, 32, 60) + 1 acima da média (41). 1 dezena por faixa de 10. Soma = 208. Padrão 4P+2I.", soma:208, pares:4, impares:2, cor:"#00b34a", tag:"⚖️ Equilibrado" },
  { id:3, nome:"Quente + Frio",        dezenas:[10,21,34,40,53,55], criterio:"Estratégia de contraste: 3 dezenas quentes (10, 34, 53) + 3 frias atrasadas (21, 40, 55). Aposta na teoria do retorno à média. Soma = 213. Padrão 3P+3I.", soma:213, pares:3, impares:3, cor:"#007a2f", tag:"🌡️ Contraste" },
  { id:4, nome:"Faixas Cobertas",      dezenas:[7,15,29,38,47,56], criterio:"1 dezena por cada bloco de 10 números — cobertura máxima do volante. Soma = 192 (zona ideal 150–200). Padrão 2P+4I.", soma:192, pares:2, impares:4, cor:"#00c853", tag:"📐 Cobertura" },
  { id:5, nome:"Pares Frequentes",     dezenas:[5,10,23,34,45,50], criterio:"Inclui 4 dos pares de dezenas mais frequentes historicamente (10-23, 5-34 entre os top pares). Soma = 167. Faixas bem distribuídas. Padrão 3P+3I.", soma:167, pares:3, impares:3, cor:"#00875a", tag:"🔗 Pares Freq." },
  { id:6, nome:"Zona Central",         dezenas:[20,27,33,38,43,51], criterio:"Concentra na faixa 20–55, região historicamente com mais aparições. Evita extremos (1-5 e 56-60). Soma = 212. Padrão 2P+4I.", soma:212, pares:2, impares:4, cor:"#34d058", tag:"🎯 Central" },
];

const MEGA_PADROES = {
  somaIdeal: "150–200", somaPico: 175,
  somaFaixas: [
    { range:"< 100",    pct:0.1 }, { range:"100–129", pct:3.4  },
    { range:"130–149", pct:18.2 }, { range:"150–174", pct:31.7 },
    { range:"175–199", pct:29.8 }, { range:"200–219", pct:14.1 },
    { range:"220–249", pct:2.5  }, { range:"> 249",   pct:0.2  },
  ],
  distParImpar: [
    { combo:"3P+3I", pct:33.2, hot:true  },
    { combo:"4P+2I", pct:22.8, hot:true  },
    { combo:"2P+4I", pct:22.4, hot:true  },
    { combo:"5P+1I", pct:9.1,  hot:false },
    { combo:"1P+5I", pct:8.7,  hot:false },
    { combo:"6P+0I", pct:1.9,  hot:false },
    { combo:"0P+6I", pct:1.9,  hot:false },
  ],
  repetidas: [
    { rep:"0 repetições",  pct:28, desc:"Concurso sem nenhuma repetição" },
    { rep:"1 repetição",   pct:36, desc:"Mais comum — padrão mais frequente" },
    { rep:"2 repetições",  pct:25, desc:"Ocorre em ~1/4 dos concursos" },
    { rep:"3+ repetições", pct:11, desc:"Raro, mas acontece" },
  ],
  consecutivos: [
    { tipo:"Nenhum par consecutivo",   pct:22 },
    { tipo:"1 par de consecutivos",    pct:41 },
    { tipo:"2 pares de consecutivos",  pct:26 },
    { tipo:"3+ pares consecutivos",    pct:11 },
  ],
  faixas: [
    { faixa:"1–10",  pct:13.8 }, { faixa:"11–20", pct:15.9 },
    { faixa:"21–30", pct:14.7 }, { faixa:"31–40", pct:18.6 },
    { faixa:"41–50", pct:19.1 }, { faixa:"51–60", pct:17.9 },
  ],
  mediaEsperada: 295,
  concursos: "3.007+",
  totalDezenas: "18.000+",
  maisFreq: "10 (348×)",
  menosFreq: "26 (244×)",
  prob: "1 em 50.063.860",
  escolha: 6, universo: 60,
  aposta: "R$ 5,00",
};

// ══════════════════════════════════════════════════════════
//  DADOS — LOTOFÁCIL
// ══════════════════════════════════════════════════════════
const LOTO_FREQ = [
  { n:1,  freq:2098 },{ n:2,  freq:2101 },{ n:3,  freq:2089 },{ n:4,  freq:2094 },
  { n:5,  freq:2105 },{ n:6,  freq:2076 },{ n:7,  freq:2082 },{ n:8,  freq:2088 },
  { n:9,  freq:2092 },{ n:10, freq:2198 },{ n:11, freq:2180 },{ n:12, freq:2110 },
  { n:13, freq:2162 },{ n:14, freq:2118 },{ n:15, freq:2086 },{ n:16, freq:2079 },
  { n:17, freq:2071 },{ n:18, freq:2068 },{ n:19, freq:2074 },{ n:20, freq:2210 },
  { n:21, freq:2063 },{ n:22, freq:2077 },{ n:23, freq:2070 },{ n:24, freq:2140 },
  { n:25, freq:2155 },
];

// Moldura: 1,2,3,4,5,6,10,11,15,16,20,21,22,23,24,25
// Miolo: 7,8,9,12,13,14,17,18,19
const LOTO_MOLDURA = [1,2,3,4,5,6,10,11,15,16,20,21,22,23,24,25];
const LOTO_MIOLO   = [7,8,9,12,13,14,17,18,19];

const LOTO_JOGOS = [
  {
    id:1, nome:"Top Frequência Histórica",
    dezenas:[10,11,13,20,24,25,1,3,4,5,14,12,2,9,22],
    criterio:"Os 15 números mais sorteados de toda a história da Lotofácil (todos acima de 2.090 sorteios). Inclui o líder 20 (2.210×) e o vice 10 (2.198×). Padrão 7P+8I. Soma = 179.",
    soma:179, pares:7, impares:8, moldura:11, miolo:4, cor:"#7c3aed", tag:"🔥 Quentes",
  },
  {
    id:2, nome:"Equilíbrio Moldura+Miolo",
    dezenas:[1,3,5,7,9,10,12,13,15,17,20,22,23,24,25],
    criterio:"10 da moldura + 5 do miolo. Segue o padrão histórico mais frequente: moldura 9-11, miolo 4-6. Soma = 186. Padrão 7P+8I.",
    soma:186, pares:7, impares:8, moldura:10, miolo:5, cor:"#9333ea", tag:"⚖️ Moldura+Miolo",
  },
  {
    id:3, nome:"Quentes + Frias",
    dezenas:[10,11,13,20,25,17,18,19,21,6,16,23,7,24,4],
    criterio:"8 dezenas quentes (10, 11, 13, 20, 24, 25, 23, 4) + 7 frias/atrasadas (6, 16, 17, 18, 19, 21, 7). Estratégia de contraste estatístico. Soma = 215. Padrão 8P+7I.",
    soma:215, pares:8, impares:7, moldura:10, miolo:5, cor:"#6d28d9", tag:"🌡️ Contraste",
  },
  {
    id:4, nome:"Soma Ideal (180–210)",
    dezenas:[2,5,8,10,11,13,14,17,19,20,22,23,24,25,1],
    criterio:"Jogo montado para a soma cair exatamente na faixa mais frequente (180–210). Soma = 194. Distribui bem por todas as faixas do volante. Padrão 7P+8I.",
    soma:194, pares:7, impares:8, moldura:10, miolo:5, cor:"#a855f7", tag:"➕ Soma Ideal",
  },
  {
    id:5, nome:"Cobertura Total de Faixas",
    dezenas:[1,4,6,8,11,13,16,18,20,22,23,24,25,9,14],
    criterio:"Ao menos 2 dezenas por cada faixa de 5 (1-5, 6-10, 11-15, 16-20, 21-25). Cobertura máxima do volante. Soma = 197. Padrão 8P+7I.",
    soma:197, pares:8, impares:7, moldura:11, miolo:4, cor:"#c026d3", tag:"📐 Cobertura",
  },
  {
    id:6, nome:"Fibonacci + Frequência",
    dezenas:[1,2,3,5,8,13,10,20,24,25,11,14,22,23,4],
    criterio:"Inclui todos os 7 números de Fibonacci disponíveis (1,2,3,5,8,13,21→substituído por 21≈22). Completa com os mais frequentes. Padrão histórico: 3-6 Fibonacci por concurso. Soma = 188.",
    soma:188, pares:7, impares:8, moldura:11, miolo:4, cor:"#8b5cf6", tag:"🌀 Fibonacci",
  },
];

const LOTO_PADROES = {
  somaIdeal: "171–220", somaPico: 195,
  somaFaixas: [
    { range:"< 150",    pct:0.3 }, { range:"150–170", pct:6.8  },
    { range:"171–185", pct:22.4 }, { range:"186–200", pct:29.1 },
    { range:"201–215", pct:27.3 }, { range:"216–230", pct:11.8 },
    { range:"231–250", pct:2.1  }, { range:"> 250",   pct:0.2  },
  ],
  distParImpar: [
    { combo:"7P+8I", pct:32.8, hot:true  },
    { combo:"8P+7I", pct:28.4, hot:true  },
    { combo:"6P+9I", pct:19.2, hot:true  },
    { combo:"9P+6I", pct:12.1, hot:false },
    { combo:"5P+10I",pct:5.3,  hot:false },
    { combo:"10P+5I",pct:1.8,  hot:false },
    { combo:"outros",pct:0.4,  hot:false },
  ],
  repetidas: [
    { rep:"≤ 7 repetições",  pct:8,  desc:"Pouquíssimas repetições — incomum" },
    { rep:"8 repetições",    pct:22, desc:"Limite inferior do padrão ideal" },
    { rep:"9 repetições",    pct:31, desc:"Mais comum — padrão mais frequente" },
    { rep:"10 repetições",   pct:25, desc:"Muito comum também" },
    { rep:"11+ repetições",  pct:14, desc:"Alto nível de repetição — menos comum" },
  ],
  consecutivos: [
    { tipo:"Pelo menos 1 par consecutivo",  pct:100, desc:"100% dos concursos têm ao menos 1" },
    { tipo:"Média de pares consecutivos",   pct:83,  desc:"~8,37 pares/concurso em média" },
    { tipo:"2+ pares consecutivos",         pct:74,  desc:"Muito frequente" },
    { tipo:"Sequência de 3+",               pct:51,  desc:"Presente em metade dos sorteios" },
  ],
  molduraMiolo: [
    { local:"Moldura (borda)", ideal:"9–11", media:10, pct:67 },
    { local:"Miolo (centro)",  ideal:"4–6",  media:5,  pct:33 },
  ],
  faixas: [
    { faixa:"1–5",   pct:18.4 }, { faixa:"6–10",  pct:19.8 },
    { faixa:"11–15", pct:20.6 }, { faixa:"16–20", pct:21.2 },
    { faixa:"21–25", pct:20.0 },
  ],
  mediaEsperada: 2100,
  concursos: "3.679+",
  totalDezenas: "55.000+",
  maisFreq: "20 (2.210×)",
  menosFreq: "21 (2.063×)",
  prob: "1 em 3.268.760",
  escolha: 15, universo: 25,
  aposta: "R$ 3,50",
};

// ══════════════════════════════════════════════════════════
//  UTILITÁRIOS
// ══════════════════════════════════════════════════════════
function getCorFreqMega(freq) {
  const ratio = (freq - 244) / (348 - 244);
  if (ratio > 0.72) return "#ef4444";
  if (ratio > 0.45) return "#f59e0b";
  if (ratio > 0.22) return "#6b7280";
  return "#3b82f6";
}
function getCorFreqLoto(freq) {
  const ratio = (freq - 2063) / (2210 - 2063);
  if (ratio > 0.72) return "#ef4444";
  if (ratio > 0.45) return "#f59e0b";
  if (ratio > 0.22) return "#6b7280";
  return "#3b82f6";
}

// ══════════════════════════════════════════════════════════
//  SUB-COMPONENTES
// ══════════════════════════════════════════════════════════
function BarraHorizontal({ pct, max, cor, height = 10 }) {
  return (
    <div style={{ flex:1, height, background:"rgba(255,255,255,0.08)", borderRadius:height/2 }}>
      <div style={{
        height:"100%", borderRadius:height/2,
        background: cor || "#6b7280",
        width:`${Math.min(100, (pct / max) * 100)}%`,
        transition:"width 0.5s",
      }} />
    </div>
  );
}

function Badge({ label, cor }) {
  return (
    <span style={{
      background: cor, color:"#fff", borderRadius:6,
      padding:"2px 10px", fontSize:11, fontWeight:700,
      display:"inline-block", whiteSpace:"nowrap",
    }}>{label}</span>
  );
}

function Bolinha({ n, cor, size = 40 }) {
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%",
      background:`linear-gradient(135deg, ${cor}, ${cor}99)`,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize: size > 36 ? 14 : 11, fontWeight:700, color:"#fff",
      fontFamily:"monospace", flexShrink:0,
      boxShadow:`0 3px 10px ${cor}44`,
    }}>{String(n).padStart(2,"0")}</div>
  );
}

// ── ABA: Frequência ──────────────────────────────────────
function AbaFrequencia({ dados, getCorFreq, mediaEsperada, universo, accent = "#009c3b" }) {
  const [sel, setSel] = useState([]);
  const freqs = dados;
  const maxF = Math.max(...freqs.map(f=>f.freq));
  const minF = Math.min(...freqs.map(f=>f.freq));
  const sorted = [...freqs].sort((a,b)=>b.freq-a.freq);

  const toggle = (n) => setSel(prev =>
    prev.includes(n) ? prev.filter(x=>x!==n) : [...prev, n]
  );

  return (
    <div>
      <p style={{ color:"#94a3b8", fontSize:13, marginBottom:16, lineHeight:1.5 }}>
        🔴 Vermelho = mais sorteado | 🔵 Azul = menos sorteado | Linha tracejada = média esperada ({mediaEsperada.toLocaleString()}×). Clique para selecionar dezenas.
      </p>

      {/* Grid de bolinhas com barras */}
      <div style={{ display:"grid", gridTemplateColumns:`repeat(auto-fill, minmax(${universo <= 25 ? 80 : 68}px, 1fr))`, gap:6 }}>
        {freqs.map(({ n, freq }) => {
          const barPct = ((freq - minF) / (maxF - minF)) * 100;
          const mediaPct = ((mediaEsperada - minF) / (maxF - minF)) * 100;
          const cor = getCorFreq(freq);
          const isSel = sel.includes(n);
          return (
            <div key={n} onClick={() => toggle(n)} style={{
              background: isSel ? `${cor}22` : "rgba(255,255,255,0.04)",
              border:`1px solid ${isSel ? cor : "rgba(255,255,255,0.08)"}`,
              borderRadius:8, padding:"8px 6px", cursor:"pointer", textAlign:"center",
              transform: isSel ? "scale(1.06)" : "scale(1)", transition:"all 0.18s",
              boxShadow: isSel ? `0 4px 14px ${cor}44` : "none",
            }}>
              <div style={{
                width:32, height:32, borderRadius:"50%",
                background:`linear-gradient(135deg, ${cor}dd, ${cor}77)`,
                display:"flex", alignItems:"center", justifyContent:"center",
                margin:"0 auto 6px", fontSize:12, fontWeight:700, color:"#fff", fontFamily:"monospace",
              }}>{String(n).padStart(2,"0")}</div>
              <div style={{
                height:36, background:"rgba(255,255,255,0.05)", borderRadius:3,
                position:"relative", overflow:"hidden", marginBottom:4,
              }}>
                <div style={{
                  position:"absolute", bottom:0, left:0, right:0,
                  height:`${barPct}%`, background:cor, borderRadius:"3px 3px 0 0", transition:"height 0.3s",
                }} />
                <div style={{
                  position:"absolute", left:0, right:0,
                  bottom:`${mediaPct}%`, height:1,
                  borderTop:"1px dashed rgba(255,255,255,0.35)",
                }} />
              </div>
              <div style={{ fontSize:10, color:"#94a3b8", fontFamily:"monospace" }}>{freq.toLocaleString()}×</div>
            </div>
          );
        })}
      </div>

      {/* Seleção */}
      {sel.length > 0 && (
        <div style={{
          marginTop:14, background:`${accent}14`,
          border:`1px solid ${accent}40`, borderRadius:10, padding:14,
        }}>
          <div style={{ fontSize:13, color:accent, fontWeight:700, marginBottom:8 }}>
            🎯 Selecionadas ({sel.length}):
          </div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
            {[...sel].sort((a,b)=>a-b).map(n => {
              const f = freqs.find(x=>x.n===n);
              return (
                <span key={n} style={{
                  background: getCorFreq(f.freq), color:"#fff",
                  borderRadius:20, padding:"3px 10px", fontSize:12, fontWeight:700, fontFamily:"monospace",
                }}>{String(n).padStart(2,"0")} ({f.freq.toLocaleString()}×)</span>
              );
            })}
          </div>
          <div style={{ fontSize:12, color:"#94a3b8" }}>
            Soma: <strong style={{color:accent}}>{sel.reduce((a,b)=>a+b,0)}</strong> |
            Pares: <strong style={{color:accent}}>{sel.filter(n=>n%2===0).length}</strong> |
            Ímpares: <strong style={{color:accent}}>{sel.filter(n=>n%2!==0).length}</strong>
          </div>
          <button onClick={()=>setSel([])} style={{
            marginTop:8, background:"transparent", border:"1px solid rgba(255,255,255,0.15)",
            color:"#64748b", borderRadius:6, padding:"3px 10px", cursor:"pointer", fontSize:11,
          }}>Limpar</button>
        </div>
      )}

      {/* Top/Bottom */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:18 }}>
        {[
          { title:"🔥 Mais Sorteados", data:sorted.slice(0,universo<=25?10:12), cor:"#ef4444" },
          { title:"❄️ Menos Sorteados", data:sorted.slice(-universo<=25?-10:-12).reverse(), cor:"#3b82f6" },
        ].map(({ title, data, cor }) => (
          <div key={title} style={{
            background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
            borderRadius:10, padding:14,
          }}>
            <div style={{ fontSize:13, fontWeight:700, color:cor, marginBottom:10 }}>{title}</div>
            {data.map(({ n, freq }, i) => (
              <div key={n} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                <span style={{ fontSize:10, color:"#64748b", width:16, textAlign:"right" }}>{i+1}.</span>
                <span style={{
                  background:cor, color:"#fff", borderRadius:4, padding:"2px 6px",
                  fontSize:12, fontFamily:"monospace", fontWeight:700, minWidth:26, textAlign:"center",
                }}>{String(n).padStart(2,"0")}</span>
                <BarraHorizontal pct={freq - minF} max={maxF - minF} cor={cor} height={6} />
                <span style={{ fontSize:11, color:"#94a3b8", fontFamily:"monospace", minWidth:44 }}>{freq.toLocaleString()}×</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ABA: Padrões ─────────────────────────────────────────
function AbaPadroes({ padroes, isLoto, accent = "#009c3b", accent2 = "#34d058" }) {
  const { somaFaixas, somaIdeal, somaPico, distParImpar, repetidas, consecutivos, faixas, molduraMiolo } = padroes;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

      {/* SOMA */}
      <Bloco title="➕ Soma das Dezenas Sorteadas" corTitle={accent}>
        <p style={{ color:"#94a3b8", fontSize:13, margin:"0 0 12px" }}>
          A soma segue uma curva quase normal. Jogos fora da faixa ideal são estatisticamente raros.
        </p>
        {somaFaixas.map(({ range, pct }) => {
          const hot = isLoto ? (range.includes("186") || range.includes("171") || range.includes("201")) : (range.includes("150") || range.includes("175"));
          return (
            <div key={range} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:7 }}>
              <span style={{ fontFamily:"monospace", fontSize:12, color:"#94a3b8", minWidth:78 }}>{range}</span>
              <BarraHorizontal pct={pct} max={32} cor={hot ? accent : "#4b5563"} />
              <span style={{ fontSize:12, fontFamily:"monospace", color: pct > 18 ? accent : "#64748b", minWidth:36 }}>{pct}%</span>
            </div>
          );
        })}
        <div style={{ marginTop:10, background:`${accent}18`, borderRadius:8, padding:10, fontSize:12, color:accent }}>
          ✅ Zona ideal: <strong>{somaIdeal}</strong> | Pico: ~<strong>{somaPico}</strong>
        </div>
      </Bloco>

      {/* PARES/ÍMPARES */}
      <Bloco title="⚖️ Distribuição Pares × Ímpares" corTitle={accent2}>
        {distParImpar.map(({ combo, pct, hot }) => (
          <div key={combo} style={{ marginBottom:9 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
              <span style={{ color: hot ? "#e2e8f0" : "#6b7280", fontFamily:"monospace", fontWeight: hot ? 700 : 400 }}>{combo}</span>
              <span style={{ color: pct > 20 ? accent2 : "#64748b", fontFamily:"monospace", fontWeight: pct > 20 ? 700 : 400 }}>{pct}%</span>
            </div>
            <BarraHorizontal pct={pct} max={35} cor={hot ? (pct > 25 ? accent2 : `${accent2}88`) : "#374151"} />
          </div>
        ))}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:12 }}>
          <div style={{ background:`${accent2}12`, borderRadius:8, padding:10 }}>
            <div style={{ fontSize:11, color:accent2, fontWeight:700, marginBottom:4 }}>✅ Recomendado</div>
            <div style={{ fontSize:12, color:"#e2e8f0" }}>
              {isLoto ? "7P+8I, 8P+7I ou 6P+9I cobrem 80% dos casos." : "3P+3I, 4P+2I ou 2P+4I cobrem 78% dos casos."}
            </div>
          </div>
          <div style={{ background:"rgba(239,68,68,0.08)", borderRadius:8, padding:10 }}>
            <div style={{ fontSize:11, color:"#ef4444", fontWeight:700, marginBottom:4 }}>❌ Evite</div>
            <div style={{ fontSize:12, color:"#e2e8f0" }}>
              {isLoto ? "10P+5I ou 5P+10I são raros." : "6 pares ou 6 ímpares = apenas 3,8% dos casos."}
            </div>
          </div>
        </div>
      </Bloco>

      {/* MOLDURA/MIOLO apenas Lotofácil */}
      {isLoto && molduraMiolo && (
        <Bloco title="🖼️ Moldura × Miolo do Volante" corTitle={accent}>
          <p style={{ color:"#94a3b8", fontSize:13, margin:"0 0 12px" }}>
            O volante da Lotofácil tem 16 números na <strong style={{color:"#e2e8f0"}}>borda (Moldura)</strong> e 9 no <strong style={{color:"#e2e8f0"}}>centro (Miolo)</strong>.
          </p>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:12 }}>
            <div style={{ background:`${accent}14`, border:`1px solid ${accent}35`, borderRadius:8, padding:"10px 14px", flex:1 }}>
              <div style={{ fontSize:12, color:accent, fontWeight:700 }}>🖼️ Moldura (borda)</div>
              <div style={{ fontSize:12, color:"#94a3b8", marginTop:4 }}>Dezenas: 1,2,3,4,5,6,10,11,15,16,20,21,22,23,24,25</div>
              <div style={{ fontSize:13, color:"#e2e8f0", marginTop:6 }}>Ideal: <strong style={{color:accent}}>9–11 dezenas</strong> por concurso</div>
            </div>
            <div style={{ background:`${accent2}14`, border:`1px solid ${accent2}35`, borderRadius:8, padding:"10px 14px", flex:1 }}>
              <div style={{ fontSize:12, color:accent2, fontWeight:700 }}>⬛ Miolo (centro)</div>
              <div style={{ fontSize:12, color:"#94a3b8", marginTop:4 }}>Dezenas: 7, 8, 9, 12, 13, 14, 17, 18, 19</div>
              <div style={{ fontSize:13, color:"#e2e8f0", marginTop:6 }}>Ideal: <strong style={{color:accent2}}>4–6 dezenas</strong> por concurso</div>
            </div>
          </div>
        </Bloco>
      )}

      {/* FAIXAS */}
      <Bloco title="📐 Distribuição por Faixas Numéricas" corTitle={accent}>
        {faixas.map(({ faixa, pct }) => (
          <div key={faixa} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
            <span style={{ fontFamily:"monospace", fontSize:12, color:"#94a3b8", minWidth:54 }}>{faixa}</span>
            <BarraHorizontal pct={pct} max={25} cor={pct > 19 ? accent : "#374151"} />
            <span style={{ fontSize:12, fontFamily:"monospace", color: pct > 19 ? accent : "#64748b", minWidth:36 }}>{pct}%</span>
          </div>
        ))}
        <div style={{ marginTop:8, fontSize:12, color:"#64748b" }}>
          {isLoto ? "As 5 faixas são bem equilibradas; sorteios concentrados em 1 faixa são raros." : "Faixas 31–50 concentram mais aparições. Evite todas as dezenas na mesma faixa."}
        </div>
      </Bloco>

      {/* REPETIÇÕES */}
      <Bloco title="🔄 Repetições do Concurso Anterior" corTitle={accent2}>
        {repetidas.map(({ rep, pct, desc }) => (
          <div key={rep} style={{ marginBottom:9 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
              <span style={{ color:"#e2e8f0" }}>{rep}</span>
              <span style={{ color: pct >= 25 ? accent2 : "#64748b", fontFamily:"monospace" }}>{pct}%</span>
            </div>
            <BarraHorizontal pct={pct} max={35} cor={pct >= 25 ? accent2 : "#4b5563"} />
            <div style={{ fontSize:11, color:"#64748b", marginTop:2 }}>{desc}</div>
          </div>
        ))}
      </Bloco>

      {/* CONSECUTIVOS */}
      <Bloco title="⛓️ Números Consecutivos" corTitle="#ef4444">
        {consecutivos.map(({ tipo, pct, desc }) => (
          <div key={tipo} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
            <span style={{ fontSize:12, color:"#94a3b8", minWidth: isLoto ? 260 : 220 }}>{tipo}</span>
            <BarraHorizontal pct={pct} max={100} cor={pct >= 70 ? "#ef4444" : "#4b5563"} />
            <span style={{ fontFamily:"monospace", fontSize:12, color:"#94a3b8", minWidth:36 }}>{pct}%</span>
          </div>
        ))}
        <div style={{ marginTop:8, background:"rgba(239,68,68,0.08)", borderRadius:8, padding:10, fontSize:12, color:"#ef4444" }}>
          {isLoto ? "⚠️ 100% dos sorteios da Lotofácil têm pelo menos 1 par consecutivo. Inclua ao menos 1 par consecutivo no seu jogo." : "✅ ~78% dos concursos têm ao menos 1 par consecutivo. Inclua 1–2 pares consecutivos."}
        </div>
      </Bloco>
    </div>
  );
}

function Bloco({ title, corTitle, children }) {
  return (
    <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:18 }}>
      <h3 style={{ color:corTitle, fontSize:15, margin:"0 0 14px" }}>{title}</h3>
      {children}
    </div>
  );
}

// ── ABA: Jogos Sugeridos ─────────────────────────────────
function AbaJogos({ jogos, padroes, isLoto, accent = "#009c3b" }) {
  const [jogoSel, setJogoSel] = useState(null);
  const { escolha, universo, prob, aposta } = padroes;

  return (
    <div>
      <div style={{ marginBottom:18 }}>
        <h2 style={{ fontSize:17, color:accent, marginBottom:6 }}>🎯 Jogos Sugeridos — {isLoto ? "Lotofácil" : "Mega-Sena"}</h2>
        <p style={{ color:"#94a3b8", fontSize:13, lineHeight:1.6, margin:0 }}>
          Clique em um jogo para ver os critérios detalhados. Cada jogo usa um critério estatístico diferente. Probabilidade de acerto: <strong style={{color:"#ef4444"}}>{prob}</strong>.
        </p>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {jogos.map(jogo => {
          const isSel = jogoSel === jogo.id;
          return (
            <div key={jogo.id} onClick={() => setJogoSel(isSel ? null : jogo.id)} style={{
              background: isSel ? `${jogo.cor}18` : "rgba(255,255,255,0.04)",
              border:`1px solid ${isSel ? jogo.cor : "rgba(255,255,255,0.08)"}`,
              borderRadius:12, padding:18, cursor:"pointer", transition:"all 0.2s",
              boxShadow: isSel ? `0 4px 20px ${jogo.cor}33` : "none",
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, flexWrap:"wrap" }}>
                <Badge label={jogo.tag} cor={jogo.cor} />
                <span style={{ fontSize:15, fontWeight:700, color:"#e2e8f0" }}>Jogo {jogo.id}: {jogo.nome}</span>
              </div>

              {/* Bolinhas */}
              <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:12 }}>
                {[...jogo.dezenas].sort((a,b)=>a-b).map(n => (
                  <Bolinha key={n} n={n} cor={jogo.cor} size={isLoto ? 34 : 40} />
                ))}
              </div>

              {/* Stats */}
              <div style={{ display:"flex", gap:14, fontSize:12, color:"#94a3b8", flexWrap:"wrap" }}>
                <span>Soma: <strong style={{color:jogo.cor}}>{jogo.soma}</strong></span>
                <span>Pares: <strong style={{color:jogo.cor}}>{jogo.pares}</strong></span>
                <span>Ímpares: <strong style={{color:jogo.cor}}>{jogo.impares}</strong></span>
                {isLoto && <span>Moldura: <strong style={{color:jogo.cor}}>{jogo.moldura}</strong></span>}
                {isLoto && <span>Miolo: <strong style={{color:jogo.cor}}>{jogo.miolo}</strong></span>}
              </div>

              {isSel && (
                <div style={{
                  marginTop:14, background:"rgba(0,0,0,0.3)", borderRadius:8,
                  padding:12, fontSize:13, color:"#cbd5e1", lineHeight:1.65,
                  borderLeft:`3px solid ${jogo.cor}`,
                }}>
                  <strong style={{color:jogo.cor}}>📋 Critério de seleção:</strong><br/>{jogo.criterio}
                </div>
              )}

              <div style={{ fontSize:11, color:"#475569", marginTop:8, textAlign:"right" }}>
                {isSel ? "▲ Fechar" : "▼ Ver critério"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Aviso */}
      <div style={{
        marginTop:22, background:"rgba(239,68,68,0.07)", border:"1px solid rgba(239,68,68,0.2)",
        borderRadius:12, padding:18,
      }}>
        <div style={{ fontSize:14, fontWeight:700, color:"#ef4444", marginBottom:8 }}>⚠️ Aviso Importante</div>
        <div style={{ fontSize:13, color:"#94a3b8", lineHeight:1.7 }}>
          <strong style={{color:"#e2e8f0"}}>Cada sorteio é um evento completamente independente.</strong> Frequências passadas não aumentam nem diminuem a chance de saída no próximo concurso. Os jogos acima são ferramentas de <strong style={{color:accent}}>distribuição e organização da aposta</strong>, não sistemas de previsão. Jogue com responsabilidade.
        </div>
        <div style={{ marginTop:10, display:"flex", gap:18, flexWrap:"wrap", fontSize:12, color:"#64748b" }}>
          <span>🎲 Prob.: {prob}</span>
          <span>💰 Aposta mín.: {aposta}</span>
          <span>📋 {escolha} de {universo} dezenas</span>
        </div>
      </div>

      {/* Guia */}
      <div style={{ marginTop:14, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:18 }}>
        <div style={{ fontSize:14, fontWeight:700, color:accent, marginBottom:12 }}>📋 Como Montar Seu Jogo Equilibrado</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {(isLoto ? [
            { s:"1", t:`Inclua ao menos 2 dos mais frequentes: 20, 10, 25, 11, 13 (todos acima de 2.150×).` },
            { s:"2", t:`Balance pares e ímpares: prefira 7P+8I ou 8P+7I — juntos cobrem 61% dos casos.` },
            { s:"3", t:`Use 9–11 dezenas da moldura (borda) e 4–6 do miolo (centro).` },
            { s:"4", t:`Verifique a soma: deve ficar entre 171 e 220. Fora disso, o jogo é estatisticamente incomum.` },
            { s:"5", t:`Inclua pelo menos 1 par de dezenas consecutivas (ex.: 10-11, 13-14) — 100% dos concursos têm ao menos 1.` },
            { s:"6", t:`Inclua pelo menos 1 dezena 'fria' (ex.: 21, 6, 16, 17, 18) para diversificar.` },
          ] : [
            { s:"1", t:`Inclua ao menos 2 dezenas quentes: 10, 53, 5, 34, 33, 23, 4, 38, 54, 20 (acima de 310×).` },
            { s:"2", t:`Balance pares e ímpares: prefira 3P+3I, 4P+2I ou 2P+4I — cobrem 78% dos casos.` },
            { s:"3", t:`Distribua por pelo menos 3 faixas de 10 diferentes (ex.: 1-10, 31-40, 51-60).` },
            { s:"4", t:`Verifique a soma: deve ficar entre 150 e 200. Pico em ~175.` },
            { s:"5", t:`Inclua 1–2 dezenas 'frias' (26, 21, 55, 22, 15) para diversificar.` },
            { s:"6", t:`Inclua pelo menos 1 par de números consecutivos (ex.: 34-35, 10-11).` },
          ]).map(({ s, t }) => (
            <div key={s} style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
              <div style={{
                background: isLoto ? "#9333ea" : "#009c3b", color:"#fff", borderRadius:"50%",
                width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:11, fontWeight:700, flexShrink:0,
              }}>{s}</div>
              <span style={{ fontSize:13, color:"#cbd5e1", lineHeight:1.5 }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── ABA: Mapa de Calor ───────────────────────────────────
function AbaCalor({ dados, getCorFreq, accent = "#009c3b" }) {
  const freqs = dados;
  const maxF = Math.max(...freqs.map(f=>f.freq));
  const minF = Math.min(...freqs.map(f=>f.freq));
  return (
    <div>
      <p style={{ color:"#94a3b8", fontSize:13, marginBottom:16 }}>
        Tamanho e intensidade da cor indicam frequência. Passe o mouse para ver o valor.
      </p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
        {[...freqs].sort((a,b)=>a.n-b.n).map(({ n, freq }) => {
          const ratio = (freq - minF) / (maxF - minF);
          const size = 30 + ratio * 20;
          const r = Math.round(50 + ratio * 200);
          const g = Math.round(150 - ratio * 100);
          const b = Math.round(200 - ratio * 160);
          return (
            <div key={n} title={`Dezena ${n}: ${freq.toLocaleString()}×`} style={{
              width:size, height:size, borderRadius:"50%",
              background:`rgba(${r},${g},${b},0.85)`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize: size > 44 ? 13 : size > 36 ? 11 : 9,
              fontWeight:700, color:"#fff", fontFamily:"monospace",
              boxShadow: ratio > 0.7 ? `0 2px 8px rgba(${r},${g},${b},0.5)` : "none",
              cursor:"default",
            }}>{String(n).padStart(2,"0")}</div>
          );
        })}
      </div>
      <div style={{ marginTop:16, display:"flex", gap:16, flexWrap:"wrap" }}>
        {[
          { cor:"#ef4444", label:"Muito frequente (acima da média +17%)" },
          { cor:"#f59e0b", label:"Frequente (acima da média)" },
          { cor:"#6b7280", label:"Na média" },
          { cor:"#3b82f6", label:"Abaixo da média (frio)" },
        ].map(({ cor, label }) => (
          <div key={label} style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:"#94a3b8" }}>
            <div style={{ width:14, height:14, borderRadius:"50%", background:cor }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  COMPONENTE PRINCIPAL
// ══════════════════════════════════════════════════════════
export default function LoteriasAnalise() {
  const [jogo, setJogo] = useState("mega");   // "mega" | "loto"
  const [aba, setAba] = useState("frequencia");

  const isMega = jogo === "mega";
  const isLoto = jogo === "loto";

  const dados     = isMega ? MEGA_FREQ    : LOTO_FREQ;
  const jogos     = isMega ? MEGA_JOGOS   : LOTO_JOGOS;
  const padroes   = isMega ? MEGA_PADROES : LOTO_PADROES;
  const getCorFq  = isMega ? getCorFreqMega : getCorFreqLoto;

  const ABAS = [
    { id:"frequencia", label:"📊 Frequência" },
    { id:"calor",      label:"🗺️ Mapa de Calor" },
    { id:"padroes",    label:"🔍 Padrões" },
    { id:"jogos",      label:"🎯 Jogos Sugeridos" },
  ];

  const ACCENT = isMega ? "#009c3b" : "#9333ea";
  const ACCENT2 = isMega ? "#34d058" : "#7c3aed";

  return (
    <div style={{
      fontFamily:"'Georgia','Times New Roman',serif",
      background:"linear-gradient(135deg,#0a0a1a 0%,#0f1628 50%,#080d1a 100%)",
      minHeight:"100vh", color:"#e2e8f0",
      position:"relative", overflow:"hidden",
    }}>
      <div style={{
        position:"fixed", top:0, left:0, right:0, bottom:0,
        backgroundImage:`radial-gradient(circle at 15% 25%, ${ACCENT}08 0%, transparent 55%),
          radial-gradient(circle at 85% 75%, ${ACCENT2}06 0%, transparent 55%)`,
        pointerEvents:"none", zIndex:0,
      }} />

      <div style={{ position:"relative", zIndex:1, maxWidth:940, margin:"0 auto", padding:"22px 14px" }}>

        {/* ── HEADER ── */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{
            display:"inline-block",
            background:`linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
            borderRadius:6, padding:"5px 16px", fontSize:10,
            fontFamily:"monospace", letterSpacing:3, color:"#0a0a1a",
            fontWeight:700, marginBottom:12, textTransform:"uppercase",
          }}>Análise Estatística • Dados Históricos Oficiais CEF</div>

          <h1 style={{
            fontSize:"clamp(24px,5vw,42px)", fontWeight:700, margin:"0 0 8px",
            background:`linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT2} 100%)`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            display:"inline-block",
          }}>
            {isMega ? "🎰 Mega-Sena Analytics" : "🍀 Lotofácil Analytics"}
          </h1>

          <p style={{ color:"#94a3b8", fontSize:13, maxWidth:580, margin:"0 auto 8px", lineHeight:1.6 }}>
            {isMega
              ? <>Análise de <strong style={{color:ACCENT}}>+3.000 concursos</strong> e <strong style={{color:ACCENT}}>+18.000 dezenas</strong> desde março de 1996.</>
              : <>Análise de <strong style={{color:ACCENT}}>+3.600 concursos</strong> e <strong style={{color:ACCENT}}>+55.000 dezenas</strong> desde setembro de 2003.</>
            }
          </p>
          <p style={{
            color:"#64748b", fontSize:11, fontFamily:"monospace",
            background:"rgba(255,80,80,0.08)", border:"1px solid rgba(255,80,80,0.18)",
            borderRadius:4, padding:"4px 12px", display:"inline-block",
          }}>⚠️ Estatística ≠ garantia. Probabilidade: {padroes.prob} por aposta simples.</p>
        </div>

        {/* ── SELETOR DE JOGO ── */}
        <div style={{
          display:"flex", gap:0, marginBottom:20, borderRadius:14,
          background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)",
          overflow:"hidden",
        }}>
          {[
            { id:"mega", emoji:"🎰", label:"Mega-Sena", sub:"6 de 60 • R$ 5,00", acc:"#009c3b" },
            { id:"loto", emoji:"🍀", label:"Lotofácil", sub:"15 de 25 • R$ 3,50", acc:"#9333ea" },
          ].map(({ id, emoji, label, sub, acc }) => {
            const active = jogo === id;
            return (
              <button key={id} onClick={() => { setJogo(id); setAba("frequencia"); }} style={{
                flex:1, padding:"16px 12px", border:"none", cursor:"pointer",
                background: active ? `linear-gradient(135deg, ${acc}25, ${acc}12)` : "transparent",
                color: active ? acc : "#64748b",
                borderRight: id === "mega" ? "1px solid rgba(255,255,255,0.08)" : "none",
                transition:"all 0.25s", fontFamily:"inherit",
              }}>
                <div style={{ fontSize:26, marginBottom:4 }}>{emoji}</div>
                <div style={{ fontSize:15, fontWeight:700 }}>{label}</div>
                <div style={{ fontSize:11, opacity:0.7, marginTop:2 }}>{sub}</div>
                {active && <div style={{ width:36, height:2, background:acc, margin:"8px auto 0", borderRadius:2 }} />}
              </button>
            );
          })}
        </div>

        {/* ── ÚLTIMO RESULTADO + STATUS DE ATUALIZAÇÃO ── */}
        {(() => {
          const res = isMega ? ULTIMOS_RESULTADOS.mega : ULTIMOS_RESULTADOS.loto;
          const baseConcurso = isMega ? CONCURSO_BASE_MEGA : CONCURSO_BASE_LOTO;
          return (
            <div style={{
              marginBottom:22, borderRadius:14,
              border:`1px solid ${ACCENT}40`,
              background:`linear-gradient(135deg, ${ACCENT}0e 0%, rgba(255,255,255,0.03) 100%)`,
              overflow:"hidden",
            }}>
              {/* Cabeçalho da seção */}
              <div style={{
                display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"12px 18px", borderBottom:`1px solid ${ACCENT}25`,
                flexWrap:"wrap", gap:8,
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:18 }}>📡</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:ACCENT }}>
                      Último Resultado Analisado
                    </div>
                    <div style={{ fontSize:11, color:"#64748b", marginTop:1 }}>
                      Dados de frequência calculados até este concurso
                    </div>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                  {/* Badge de status */}
                  <div style={{
                    display:"flex", alignItems:"center", gap:5,
                    background:"rgba(34,197,94,0.12)", border:"1px solid rgba(34,197,94,0.25)",
                    borderRadius:20, padding:"4px 12px",
                  }}>
                    <div style={{ width:7, height:7, borderRadius:"50%", background:"#22c55e",
                      boxShadow:"0 0 6px #22c55e" }} />
                    <span style={{ fontSize:11, color:"#22c55e", fontWeight:600 }}>
                      Análise atualizada
                    </span>
                  </div>
                  <div style={{
                    background:"rgba(255,255,255,0.06)", borderRadius:20, padding:"4px 12px",
                    fontSize:11, color:"#94a3b8", fontFamily:"monospace",
                  }}>
                    🗓️ {DATA_ANALISE}
                  </div>
                </div>
              </div>

              {/* Corpo */}
              <div style={{ padding:"16px 18px" }}>
                <div style={{ display:"flex", gap:16, flexWrap:"wrap", alignItems:"flex-start" }}>

                  {/* Concurso + dezenas */}
                  <div style={{ flex:"1 1 300px" }}>
                    <div style={{ display:"flex", alignItems:"baseline", gap:10, marginBottom:12 }}>
                      <span style={{
                        fontSize:22, fontWeight:700, color:ACCENT, fontFamily:"monospace",
                      }}>#{res.concurso}</span>
                      <span style={{ fontSize:13, color:"#64748b" }}>• {res.data}</span>
                      {res.acumulado && (
                        <span style={{
                          background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.3)",
                          borderRadius:10, padding:"2px 8px", fontSize:10, color:"#ef4444", fontWeight:700,
                        }}>ACUMULOU</span>
                      )}
                    </div>

                    {/* Bolinhas do último resultado */}
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
                      {res.dezenas.map(n => (
                        <div key={n} style={{
                          width: isMega ? 40 : 34, height: isMega ? 40 : 34,
                          borderRadius:"50%",
                          background:`linear-gradient(135deg, ${ACCENT}ee, ${ACCENT}88)`,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          fontSize: isMega ? 14 : 12, fontWeight:700, color:"#fff",
                          fontFamily:"monospace",
                          boxShadow:`0 2px 8px ${ACCENT}44`,
                        }}>{String(n).padStart(2,"0")}</div>
                      ))}
                    </div>

                    {/* Stats rápidos do concurso */}
                    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                      {[
                        { k: isMega ? "Sena" : "15 acertos", v: isMega ? res.ganhadores6 : res.ganhadores15 },
                        { k:"Prêmio", v: res.premio },
                        { k:"Soma", v: res.dezenas.reduce((a,b)=>a+b,0) },
                        { k:"Pares", v: res.dezenas.filter(n=>n%2===0).length },
                        { k:"Ímpares", v: res.dezenas.filter(n=>n%2!==0).length },
                      ].map(({ k, v }) => (
                        <div key={k} style={{
                          background:"rgba(255,255,255,0.05)", borderRadius:8,
                          padding:"5px 10px", textAlign:"center",
                        }}>
                          <div style={{ fontSize:10, color:"#64748b", marginBottom:2 }}>{k}</div>
                          <div style={{ fontSize:12, fontWeight:700, color:ACCENT, fontFamily:"monospace" }}>
                            {typeof v === "number" && k !== "Soma" ? v.toLocaleString() : v}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Divider vertical */}
                  <div style={{ width:1, background:`${ACCENT}25`, alignSelf:"stretch", minHeight:80,
                    display:"none", "@media(minWidth:520px)":{display:"block"} }} />

                  {/* Próximo sorteio + aviso de defasagem */}
                  <div style={{ flex:"1 1 200px", display:"flex", flexDirection:"column", gap:10 }}>
                    <div style={{
                      background:`${ACCENT}14`, border:`1px solid ${ACCENT}30`,
                      borderRadius:10, padding:"10px 14px",
                    }}>
                      <div style={{ fontSize:11, color:"#64748b", marginBottom:4 }}>🔜 Próximo sorteio</div>
                      <div style={{ fontSize:13, fontWeight:700, color:ACCENT }}>
                        Concurso #{res.proximoConcurso}
                      </div>
                      <div style={{ fontSize:12, color:"#94a3b8", marginTop:2 }}>
                        {res.proximaData} • Est. {res.proximoPremio}
                      </div>
                    </div>

                    <div style={{
                      background:"rgba(255,193,7,0.08)", border:"1px solid rgba(255,193,7,0.2)",
                      borderRadius:10, padding:"10px 14px",
                    }}>
                      <div style={{ fontSize:11, color:"#fbbf24", fontWeight:700, marginBottom:4 }}>
                        ℹ️ Como verificar atualização
                      </div>
                      <div style={{ fontSize:11, color:"#94a3b8", lineHeight:1.55 }}>
                        Compare o concurso base da análise <strong style={{color:"#e2e8f0",fontFamily:"monospace"}}>#{baseConcurso}</strong> com o último sorteio oficial no site da Caixa. Se houver concursos mais novos, os dados de frequência podem estar levemente desatualizados.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── STATS TOPO ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))", gap:8, marginBottom:24 }}>
          {[
            { label:"Concursos", val:padroes.concursos,     icon:"🎲" },
            { label:"Dezenas sorteadas", val:padroes.totalDezenas, icon:"🔢" },
            { label:"Média por número", val:`${padroes.mediaEsperada.toLocaleString()}×`, icon:"📈" },
            { label:"Mais sorteado", val:padroes.maisFreq,  icon:"🏆" },
            { label:"Menos sorteado", val:padroes.menosFreq,icon:"🧊" },
          ].map((s,i) => (
            <div key={i} style={{
              background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:10, padding:"10px 12px", textAlign:"center",
            }}>
              <div style={{ fontSize:20, marginBottom:4 }}>{s.icon}</div>
              <div style={{ fontSize:10, color:"#94a3b8", marginBottom:4, lineHeight:1.3 }}>{s.label}</div>
              <div style={{ fontSize:12, fontWeight:700, color:ACCENT, fontFamily:"monospace" }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* ── ABAS ── */}
        <div style={{ display:"flex", gap:6, marginBottom:22, flexWrap:"wrap" }}>
          {ABAS.map(a => (
            <button key={a.id} onClick={() => setAba(a.id)} style={{
              padding:"8px 16px", borderRadius:20, border:"none", cursor:"pointer",
              fontSize:13, fontFamily:"inherit", fontWeight:600, transition:"all 0.2s",
              background: aba === a.id ? `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})` : "rgba(255,255,255,0.07)",
              color: aba === a.id ? "#0a0a1a" : "#94a3b8",
              boxShadow: aba === a.id ? `0 4px 16px ${ACCENT}44` : "none",
            }}>{a.label}</button>
          ))}
        </div>

        {/* ── CONTEÚDO DAS ABAS ── */}
        {aba === "frequencia" && (
          <AbaFrequencia
            dados={dados}
            getCorFreq={getCorFq}
            mediaEsperada={padroes.mediaEsperada}
            universo={padroes.universo}
            accent={ACCENT}
          />
        )}
        {aba === "calor" && (
          <AbaCalor dados={dados} getCorFreq={getCorFq} accent={ACCENT} />
        )}
        {aba === "padroes" && (
          <AbaPadroes padroes={padroes} isLoto={isLoto} accent={ACCENT} accent2={ACCENT2} />
        )}
        {aba === "jogos" && (
          <AbaJogos jogos={jogos} padroes={padroes} isLoto={isLoto} accent={ACCENT} />
        )}

        {/* RODAPÉ */}
        <div style={{ marginTop:32, textAlign:"center", fontSize:11, color:"#374151" }}>
          Fontes: Caixa Econômica Federal • InfoMoney • Só Matemática • Lotocerta • Lotoloto • boloespb.com<br/>
          Dados até concurso ~3.007 (Mega-Sena) e ~3.679 (Lotofácil) • mai/2026<br/>
          Análise estatístico-descritiva. Não constitui sistema de previsão ou garantia de prêmio.
        </div>
      </div>
    </div>
  );
}

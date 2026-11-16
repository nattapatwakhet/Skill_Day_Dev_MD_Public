import ForceGraph3D from "3d-force-graph";
import * as THREE from "three";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

const GROUP_COLOR = {
  root: "#7fd6ff",
  memory: "#ffb37f",
  reference: "#b98bff",
};

const rightPanelContentEl = document.getElementById("right-panel-content");
const hubListEl = document.getElementById("hub-list");
const hubListLabelEl = document.getElementById("hub-list-label");
const statsBoxEl = document.getElementById("stats-box");
const searchInputEl = document.getElementById("search-input");
const groupRows = [...document.querySelectorAll(".group-row")];
const viewModeRadios = [...document.querySelectorAll('input[name="view-mode"]')];
const viewModeNoteEl = document.getElementById("view-mode-note");
const agentFilterSectionEl = document.getElementById("agent-filter-section");
const agentFilterRadios = [...document.querySelectorAll('input[name="agent-filter"]')];
const usageFreshnessEl = document.getElementById("usage-freshness");
const usageUnderlinkedEl = document.getElementById("usage-underlinked");
const usageOverlinkedEl = document.getElementById("usage-overlinked");
const usageOrphanedEl = document.getElementById("usage-orphaned");
const btnFitEl = document.getElementById("btn-fit");
const btnRearrangeEl = document.getElementById("btn-rearrange");
const toggleOnlyLinkedEl = document.getElementById("toggle-only-linked");
const linkStrengthSliderEl = document.getElementById("link-strength-slider");
const linkStrengthValueEl = document.getElementById("link-strength-value");

// สเกลสี "ใช้งานจริง" — 0 ครั้ง = เทาหม่น, ยิ่งเปิดบ่อย ยิ่งขยับไปทางส้ม/แดงสว่าง
// เดิมไล่สีแบบผสม RGB ตรงๆ (cyan → coral) ปัญหาจริงที่เจอ: ช่วงกลางของการผสมแบบนี้ได้สีหม่นๆ อมเทา
// (เช่น rgb(168,181,204)) ซึ่งพอโดนแสงมีทิศทาง (node sphere ใช้ material แบบมีแสง) ด้านที่ไม่โดนแสงจะกลาย
// เป็นเกือบดำสนิท — ต่างจาก GROUP_COLOR ที่อิ่มสีเต็มที่ (cyan/orange/purple) เลยยังเห็นเป็นสีได้แม้โดนเงา
// แก้โดยไล่สีใน HSL แทน (คุม saturation/lightness ให้สูงคงที่ตลอด แค่ขยับ hue) สีจะสดตลอดช่วง ไม่มีโซนหม่น
function renderRightPanel(node, neighborIds, allNodesById) {
  rightPanelContentEl.replaceChildren();
  rightPanelContentEl.classList.remove("empty");

  const h2 = document.createElement("h2");
  h2.textContent = node.name;
  const meta = document.createElement("div");
  meta.className = "meta";
  meta.textContent =
    `${node.id} · กลุ่ม ${node.group} · ${node.lineCount} บรรทัด · ` +
    `ถูกอ้างถึง ${node.inDegree} ครั้ง · เปิดใช้จริง ${node.realUsage || 0} ครั้ง ` +
    `(Claude ${node.realUsageClaude || 0} · Codex ${node.realUsageCodex || 0})`;
  rightPanelContentEl.append(h2, meta);

  if (neighborIds.size === 0) {
    const p = document.createElement("div");
    p.className = "empty";
    p.textContent = "ไม่มีลิงก์เข้า/ออกที่ตรวจพบ";
    rightPanelContentEl.appendChild(p);
    return;
  }

  const label = document.createElement("div");
  label.style.marginBottom = "4px";
  label.style.color = "#9fd8ff";
  label.textContent = `เชื่อมกับ ${neighborIds.size} ไฟล์:`;
  rightPanelContentEl.appendChild(label);

  const ul = document.createElement("ul");
  ul.className = "neighbor-list";
  for (const id of neighborIds) {
    const li = document.createElement("li");
    li.textContent = allNodesById.get(id)?.name || id;
    ul.appendChild(li);
  }
  rightPanelContentEl.appendChild(ul);
}

function renderHubList(nodes, mode, usageOf) {
  hubListEl.replaceChildren();
  const metricFn = mode === "usage" ? usageOf : (node) => node.inDegree;
  hubListLabelEl.textContent =
    mode === "usage" ? "ไฟล์ที่เปิดใช้จริงมากสุด" : "ไฟล์ที่ถูกอ้างถึงมากสุด";
  const top = [...nodes].sort((a, b) => metricFn(b) - metricFn(a)).slice(0, 10);
  for (const node of top) {
    const li = document.createElement("li");
    const nameSpan = document.createElement("span");
    nameSpan.className = "name";
    nameSpan.textContent = node.name;
    const countSpan = document.createElement("span");
    countSpan.className = "n";
    countSpan.textContent = String(metricFn(node));
    li.append(nameSpan, countSpan);
    li.dataset.nodeId = node.id;
    hubListEl.appendChild(li);
  }
}

// พอร์ตตรรกะเดียวกับ scripts/analyze_skill_usage.py มาไว้ในเว็บ — รายงานอย่างเดียว ไม่แก้ routing เอง
function renderUsageList(el, rows, metricLabel) {
  el.replaceChildren();
  if (rows.length === 0) {
    const li = document.createElement("li");
    li.className = "empty-row";
    li.textContent = "(ยังไม่เจอ)";
    el.appendChild(li);
    return;
  }
  for (const node of rows.slice(0, 8)) {
    const li = document.createElement("li");
    const nameSpan = document.createElement("span");
    nameSpan.className = "name";
    nameSpan.textContent = node.name;
    const countSpan = document.createElement("span");
    countSpan.className = "n";
    countSpan.textContent = metricLabel(node);
    li.append(nameSpan, countSpan);
    li.dataset.nodeId = node.id;
    el.appendChild(li);
  }
}

function renderUsageReport(nodes, usageMeta) {
  if (usageMeta.totalEntries === 0) {
    usageFreshnessEl.classList.add("warn");
    usageFreshnessEl.textContent =
      "ยังไม่มีข้อมูลการใช้งานจริง (usage log เป็น optional และต้องตั้งค่า importer/hook เอง)";
  } else if (usageMeta.spanDays < usageMeta.minDaysRecommended) {
    usageFreshnessEl.classList.add("warn");
    usageFreshnessEl.textContent =
      `เก็บข้อมูลมาแค่ ${usageMeta.spanDays} วัน (แนะนำ ≥${usageMeta.minDaysRecommended} วัน) ` +
      `ผลด้านล่างยังไม่น่าเชื่อถือพอตัดสินใจปรับ routing จริง`;
  } else {
    usageFreshnessEl.classList.remove("warn");
    usageFreshnessEl.textContent = `ข้อมูล ${usageMeta.spanDays} วัน (${usageMeta.totalEntries} ครั้ง) — มากพอเริ่มพิจารณาได้`;
  }
  // แยกแหล่ง agent เพื่อให้ importer หลายชนิดรวมข้อมูลได้โดยยังเห็น provenance
  if (usageMeta.byAgent) {
    const byAgentEl = document.createElement("div");
    byAgentEl.style.marginTop = "4px";
    byAgentEl.style.fontSize = "10px";
    byAgentEl.textContent =
      `แยกตาม agent: Claude ${usageMeta.byAgent.claude.totalEntries} ครั้ง (hook สด) · ` +
      `Codex ${usageMeta.byAgent.codex.totalEntries} ครั้ง (sync ย้อนหลัง — รัน scripts/sync_codex_usage.py เอง)`;
    usageFreshnessEl.appendChild(byAgentEl);
  }

  const underlinked = nodes
    .filter((n) => n.realUsage >= 3 && n.inDegree <= 2)
    .sort((a, b) => b.realUsage - a.realUsage);
  const overlinked = nodes
    .filter((n) => n.inDegree >= 8 && n.realUsage <= 1)
    .sort((a, b) => b.inDegree - a.inDegree);
  const orphaned = nodes.filter((n) => n.realUsage === 0 && n.inDegree === 0);

  renderUsageList(usageUnderlinkedEl, underlinked, (n) => `${n.realUsage}× / deg ${n.inDegree}`);
  renderUsageList(usageOverlinkedEl, overlinked, (n) => `deg ${n.inDegree} / ${n.realUsage}×`);
  renderUsageList(usageOrphanedEl, orphaned, () => "0");
}

function renderStatsBox(data) {
  statsBoxEl.replaceChildren();
  const countLine = document.createElement("div");
  const nodeCountEl = document.createElement("b");
  nodeCountEl.textContent = String(data.nodeCount);
  const linkCountEl = document.createElement("b");
  linkCountEl.textContent = String(data.linkCount);
  countLine.append(nodeCountEl, " ไฟล์ · ", linkCountEl, " ลิงก์");
  const generatedLine = document.createElement("div");
  generatedLine.style.marginTop = "4px";
  generatedLine.textContent = `สร้างเมื่อ ${new Date(data.generatedAt).toLocaleString("th-TH")}`;
  statsBoxEl.append(countLine, generatedLine);
}

async function main() {
  const res = await fetch("/graph-data.json", { cache: "no-store" });
  const data = await res.json();
  const nodesById = new Map(data.nodes.map((n) => [n.id, n]));

  // สุ่ม speed/จำนวน/ขนาดอนุภาควิ่งบนเส้นลิงก์ "ต่อเส้น" ครั้งเดียวตอนโหลด (ไม่ใช่สุ่มใหม่ทุกเฟรม) —
  // เดิมทุกเส้นใช้ speed เดียวกันหมด ทำให้อนุภาควิ่งพร้อมกันเป๊ะดูตายตัว สุ่ม speed ต่างกันเล็กน้อยต่อเส้น
  // จะไล่ไม่ตรงกันไปเรื่อยๆ เองตามธรรมชาติ ดูมีชีวิตขึ้น ไม่ต้องเขียน phase offset เพิ่ม
  for (const link of data.links) {
    link.__particleSpeed = 0.0016 + Math.random() * 0.004;
    link.__particleCount = Math.random() < 0.55 ? 1 : 2;
    link.__particleWidth = 0.55 + Math.random() * 0.5;
  }

  for (const group of ["root", "memory", "reference"]) {
    document.getElementById(`count-${group}`).textContent = String(
      data.nodes.filter((n) => n.group === group).length
    );
  }
  const usageMeta = data.usage || { totalEntries: 0, spanDays: 0, minDaysRecommended: 14 };
  const maxInDegree = Math.max(0, ...data.nodes.map((n) => n.inDegree || 0));
  let viewMode = "structural";
  // เลือกได้ว่าจะนับ realUsage จาก agent ไหน (ทั้งหมด/เฉพาะ Claude/เฉพาะ Codex) — ตามที่ user ขอ
  // "ไม่เห็นมีเมนูให้เลือก" ต่อจากที่เพิ่มข้อมูล Codex เข้ามา
  let agentFilter = "all";
  function usageOf(node) {
    if (agentFilter === "claude") return node.realUsageClaude || 0;
    if (agentFilter === "codex") return node.realUsageCodex || 0;
    return node.realUsage || 0;
  }
  function currentMaxUsage() {
    return Math.max(0, ...data.nodes.map((n) => usageOf(n)));
  }

  // จำนวนเส้นที่แตะ node แต่ละตัว (ทั้งเข้า+ออก) — ใช้กับ toggle "เฉพาะไฟล์ที่มีเส้นเชื่อม"
  const totalLinkCount = new Map(data.nodes.map((n) => [n.id, 0]));
  for (const link of data.links) {
    const sourceId = typeof link.source === "object" ? link.source.id : link.source;
    const targetId = typeof link.target === "object" ? link.target.id : link.target;
    totalLinkCount.set(sourceId, (totalLinkCount.get(sourceId) || 0) + 1);
    totalLinkCount.set(targetId, (totalLinkCount.get(targetId) || 0) + 1);
  }
  // "ความสำคัญของเส้น" ไม่มีค่าน้ำหนักจริงต่อเส้น (แค่มี/ไม่มีลิงก์) — ใช้ค่าเฉลี่ย in-degree ของปลายทั้งสอง
  // แทน เป็น proxy ว่าเส้นนี้เชื่อมไฟล์ "สำคัญ" แค่ไหน ใช้กรองผ่าน slider ได้สมเหตุสมผลกว่าไม่มีอะไรเลย
  function linkStrength(link) {
    const s = typeof link.source === "object" ? link.source : nodesById.get(link.source);
    const t = typeof link.target === "object" ? link.target : nodesById.get(link.target);
    return ((s?.inDegree || 0) + (t?.inDegree || 0)) / 2;
  }
  linkStrengthSliderEl.max = String(Math.max(1, maxInDegree));
  let linkStrengthThreshold = 0;
  let onlyLinked = false;

  renderStatsBox(data);
  renderHubList(data.nodes, viewMode, usageOf);
  renderUsageReport(data.nodes, usageMeta);

  // ความสำคัญของ node (0..1) — structural ใช้ in-degree, usage ใช้จำนวนครั้งที่เปิดจริง, sqrt scale ให้
  // node ระดับกลางยังมีน้ำหนักพอสมควร ไม่จางฮวบทันทีที่หลุดจาก top hub
  function importanceT(node) {
    const raw =
      viewMode === "usage" ? usageOf(node) / (currentMaxUsage() || 1) : (node.inDegree || 0) / (maxInDegree || 1);
    return Math.sqrt(Math.max(0, raw));
  }

  function parseColorToRgb(colorStr) {
    if (colorStr.startsWith("#")) {
      const hex = colorStr.slice(1);
      return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
    }
    const m = colorStr.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    return m ? [+m[1], +m[2], +m[3]] : [255, 255, 255];
  }

  // ลองใช้ nodeOpacity ไล่ระดับตรงๆ ก่อน แต่ node sphere ของ 3d-force-graph ใช้แสง (Lambert) เมื่อ opacity
  // ต่ำจะเห็นเหลี่ยม low-poly มืดทึบแทนที่จะเป็น "แสงจาง" อย่างที่ตั้งใจ — เปลี่ยนมาไล่ระดับที่ "ความสว่างของสี"
  // แทน (คูณ RGB เข้าหาสีมืด) ให้ตัวกลม opacity คงที่สูงเหมือนเดิม (เต็มดวงเหมือนก่อนหน้า) แต่ความสว่างจริงต่าง
  // กันตามความสำคัญ ค่านี้ยังกำหนดว่า node ไหนจะโดน bloom effect เด่นด้วย (bloom ทำงานจาก luminance)
  function darkenByImportance(colorStr, t) {
    const [r, g, b] = parseColorToRgb(colorStr);
    const floor = 0.22; // กันไม่ให้ node สำคัญน้อยสุดมืดจนมองไม่เห็นเลย
    const k = floor + t * (1 - floor);
    return `rgb(${Math.round(r * k)}, ${Math.round(g * k)}, ${Math.round(b * k)})`;
  }

  // node ที่กำลังชี้/hover อยู่ — เรืองแสงสีแดงเด่นชัด แทนที่สีตามความสำคัญปกติไปเลย ให้รู้ทันทีว่ากำลังชี้
  // ตัวไหนอยู่ (แยกจาก highlightLinks ที่ไฮไลต์เฉพาะ "เส้น" ที่ต่อกับ node นี้)
  let hoverNode = null;

  // สีตาม agent ที่เปิดไฟล์จริง — Claude = เหลือง, Codex = เขียว ถ้าทั้งคู่เปิด (โหมด "ทั้งหมด") ผสมสัดส่วน
  // ตามจำนวนครั้งจริงของแต่ละฝั่ง — สว่าง/หม่นตาม importance เหมือนเดิม (floor 0.4 กันมืดสนิท)
  const CLAUDE_COLOR = [255, 209, 77]; // เหลือง
  const CODEX_COLOR = [70, 220, 130]; // เขียว
  function agentUsageColor(node) {
    const claude = node.realUsageClaude || 0;
    const codex = node.realUsageCodex || 0;
    let base;
    if (agentFilter === "claude") {
      base = CLAUDE_COLOR;
    } else if (agentFilter === "codex") {
      base = CODEX_COLOR;
    } else {
      const total = claude + codex;
      if (total === 0) return "#5d7286";
      const claudeRatio = claude / total;
      base = CLAUDE_COLOR.map((c, i) => c * claudeRatio + CODEX_COLOR[i] * (1 - claudeRatio));
    }
    const t = importanceT(node);
    const floor = 0.4;
    const k = floor + t * (1 - floor);
    const rgb = base.map((c) => Math.round(c * k));
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  }

  function nodeColorFn(node) {
    if (node === hoverNode) return "#ff2d2d";
    if (viewMode === "usage") return agentUsageColor(node);
    return darkenByImportance(GROUP_COLOR[node.group] || "#ffffff", importanceT(node));
  }
  function nodeValFn(node) {
    // floor 1.5 (เดิม 0.6) — node ใช้น้อย/ไม่เคยใช้ในโหมด usage เล็กเกินไปจน bloom แทบไม่เกาะ ดูเหมือนดับ
    return viewMode === "usage" ? 1.5 + Math.sqrt(1 + usageOf(node)) * 0.9 : 0.6 + Math.sqrt(node.val) * 0.9;
  }

  // ไฮไลต์เส้นลิงก์ที่ต่อกับ node ที่ hover อยู่ — ให้เห็นชัดว่า "เชื่อมกับอะไรบ้าง" จริงๆ ไม่ใช่แค่เดาจาก
  // เส้นบางๆ ปนกันทั้งจอ (นี่คือส่วน "จัดการเชื่อมโยงให้ดีๆ" — เดิมมีแค่ list ในแผงขวาตอนคลิก ไม่มี hover เลย)
  const highlightLinks = new Set();

  function linkColorFn(link) {
    return highlightLinks.has(link) ? "rgba(255,255,255,0.95)" : "rgba(140,200,255,0.22)";
  }
  function linkWidthFn(link) {
    return highlightLinks.has(link) ? 1.3 : 0.18;
  }
  function linkParticleCountFn(link) {
    return highlightLinks.has(link) ? Math.max(2, link.__particleCount) : link.__particleCount;
  }

  // node ใช้ custom object แบบ unlit (MeshBasicMaterial) แทน default ของ 3d-force-graph (MeshLambertMaterial
  // มีแสง) — เจอบั๊กจริงที่แก้ไม่ตกด้วยการปรับสี/ขนาด/composer แล้ว (node สีถูกต้องตาม material.color ทุกครั้ง
  // ที่ตรวจสอบ แต่ยังเรนเดอร์ออกมามืดในโหมด usage ที่สีหลากหลายไม่ใช่สีอิ่มตัวคงที่แบบ GROUP_COLOR) — unlit
  // material ไม่ขึ้นกับแสง/มุมกล้องเลย รับประกันว่าสีที่เห็นตรงกับสีที่ตั้งไว้เป๊ะทุกครั้ง
  const nodeMeshMap = new Map(); // id -> THREE.Mesh (เก็บไว้ให้ refreshNodeVisuals() อัปเดตสี/ขนาดทีหลังได้)
  // รัศมี = สูตรเดียวกับที่ 3d-force-graph ใช้เองภายใน (Math.cbrt(val) * nodeRelSize, nodeRelSize default 4)
  // ให้ขนาดลูกกลมตรงกับของเดิมเป๊ะ — รอบก่อนคิดสูตรเองใหม่ (sqrt แทน cbrt, ค่าคงที่ไม่ตรง) ทำให้ลูกกลมเล็กลง
  // กว่าที่ user คุ้นตา แม้สีจะถูกต้องแล้วก็ตาม
  const NODE_REL_SIZE = 4;
  function nodeRadius(node) {
    return Math.cbrt(Math.max(0.001, nodeValFn(node))) * NODE_REL_SIZE;
  }
  function makeNodeObject(node) {
    const geometry = new THREE.SphereGeometry(nodeRadius(node), 8, 8);
    const material = new THREE.MeshBasicMaterial({
      color: nodeColorFn(node),
      transparent: true,
      opacity: 0.95,
    });
    const mesh = new THREE.Mesh(geometry, material);
    nodeMeshMap.set(node.id, mesh);
    return mesh;
  }
  function refreshNodeVisuals() {
    for (const [id, mesh] of nodeMeshMap) {
      const node = nodesById.get(id);
      if (!node) continue;
      mesh.material.color.set(nodeColorFn(node));
      mesh.geometry.dispose();
      mesh.geometry = new THREE.SphereGeometry(nodeRadius(node), 8, 8);
    }
  }

  const Graph = new ForceGraph3D(document.getElementById("app"))
    .graphData(data)
    // เดิมลองทำ canvas โปร่งใสให้ภาพพื้นหลังทะลุขึ้นมา แต่ postprocessing composer (bloom) เขียน alpha
    // ทึบเสมอ transparency ไม่เห็นผลจริง — เปลี่ยนไปวางรูปเป็น DOM layer ทับด้วย mix-blend-mode:screen
    // แทน (ดู #bg-photo ใน index.html) เลยกลับมาใช้พื้นทึบตามเดิม
    .backgroundColor("#02050a")
    .nodeId("id")
    .nodeLabel(
      (node) =>
        `${node.name}\n${node.id}\nถูกอ้างถึง ${node.inDegree} · เปิดจริง ${node.realUsage || 0} ` +
        `(Claude ${node.realUsageClaude || 0} / Codex ${node.realUsageCodex || 0})`
    )
    .nodeThreeObject(makeNodeObject)
    .nodeThreeObjectExtend(false)
    .linkColor(linkColorFn)
    .linkWidth(linkWidthFn)
    .linkOpacity(0.65)
    .linkCurvature(0.08)
    .linkDirectionalParticles(linkParticleCountFn)
    .linkDirectionalParticleWidth((link) => link.__particleWidth)
    .linkDirectionalParticleSpeed((link) => link.__particleSpeed)
    .onNodeHover((node) => {
      hoverNode = node || null;
      highlightLinks.clear();
      if (node) {
        for (const link of data.links) {
          const sourceId = typeof link.source === "object" ? link.source.id : link.source;
          const targetId = typeof link.target === "object" ? link.target.id : link.target;
          if (sourceId === node.id || targetId === node.id) highlightLinks.add(link);
        }
      }
      refreshNodeVisuals();
      Graph.linkColor(linkColorFn).linkWidth(linkWidthFn).linkDirectionalParticles(linkParticleCountFn);
    })
    .onNodeClick((node) => {
      const distance = 55;
      const distRatio = 1 + distance / Math.hypot(node.x || 1, node.y || 1, node.z || 1);
      Graph.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
        node,
        1000
      );

      const neighborIds = new Set();
      for (const link of data.links) {
        const sourceId = typeof link.source === "object" ? link.source.id : link.source;
        const targetId = typeof link.target === "object" ? link.target.id : link.target;
        if (sourceId === node.id) neighborIds.add(targetId);
        if (targetId === node.id) neighborIds.add(sourceId);
      }
      renderRightPanel(node, neighborIds, nodesById);
    });

  Graph.d3Force("charge").strength(-70);
  Graph.d3Force("link").distance(30);
  // เจอบั๊กจริงระหว่างทดสอบ toolbar ใหม่ (ไม่เกี่ยวกับ toolbar เอง): กราฟนี้ลิงก์หนาแน่นมาก ถ้าปล่อยให้
  // simulation รันไปเรื่อยๆ ไม่ตัด จะยุบตัวเองเป็นก้อนบีบอัดแน่นมาก (bbox รัศมี ~7) หลังผ่านไปสัก 5-10+ วินาที
  // ไม่ว่าจะ interact อะไรหรือไม่ก็ตาม — พอ node ทับกันขนาดนั้น แสงที่มีทิศทาง (Lambert-like material) ทำให้
  // ดูเป็นก้อนมืดแทนจุดเรืองแสง จำกัด cooldownTicks ให้ simulation หยุดเร็วขึ้น ก่อนที่จะยุบไปถึงจุดนั้น
  Graph.cooldownTicks(90);
  Graph.cameraPosition({ z: 460 });

  // ===== glow/bloom เพื่อให้ดูเป็นก้อนแสงฟุ้งแบบภาพต้นแบบ ไม่ใช่ลูกบอลทึบ =====
  // เจอบั๊กจริง (สาเหตุแท้จริงของ "node สีดำ" ที่ user แจ้ง — ไม่ใช่เรื่องสี/แสงเลย): เดิมสร้าง EffectComposer
  // ของตัวเองแยกไว้เฉยๆ (ไม่เคยเรียก .render() เลย เป็น dead code) แล้วไป addPass(bloomPass) ใส่
  // Graph.postProcessingComposer() ตรงๆ โดยไม่ปรับ renderToScreen — RenderPass เดิมของ Graph (pass แรก) ยัง
  // เหลือ renderToScreen=true ค้างอยู่ทั้งที่ไม่ใช่ pass สุดท้ายแล้ว ส่วน bloomPass (pass สุดท้ายจริง) กลับมี
  // renderToScreen=false — ทำให้ pipeline render พังครึ่งๆ กลางๆ, สีจริงของ node ถูกต้องทุกจุด (ตรวจแล้วผ่าน
  // material.color ตรงๆ) แต่สิ่งที่ขึ้นจอจริงเพี้ยนไปเพราะ pass สุดท้ายไม่ได้ถูกวาดลงจอ — แก้โดยตั้ง
  // renderToScreen ให้ถูกต้อง: RenderPass เดิม false, bloomPass (pass สุดท้ายจริง) true
  // ลดลงจากเดิม (1.15/0.85/0.12) — พอเปลี่ยน node เป็น unlit material (MeshBasicMaterial) แล้วสีเรืองสม่ำเสมอ
  // ขึ้นจริงทุกจุด bloom เดิมที่ตั้งไว้แรงเพื่อชดเชยตอน node ยังมืดๆ (ก่อนแก้บั๊ก) เลยกลายเป็นแรงเกินไป จนกลุ่ม
  // ตรงกลางที่ node ทับกันหนาแน่นสว่างจ้าจนแยกสีไม่ออก (user แจ้งว่า "สว่างเกิน")
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.65, // strength
    0.7, // radius
    0.22 // threshold — สูงขึ้น ให้เฉพาะจุดที่สว่างจริงๆ เรืองแสง ไม่ใช่ทุกจุด
  );
  const ppComposer = Graph.postProcessingComposer();
  for (const pass of ppComposer.passes) pass.renderToScreen = false;
  ppComposer.addPass(bloomPass);
  bloomPass.renderToScreen = true;

  function focusNodeById(id) {
    const node = nodesById.get(id);
    if (!node) return;
    Graph.onNodeClick()(node);
  }

  hubListEl.addEventListener("click", (e) => {
    const li = e.target.closest("li[data-node-id]");
    if (li) focusNodeById(li.dataset.nodeId);
  });

  for (const el of [usageUnderlinkedEl, usageOverlinkedEl, usageOrphanedEl]) {
    el.addEventListener("click", (e) => {
      const li = e.target.closest("li[data-node-id]");
      if (li) focusNodeById(li.dataset.nodeId);
    });
  }

  function updateViewModeNote() {
    viewModeNoteEl.textContent =
      viewMode === "usage"
        ? "สีจุด: เทา = ยังไม่เคยเปิด, เหลือง = Claude, เขียว = Codex (ผสมสัดส่วนถ้าเปิดทั้งคู่)"
        : "สีจุด: ตามกลุ่มไฟล์ (root/memory/reference)";
  }
  updateViewModeNote();

  agentFilterSectionEl.hidden = viewMode !== "usage";

  for (const radio of viewModeRadios) {
    radio.addEventListener("change", () => {
      if (!radio.checked) return;
      viewMode = radio.value;
      agentFilterSectionEl.hidden = viewMode !== "usage"; // ตัวเลือก agent มีความหมายแค่โหมด "ใช้งานจริง"
      refreshNodeVisuals();
      applySearchAndGroupFilter(); // อัปเดต nodeOpacity ตามความสำคัญของ viewMode ใหม่ด้วย
      Graph.refresh();
      renderHubList(data.nodes, viewMode, usageOf);
      updateViewModeNote();
    });
  }

  for (const radio of agentFilterRadios) {
    radio.addEventListener("change", () => {
      if (!radio.checked) return;
      agentFilter = radio.value;
      refreshNodeVisuals();
      applySearchAndGroupFilter();
      Graph.refresh();
      renderHubList(data.nodes, viewMode, usageOf);
    });
  }

  // ===== ค้นหา + กรองกลุ่ม + "เฉพาะไฟล์ที่มีเส้นเชื่อม" + slider ความสำคัญเส้น — รวมทุกตัวกรองไว้จุดเดียว
  // เพื่อไม่ให้ Graph.nodeVisibility/linkVisibility ทับกันเองระหว่างตัวกรองแต่ละตัว =====
  let searchTerm = "";
  function applySearchAndGroupFilter() {
    const hiddenGroups = new Set(
      groupRows.filter((row) => !row.querySelector("input").checked).map((row) => row.dataset.group)
    );
    Graph.nodeVisibility((node) => {
      if (hiddenGroups.has(node.group)) return false;
      if (onlyLinked && (totalLinkCount.get(node.id) || 0) === 0) return false;
      return true;
    });
    Graph.linkVisibility((link) => {
      const s = typeof link.source === "object" ? link.source : nodesById.get(link.source);
      const t = typeof link.target === "object" ? link.target : nodesById.get(link.target);
      if (hiddenGroups.has(s?.group) || hiddenGroups.has(t?.group)) return false;
      if (linkStrength(link) < linkStrengthThreshold) return false;
      return true;
    });
    // node ใช้ custom nodeThreeObject แล้ว (ดู makeNodeObject) — Graph.nodeOpacity() ไม่มีผลกับ custom object
    // อีกต่อไป ต้องตั้ง opacity บน material ของแต่ละ mesh เองตรงๆ
    for (const [id, mesh] of nodeMeshMap) {
      if (!searchTerm) {
        mesh.material.opacity = 0.95;
        continue;
      }
      const node = nodesById.get(id);
      const match =
        node && (node.name.toLowerCase().includes(searchTerm) || node.id.toLowerCase().includes(searchTerm));
      mesh.material.opacity = match ? 1 : 0.08;
    }
  }

  searchInputEl.addEventListener("input", (e) => {
    searchTerm = e.target.value.trim().toLowerCase();
    applySearchAndGroupFilter();
  });

  for (const row of groupRows) {
    row.querySelector("input").addEventListener("change", applySearchAndGroupFilter);
  }

  toggleOnlyLinkedEl.addEventListener("change", () => {
    onlyLinked = toggleOnlyLinkedEl.checked;
    applySearchAndGroupFilter();
  });

  linkStrengthSliderEl.addEventListener("input", () => {
    linkStrengthThreshold = Number(linkStrengthSliderEl.value);
    linkStrengthValueEl.textContent =
      linkStrengthThreshold === 0 ? "แสดงทุกเส้น" : `ซ่อนเส้นที่ความสำคัญเฉลี่ยต่ำกว่า ${linkStrengthThreshold}`;
    applySearchAndGroupFilter();
  });

  // ===== toolbar: จัดให้พอดีจอ / จัดใหม่ =====
  btnFitEl.addEventListener("click", () => {
    Graph.zoomToFit(700, 60);
  });

  btnRearrangeEl.addEventListener("click", () => {
    // ลองแล้วจริง: Graph.d3ReheatSimulation() บนกราฟนี้ (ลิงก์หนาแน่นมาก 490 เส้น/87 node) พา simulation
    // ยุบกลับไปที่ bbox แคบมาก (~รัศมี 7 หน่วย) ซ้ำบั๊กเดิมที่เคยเจอตอนทำ brain core เสมอ ไม่ว่าจะสุ่มตำแหน่ง
    // เริ่มต้นใหม่ก่อน reheat หรือไม่ก็ตาม — วิธีเดียวที่ยืนยันว่าได้เลย์เอาต์เริ่มต้นที่ดูดีเหมือนตอนโหลดครั้ง
    // แรกทุกครั้งคือรีโหลดหน้าใหม่จริงๆ ไม่ใช่ reheat physics เดิม
    location.reload();
  });

  window.addEventListener("resize", () => {
    Graph.width(window.innerWidth).height(window.innerHeight);
    bloomPass.setSize(window.innerWidth, window.innerHeight);
  });
}

main().catch((err) => {
  const appEl = document.getElementById("app");
  appEl.replaceChildren();
  const pre = document.createElement("pre");
  pre.style.color = "#ff9d9d";
  pre.style.padding = "24px";
  pre.textContent = `โหลด graph-data.json ไม่สำเร็จ: ${err}`;
  appEl.appendChild(pre);
});

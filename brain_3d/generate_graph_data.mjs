#!/usr/bin/env node
/**
 * generate_graph_data.mjs — อ่านไฟล์ .md จริงใน skill pack แล้วแปลงเป็น node/link graph
 * (ไม่ใช่ mock data) ให้หน้า 3D brain ใช้แสดงผล
 *
 * node    = 1 ไฟล์ .md
 * link    = markdown link `[text](./other.md)` ที่ชี้ไปไฟล์ .md อื่นในชุดเดียวกัน
 * group   = หมวดตาม path (root / memory / references)
 * val     = importance คร่าวๆ จากจำนวนบรรทัด + in-degree (ไฟล์ที่ถูกอ้างถึงบ่อย = สำคัญ)
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, dirname, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ใน Docker skill root ถูก mount แบบ read-only ที่ /skill_data; local run ใช้ parent ของ brain_3d
const SKILL_ROOT = process.env.SKILL_ROOT || resolve(__dirname, "..");
const OUT_FILE = join(__dirname, "public", "graph-data.json");
const ACCESS_LOG_FILE = join(SKILL_ROOT, "memory", "SKILL_ACCESS_LOG.tsv");
const ACCESS_LOG_CODEX_FILE = join(SKILL_ROOT, "memory", "SKILL_ACCESS_LOG_CODEX.tsv");

// อ่าน log รูปแบบ <timestamp ISO8601>\t<path สัมพัทธ์> หนึ่งไฟล์ — ใช้ร่วมกันทั้ง Claude (เขียนสดจาก
// agent hooks/importers อาจเขียน log เหล่านี้ได้ แต่ public pack ทำงานได้แม้ไม่มี usage log
function loadUsageLog(filePath) {
  let text = "";
  try {
    text = readFileSync(filePath, "utf-8");
  } catch {
    return { countsById: new Map(), totalEntries: 0, spanDays: 0, since: null, until: null };
  }
  const countsById = new Map();
  let minTs = null;
  let maxTs = null;
  let totalEntries = 0;
  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line || !line.includes("\t")) continue;
    const [tsStr, relPath] = line.split("\t");
    const ts = Date.parse(tsStr);
    if (Number.isNaN(ts)) continue;
    totalEntries += 1;
    countsById.set(relPath, (countsById.get(relPath) || 0) + 1);
    if (minTs === null || ts < minTs) minTs = ts;
    if (maxTs === null || ts > maxTs) maxTs = ts;
  }
  const spanDays = minTs !== null ? (maxTs - minTs) / 86400000 : 0;
  return {
    countsById,
    totalEntries,
    spanDays,
    since: minTs !== null ? new Date(minTs).toISOString() : null,
    until: maxTs !== null ? new Date(maxTs).toISOString() : null,
  };
}

function walkMarkdownFiles(dir, root = dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith(".") || entry === "brain_3d" || entry === "scripts" || entry === "other") continue;
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...walkMarkdownFiles(fullPath, root));
    } else if (extname(entry) === ".md") {
      results.push(fullPath);
    }
  }
  return results;
}

function groupOf(relPath) {
  if (relPath.startsWith("memory/")) return "memory";
  if (relPath.startsWith("references/")) return "reference";
  return "root";
}

function titleOf(content, fallback) {
  const m = content.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : fallback;
}

function extractLinks(content) {
  // จับ [text](./path.md) หรือ [text](../x/path.md) หรือ [text](path.md#anchor)
  const re = /\[[^\]]*\]\(([^)]+\.md)(?:#[^)]*)?\)/g;
  const links = [];
  let m;
  while ((m = re.exec(content)) !== null) {
    links.push(m[1]);
  }
  return links;
}

function main() {
  const files = walkMarkdownFiles(SKILL_ROOT);
  const idOf = (absPath) => relative(SKILL_ROOT, absPath).replace(/\\/g, "/");

  const nodes = [];
  const linkSet = new Map(); // key: "source|target" -> link object (กันซ้ำ)
  const inDegree = new Map();

  const fileById = new Map();
  for (const absPath of files) {
    const id = idOf(absPath);
    fileById.set(id, absPath);
    inDegree.set(id, 0);
  }

  for (const absPath of files) {
    const id = idOf(absPath);
    const content = readFileSync(absPath, "utf-8");
    const lineCount = content.split("\n").length;
    const title = titleOf(content, id);
    const group = groupOf(id);

    nodes.push({
      id,
      name: title,
      group,
      lineCount,
    });

    const rawLinks = extractLinks(content);
    for (const rawLink of rawLinks) {
      const targetAbs = resolve(dirname(absPath), rawLink);
      const targetId = idOf(targetAbs);
      if (!fileById.has(targetId) || targetId === id) continue; // ข้ามลิงก์เสีย/ลิงก์ตัวเอง
      const key = `${id}|${targetId}`;
      if (!linkSet.has(key)) {
        linkSet.set(key, { source: id, target: targetId });
        inDegree.set(targetId, (inDegree.get(targetId) || 0) + 1);
      }
    }
  }

  // importance: ผสม in-degree (ถูกอ้างถึงบ่อย) กับขนาดไฟล์ ปรับสเกลให้พอดีกับ nodeVal
  const usageClaude = loadUsageLog(ACCESS_LOG_FILE);
  const usageCodex = loadUsageLog(ACCESS_LOG_CODEX_FILE);
  for (const node of nodes) {
    const deg = inDegree.get(node.id) || 0;
    const sizeFactor = Math.min(node.lineCount / 200, 3);
    node.val = 1 + deg * 1.2 + sizeFactor;
    node.inDegree = deg;
    const claudeCount = usageClaude.countsById.get(node.id) || 0;
    const codexCount = usageCodex.countsById.get(node.id) || 0;
    node.realUsageClaude = claudeCount;
    node.realUsageCodex = codexCount;
    node.realUsage = claudeCount + codexCount; // รวมทุก agent — ใช้ต่อกับโค้ดเดิมที่มีอยู่แล้วได้ตรงๆ
  }

  const mins = [usageClaude.since, usageCodex.since].filter(Boolean).map((s) => Date.parse(s));
  const maxs = [usageClaude.until, usageCodex.until].filter(Boolean).map((s) => Date.parse(s));
  const combinedSpanDays = mins.length ? (Math.max(...maxs) - Math.min(...mins)) / 86400000 : 0;

  const graph = {
    generatedAt: new Date().toISOString(),
    nodeCount: nodes.length,
    linkCount: linkSet.size,
    nodes,
    links: [...linkSet.values()],
    // สรุปสถานะ log การใช้งานจริง (skill_usage_learning_skill.md) — ให้หน้าเว็บเตือนได้เองถ้าข้อมูลยังน้อย
    // แยกต่อ agent ด้วย เพราะ Claude (hook สด) กับ Codex (sync ย้อนหลังจาก session log) มีธรรมชาติต่างกัน
    usage: {
      totalEntries: usageClaude.totalEntries + usageCodex.totalEntries,
      spanDays: Math.round(combinedSpanDays * 10) / 10,
      since: mins.length ? new Date(Math.min(...mins)).toISOString() : null,
      until: maxs.length ? new Date(Math.max(...maxs)).toISOString() : null,
      minDaysRecommended: 14,
      byAgent: {
        claude: { totalEntries: usageClaude.totalEntries, spanDays: Math.round(usageClaude.spanDays * 10) / 10 },
        codex: { totalEntries: usageCodex.totalEntries, spanDays: Math.round(usageCodex.spanDays * 10) / 10 },
      },
    },
  };

  writeFileSync(OUT_FILE, JSON.stringify(graph, null, 2));
  console.log(`เขียน ${OUT_FILE} — ${nodes.length} nodes, ${linkSet.size} links`);
}

main();

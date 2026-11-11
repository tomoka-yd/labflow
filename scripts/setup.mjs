// このプロジェクトの初回導入・版記録・整形・検証。
import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

process.chdir(fileURLToPath(new URL("../", import.meta.url)));
const [major, minor] = process.versions.node.split(".").map(Number);
if (!(
  (major === 20 && minor >= 19) ||
  (major === 22 && minor >= 12) ||
  major > 22
)) {
  console.error("Node.jsの版が対象外です。Node 24系等を選択してください。");
  process.exit(1);
}
function run(args) {
  const result = spawnSync("npm", args, { stdio: "inherit", shell: false });
  if (result.error) console.error(result.error.message);
  if (result.error || result.status !== 0) process.exit(result.status || 1);
}
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
if (pkg.devDependencies["@types/node"]) {
  const saved = pkg.devDependencies["@types/node"];
  if (!new RegExp(`^${major}\\.\\d+\\.\\d+$`).test(saved)) {
    pkg.devDependencies["@types/node"] = String(major);
  }
  writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");
}
run(["install", "--engine-strict", "--strict-peer-deps", "--include=dev"]);
run(["ls", "--depth=0"]);
const lock = JSON.parse(readFileSync("package-lock.json", "utf8"));
for (const section of ["dependencies", "devDependencies"]) {
  for (const name of Object.keys(pkg[section] ?? {})) {
    const version = lock.packages[`node_modules/${name}`]?.version;
    if (!version) throw new Error(`導入結果が見つかりません: ${name}`);
    pkg[section][name] = version;
    lock.packages[""][section][name] = version;
  }
}
writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");
writeFileSync("package-lock.json", JSON.stringify(lock, null, 2) + "\n");
writeFileSync(".nvmrc", process.version + "\n");
run(["run", "format"]);
run(["run", "check"]);
console.log("導入・検証が完了しました。npm run dev で開始できます。");

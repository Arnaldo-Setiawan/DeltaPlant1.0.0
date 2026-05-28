import AdmZip from "adm-zip";
import { existsSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const mapsZip =
  process.env.DELTA_FORCE_MAPS_ZIP || "j:\\My Drive\\Delta Force\\Maps.zip";

const assetZip =
  process.env.DELTA_FORCE_ASSET_ZIP ||
  "j:\\My Drive\\Delta Force\\df.qq.com-cp-a20240729directory-1779015848557.zip";

const projectRoot = process.cwd();
const outputRoot = path.join(projectRoot, "public", "assets", "delta-force");
const manifestPath = path.join(projectRoot, "src", "config", "generated-assets.ts");

const imageExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);
const generatedDirectories = ["maps", "pins", "vehicles", "constructs", "utilities", "raw"];
const keptAssetDirectories = ["maps", "pins", "vehicles", "constructs"];
const tileSize = 256;

function detectExtension(buffer) {
  const header = buffer.subarray(0, 16);

  if (
    header[0] === 0x52 &&
    header[1] === 0x49 &&
    header[2] === 0x46 &&
    header[3] === 0x46 &&
    header[8] === 0x57 &&
    header[9] === 0x45 &&
    header[10] === 0x42 &&
    header[11] === 0x50
  ) {
    return ".webp";
  }

  if (
    header[0] === 0x89 &&
    header[1] === 0x50 &&
    header[2] === 0x4e &&
    header[3] === 0x47
  ) {
    return ".png";
  }

  if (header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff) {
    return ".jpg";
  }

  if (header[0] === 0x47 && header[1] === 0x49 && header[2] === 0x46) {
    return ".gif";
  }

  return null;
}

function classifyAsset(fileName) {
  const baseName = path.basename(fileName, path.extname(fileName)).toLowerCase();

  if (/^\d+_\d+_\d+$/.test(baseName)) {
    return null;
  }

  if (
    baseName.startsWith("deploy_") ||
    baseName.includes("vehicle") ||
    baseName.includes("atv") ||
    baseName.includes("tank") ||
    baseName.includes("car")
  ) {
    return "vehicles";
  }

  if (baseName.includes("marker") || baseName.startsWith("f_") || baseName.startsWith("g_")) {
    return "pins";
  }

  if (baseName.includes("construct")) {
    return "constructs";
  }

  return null;
}

function toKebab(value) {
  return value
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function toLabel(value) {
  return value
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function singularCategory(category) {
  if (category === "pins") return "pin";
  if (category === "vehicles") return "vehicle";
  if (category === "constructs") return "construct";
  throw new Error(`Unsupported asset category: ${category}`);
}

function pushTile(mapTiles, mapName, tile) {
  const existingTiles = mapTiles.get(mapName) ?? [];
  existingTiles.push(tile);
  mapTiles.set(mapName, existingTiles);
}

async function resetGeneratedAssets() {
  for (const directory of generatedDirectories) {
    await rm(path.join(outputRoot, directory), { recursive: true, force: true });
  }

  for (const directory of keptAssetDirectories) {
    await mkdir(path.join(outputRoot, directory), { recursive: true });
  }
}

async function extractMapTileSets() {
  if (!existsSync(mapsZip)) {
    throw new Error(`Maps zip was not found: ${mapsZip}`);
  }

  const zip = new AdmZip(mapsZip);
  const mapTiles = new Map();
  let skippedInvalidTiles = 0;

  for (const entry of zip.getEntries()) {
    if (entry.isDirectory) continue;

    const match = entry.entryName.match(/^Maps\/([^/]+)\/(\d+)_(\d+)_(\d+)\.[^.]+$/);
    if (!match) continue;

    const extension = path.extname(entry.entryName).toLowerCase();
    if (!imageExtensions.has(extension)) continue;

    const [, mapName, z, x, y] = match;
    const buffer = entry.getData();
    const normalizedExtension = detectExtension(buffer);

    if (!normalizedExtension) {
      skippedInvalidTiles += 1;
      continue;
    }

    const mapId = toKebab(mapName);
    const tileName = `${z}_${x}_${y}${normalizedExtension}`;
    const mapDir = path.join(outputRoot, "maps", mapId);

    await mkdir(mapDir, { recursive: true });
    await writeFile(path.join(mapDir, tileName), buffer);

    pushTile(mapTiles, mapName, {
      z: Number(z),
      x: Number(x),
      y: Number(y),
      src: `/assets/delta-force/maps/${mapId}/${tileName}`,
      source: entry.entryName.replaceAll("\\", "/"),
    });
  }

  const mapTileSets = [...mapTiles.entries()]
    .map(([mapName, tiles]) => {
      tiles.sort((left, right) => left.z - right.z || left.x - right.x || left.y - right.y);

      const zoomLevels = [...new Set(tiles.map((tile) => tile.z))].sort((left, right) => left - right);
      const minZoom = zoomLevels[0] ?? 0;
      const maxZoom = zoomLevels.at(-1) ?? 0;
      const renderTiles = tiles.filter((tile) => tile.z === maxZoom);
      const xs = renderTiles.map((tile) => tile.x);
      const ys = renderTiles.map((tile) => tile.y);
      const renderMinX = Math.min(...xs);
      const renderMaxX = Math.max(...xs);
      const renderMinY = Math.min(...ys);
      const renderMaxY = Math.max(...ys);
      const firstRenderTile = renderTiles[0] ?? tiles[0];
      const tileExtension = path.extname(firstRenderTile.src);
      const mapId = toKebab(mapName);

      return {
        id: mapId,
        label: mapName,
        tileTemplate: `/assets/delta-force/maps/${mapId}/{z}_{x}_{y}${tileExtension}`,
        baseTileSrc: firstRenderTile.src,
        tileSize,
        minZoom,
        maxZoom,
        renderZoom: maxZoom,
        renderMinX,
        renderMaxX,
        renderMinY,
        renderMaxY,
        width: (renderMaxX - renderMinX + 1) * tileSize,
        height: (renderMaxY - renderMinY + 1) * tileSize,
        tiles,
      };
    })
    .sort((left, right) => left.label.localeCompare(right.label));

  return { mapTileSets, skippedInvalidTiles };
}

async function extractPlannerAssets() {
  if (!existsSync(assetZip)) {
    console.warn(`Asset zip was not found, skipping insertable assets: ${assetZip}`);
    return [];
  }

  const zip = new AdmZip(assetZip);
  const assets = [];

  for (const entry of zip.getEntries()) {
    if (entry.isDirectory) continue;

    const extension = path.extname(entry.entryName).toLowerCase();
    if (!imageExtensions.has(extension)) continue;

    const originalName = path.basename(entry.entryName);
    const category = classifyAsset(originalName);
    if (!category) continue;

    const buffer = entry.getData();
    const normalizedExtension = detectExtension(buffer);
    if (!normalizedExtension) continue;

    const safeName = `${toKebab(originalName)}${normalizedExtension}`;
    const outputPath = path.join(outputRoot, category, safeName);

    await writeFile(outputPath, buffer);

    assets.push({
      id: `${singularCategory(category)}-${toKebab(originalName)}`,
      label: toLabel(originalName),
      category: singularCategory(category),
      src: `/assets/delta-force/${category}/${safeName}`,
      source: entry.entryName.replaceAll("\\", "/"),
    });
  }

  return assets.sort((left, right) => {
    if (left.category !== right.category) return left.category.localeCompare(right.category);
    return left.label.localeCompare(right.label);
  });
}

async function main() {
  await resetGeneratedAssets();

  const [{ mapTileSets, skippedInvalidTiles }, assets] = await Promise.all([
    extractMapTileSets(),
    extractPlannerAssets(),
  ]);

  const manifest = `import type { PlannerAsset, PlannerMap } from "@/types/assets";

export const generatedAssets = ${JSON.stringify(assets, null, 2)} as const satisfies readonly PlannerAsset[];

export const generatedMapTileSets = ${JSON.stringify(mapTileSets, null, 2)} as const satisfies readonly PlannerMap[];
`;

  await writeFile(manifestPath, manifest);

  const totalTiles = mapTileSets.reduce((sum, map) => sum + map.tiles.length, 0);
  console.log(`Prepared ${mapTileSets.length} maps with ${totalTiles} valid tiles from ${mapsZip}`);
  console.log(`Prepared ${assets.length} insertable assets from ${assetZip}`);
  if (skippedInvalidTiles > 0) {
    console.log(`Skipped ${skippedInvalidTiles} invalid map tile files`);
  }
  console.log(`Wrote ${path.relative(projectRoot, manifestPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

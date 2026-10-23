import sharp from "sharp";
import { mkdir, copyFile } from "node:fs/promises";
await mkdir("public/art", { recursive: true });
// Extract only individual artwork regions; headings and controls are rendered in React.
const crops = [
  ["01", "moon", 0, 28, 99, 213],
  ["01", "envelope", 35, 246, 205, 148],
  ["01", "clouds", 0, 480, 251, 61],
  ["02", "crystals", 130, 42, 86, 86],
  ["03", "portal", 1, 163, 230, 298],
  ["04", "wish-castle", 8, 398, 227, 129],
  ["05", "garden-sanctuary", 5, 160, 220, 110],
  ["05", "garden-flower", 116, 418, 111, 69],
  ["06", "memory-clouds", 3, 70, 43, 140],
  ["07", "challenge-clouds", 4, 423, 230, 105],
];
for (const [scene, name, left, top, width, height] of crops) {
  await sharp(`romjan_scene_${scene}.png`)
    .extract({ left, top, width, height })
    .png()
    .toFile(`public/art/${name}.png`);
}
await mkdir("public/images/references", { recursive: true });
for (const scene of [
  "01",
  "02",
  "03",
  "04",
  "04b",
  "05",
  "06",
  "07",
  "08",
  "09",
]) {
  await copyFile(
    `romjan_scene_${scene}.png`,
    `public/images/references/romjan_scene_${scene}.png`,
  );
}

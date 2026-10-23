import sharp from "sharp";
import { mkdir } from "node:fs/promises";
await mkdir("public/art", { recursive: true });
// Extract only individual artwork regions; headings and controls are rendered in React.
const crops = [
  ["01", "moon", 0, 28, 99, 213],
  ["01", "envelope", 35, 246, 205, 148],
  ["01", "clouds", 0, 480, 251, 61],
  ["02", "crystals", 130, 42, 86, 86],
  ["03", "portal", 1, 163, 230, 298],
];
for (const [scene, name, left, top, width, height] of crops) {
  await sharp(`romjan_scene_${scene}.png`)
    .extract({ left, top, width, height })
    .png()
    .toFile(`public/art/${name}.png`);
}

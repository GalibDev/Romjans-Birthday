import { birthday, finalWishes } from "./config";
function wrap(ctx: CanvasRenderingContext2D, text: string, width: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > width && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}
export async function saveBirthdayCard() {
  await document.fonts.ready;
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 1600;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Card export is unavailable in this browser.");
  const sky = ctx.createLinearGradient(0, 0, 0, 1600);
  sky.addColorStop(0, "#0d1029");
  sky.addColorStop(0.5, "#3e285c");
  sky.addColorStop(1, "#17152e");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 1200, 1600);
  const image = await new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = "/art/celebration-world.png";
  });
  if (image) {
    const height = 640;
    ctx.save();
    ctx.globalAlpha = 0.75;
    ctx.drawImage(image, 0, 960, 1200, height);
    ctx.restore();
    const shade = ctx.createLinearGradient(0, 900, 0, 1600);
    shade.addColorStop(0, "#241b42");
    shade.addColorStop(0.3, "#241b4200");
    shade.addColorStop(1, "#100f2680");
    ctx.fillStyle = shade;
    ctx.fillRect(0, 900, 1200, 700);
  }
  for (let i = 0; i < 110; i++) {
    const x = ((i * 137.31) % 1150) + 25,
      y = ((i * 89.73) % 1500) + 35;
    ctx.beginPath();
    ctx.fillStyle = i % 3 ? "#ffe2beaa" : "#ebc5f5";
    ctx.shadowColor = "#ffdaaa";
    ctx.shadowBlur = i % 4 ? 3 : 12;
    ctx.arc(x, y, i % 6 === 0 ? 3 : 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.shadowBlur = 0;
  const moon = document.createElement("canvas");
  moon.width = 200;
  moon.height = 200;
  const m = moon.getContext("2d")!;
  m.fillStyle = "#ffe3b8";
  m.beginPath();
  m.arc(100, 100, 82, 0, Math.PI * 2);
  m.fill();
  m.globalCompositeOperation = "destination-out";
  m.beginPath();
  m.arc(132, 77, 78, 0, Math.PI * 2);
  m.fill();
  ctx.save();
  ctx.shadowColor = "#f8cfff";
  ctx.shadowBlur = 30;
  ctx.drawImage(moon, 500, 85);
  ctx.restore();
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffe8db";
  ctx.font = 'italic 66px "Cormorant Garamond", Georgia, serif';
  ctx.fillText("Happy Birthday,", 600, 360);
  let size = 140;
  do {
    ctx.font = `${size}px "Great Vibes", cursive`;
    size -= 4;
  } while (ctx.measureText(`${birthday.name}!`).width > 1000 && size > 40);
  ctx.shadowColor = "#e5acd3";
  ctx.shadowBlur = 20;
  ctx.fillText(`${birthday.name}!`, 600, 510);
  ctx.shadowBlur = 0;
  ctx.font = '40px "Cormorant Garamond", Georgia, serif';
  ctx.fillStyle = "#eacfe9";
  wrap(ctx, finalWishes.subtitle, 880).forEach((line, i) =>
    ctx.fillText(line, 600, 615 + i * 48),
  );
  ctx.strokeStyle = "#dbb6cc80";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(370, 700);
  ctx.lineTo(830, 700);
  ctx.stroke();
  ctx.font = '45px "Cormorant Garamond", Georgia, serif';
  ctx.fillStyle = "#fff0df";
  wrap(ctx, finalWishes.cardWish, 870).forEach((line, i) =>
    ctx.fillText(line, 600, 785 + i * 61),
  );
  ctx.font = "italic 34px Georgia, serif";
  ctx.fillStyle = "#f6d8db";
  ctx.fillText("Keep dreaming. Keep shining.", 600, 1100);
  ctx.font = "22px Georgia, serif";
  ctx.fillStyle = "#f7dfce";
  ctx.fillText("A LITTLE UNIVERSE, MADE JUST FOR YOU", 600, 1500);
  ctx.strokeStyle = "#e1bbce";
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, 1140, 1540);
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) =>
        b
          ? resolve(b)
          : reject(new Error("Could not create the birthday card.")),
      "image/png",
    ),
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `happy-birthday-${birthday.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

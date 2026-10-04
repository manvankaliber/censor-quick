import { Image } from "@tauri-apps/api/image";
import {
  readImage,
  writeImage,
} from "@tauri-apps/plugin-clipboard-manager";

type StatusTone = "ready" | "working" | "success" | "error";
type Point = { x: number; y: number };
type DragSelection = {
  pointerId: number;
  start: Point;
  current: Point;
};
type Palette = {
  colors: Uint8Array;
  nearest: Uint8Array;
};

const getElement = <T extends Element>(selector: string): T => {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error("Missing app element: " + selector);
  return element;
};

const canvas = getElement<HTMLCanvasElement>("#image-canvas");
const context = canvas.getContext("2d", { willReadFrequently: true })!;
const stage = getElement<HTMLElement>("#stage");
const canvasWrap = getElement<HTMLElement>("#canvas-wrap");
const emptyState = getElement<HTMLElement>("#empty-state");
const selectionFrame = getElement<HTMLElement>("#selection-frame");
const fileInput = getElement<HTMLInputElement>("#image-file");
const openLink = getElement<HTMLAnchorElement>("#open-image");
const statusText = getElement<HTMLElement>("#status-text");

const maxPixels = 30_000_000;
let hasImage = false;
let clipboardBusy = false;
let dragSelection: DragSelection | null = null;

function announce(message: string, tone: StatusTone = "ready") {
  statusText.textContent = message;
  statusText.dataset.state = tone;
}

function setImageReady() {
  hasImage = true;
  emptyState.hidden = true;
  canvasWrap.hidden = false;
  stage.dataset.hasImage = "true";
}

function checkImageSize(width: number, height: number) {
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width < 1 ||
    height < 1 ||
    width * height > maxPixels
  ) {
    throw new Error("This image is too large to open here.");
  }
}

function installBitmap(bitmap: ImageBitmap) {
  checkImageSize(bitmap.width, bitmap.height);
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  context.drawImage(bitmap, 0, 0);
  setImageReady();
}

function installPixels(pixels: Uint8Array, width: number, height: number) {
  checkImageSize(width, height);
  if (pixels.byteLength !== width * height * 4) {
    throw new Error("Clipboard image data has an unexpected size.");
  }

  canvas.width = width;
  canvas.height = height;
  context.putImageData(
    new ImageData(new Uint8ClampedArray(pixels), width, height),
    0,
    0,
  );
  setImageReady();
}

async function loadImageFile(file: File) {
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    announce("Choose a PNG, JPEG, or WebP image.", "error");
    return;
  }

  announce("Opening image…", "working");

  try {
    const bitmap = await createImageBitmap(file);
    try {
      installBitmap(bitmap);
    } finally {
      bitmap.close();
    }
    announce("Image ready.", "success");
  } catch {
    announce("Image could not be opened.", "error");
  }
}

async function pasteImage() {
  if (clipboardBusy) return;
  clipboardBusy = true;
  announce("Reading the clipboard…", "working");

  try {
    const clipboardImage = await readImage();
    try {
      const size = await clipboardImage.size();
      const pixels = await clipboardImage.rgba();
      installPixels(pixels, size.width, size.height);
    } finally {
      await clipboardImage.close();
    }
    announce("Pasted image.", "success");
  } catch {
    announce("Clipboard has no readable image.", "error");
  } finally {
    clipboardBusy = false;
  }
}

async function copyImage() {
  if (!hasImage) return;
  announce("Copying image…", "working");

  try {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const clipboardImage = await Image.new(
      new Uint8Array(imageData.data),
      canvas.width,
      canvas.height,
    );
    try {
      await writeImage(clipboardImage);
    } finally {
      await clipboardImage.close();
    }
    announce("Copied image.", "success");
  } catch {
    announce("Could not copy the image.", "error");
  }
}

function canvasPoint(event: PointerEvent): Point {
  const bounds = canvas.getBoundingClientRect();
  return {
    x: Math.max(
      0,
      Math.min(
        canvas.width,
        ((event.clientX - bounds.left) / bounds.width) * canvas.width,
      ),
    ),
    y: Math.max(
      0,
      Math.min(
        canvas.height,
        ((event.clientY - bounds.top) / bounds.height) * canvas.height,
      ),
    ),
  };
}

function showSelection(start: Point, current: Point) {
  const bounds = canvas.getBoundingClientRect();
  const stageBounds = stage.getBoundingClientRect();
  const left = Math.min(start.x, current.x);
  const top = Math.min(start.y, current.y);
  const width = Math.abs(start.x - current.x);
  const height = Math.abs(start.y - current.y);
  const scaleX = bounds.width / canvas.width;
  const scaleY = bounds.height / canvas.height;

  selectionFrame.style.left =
    bounds.left - stageBounds.left + left * scaleX + "px";
  selectionFrame.style.top =
    bounds.top - stageBounds.top + top * scaleY + "px";
  selectionFrame.style.width = width * scaleX + "px";
  selectionFrame.style.height = height * scaleY + "px";
  selectionFrame.hidden = false;
}

function createPalette(source: Uint8ClampedArray): Palette {
  const pixelCount = source.length / 4;
  const sampleCount = Math.min(256, pixelCount);
  const keys = new Set<number>();

  for (let sample = 0; sample < sampleCount; sample += 1) {
    const pixel = Math.floor(
      (sample * (pixelCount - 1)) / Math.max(1, sampleCount - 1),
    );
    const offset = pixel * 4;
    keys.add((source[offset] << 16) | (source[offset + 1] << 8) | source[offset + 2]);
  }

  const colors = new Uint8Array(keys.size * 3);
  let colorOffset = 0;
  for (const key of keys) {
    colors[colorOffset] = (key >> 16) & 255;
    colors[colorOffset + 1] = (key >> 8) & 255;
    colors[colorOffset + 2] = key & 255;
    colorOffset += 3;
  }

  const nearest = new Uint8Array(32 * 32 * 32);
  let lookup = 0;

  for (let redBin = 0; redBin < 32; redBin += 1) {
    const red = Math.min(255, redBin * 8 + 4);
    for (let greenBin = 0; greenBin < 32; greenBin += 1) {
      const green = Math.min(255, greenBin * 8 + 4);
      for (let blueBin = 0; blueBin < 32; blueBin += 1) {
        const blue = Math.min(255, blueBin * 8 + 4);
        let nearestIndex = 0;
        let nearestDistance = Number.POSITIVE_INFINITY;

        for (let color = 0; color < colors.length; color += 3) {
          const redDelta = red - colors[color];
          const greenDelta = green - colors[color + 1];
          const blueDelta = blue - colors[color + 2];
          const distance =
            redDelta * redDelta +
            greenDelta * greenDelta +
            blueDelta * blueDelta;

          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestIndex = color / 3;
          }
        }

        nearest[lookup] = nearestIndex;
        lookup += 1;
      }
    }
  }

  return { colors, nearest };
}

function nearestColorIndex(red: number, green: number, blue: number, palette: Palette) {
  const lookup = ((red >> 3) << 10) | ((green >> 3) << 5) | (blue >> 3);
  return palette.nearest[lookup] * 3;
}

function quantizeToPalette(pixels: Uint8ClampedArray, palette: Palette) {
  for (let offset = 0; offset < pixels.length; offset += 4) {
    const color = nearestColorIndex(
      pixels[offset],
      pixels[offset + 1],
      pixels[offset + 2],
      palette,
    );
    pixels[offset] = palette.colors[color];
    pixels[offset + 1] = palette.colors[color + 1];
    pixels[offset + 2] = palette.colors[color + 2];
    pixels[offset + 3] = 255;
  }
}

function createRandomIndex() {
  const values = new Uint32Array(1024);
  let cursor = values.length;

  return (max: number) => {
    if (cursor >= values.length) {
      crypto.getRandomValues(values);
      cursor = 0;
    }
    return values[cursor++] % max;
  };
}

function swapPixels(pixels: Uint8ClampedArray, first: number, second: number) {
  if (first === second) return;
  const firstOffset = first * 4;
  const secondOffset = second * 4;

  for (let channel = 0; channel < 4; channel += 1) {
    const value = pixels[firstOffset + channel];
    pixels[firstOffset + channel] = pixels[secondOffset + channel];
    pixels[secondOffset + channel] = value;
  }
}

function shuffleBlocks(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  blockSize: number,
  randomIndex: (max: number) => number,
) {
  for (let top = 0; top < height; top += blockSize) {
    const blockHeight = Math.min(blockSize, height - top);

    for (let left = 0; left < width; left += blockSize) {
      const blockWidth = Math.min(blockSize, width - left);
      const count = blockWidth * blockHeight;

      for (let last = count - 1; last > 0; last -= 1) {
        const other = randomIndex(last + 1);
        const firstPixel =
          (top + Math.floor(last / blockWidth)) * width + left + (last % blockWidth);
        const otherPixel =
          (top + Math.floor(other / blockWidth)) * width + left + (other % blockWidth);
        swapPixels(pixels, firstPixel, otherPixel);
      }
    }
  }
}

function shuffleAllPixels(pixels: Uint8ClampedArray, randomIndex: (max: number) => number) {
  const count = pixels.length / 4;
  for (let last = count - 1; last > 0; last -= 1) {
    swapPixels(pixels, last, randomIndex(last + 1));
  }
}

function paddedPixels(
  source: Uint8ClampedArray,
  sourceWidth: number,
  sourceHeight: number,
  padding: number,
) {
  const width = sourceWidth + padding * 2;
  const height = sourceHeight + padding * 2;
  const pixels = new Uint8ClampedArray(width * height * 4);

  for (let y = 0; y < height; y += 1) {
    const sourceY = Math.max(0, Math.min(sourceHeight - 1, y - padding));
    for (let x = 0; x < width; x += 1) {
      const sourceX = Math.max(0, Math.min(sourceWidth - 1, x - padding));
      const sourceOffset = (sourceY * sourceWidth + sourceX) * 4;
      const targetOffset = (y * width + x) * 4;
      pixels[targetOffset] = source[sourceOffset];
      pixels[targetOffset + 1] = source[sourceOffset + 1];
      pixels[targetOffset + 2] = source[sourceOffset + 2];
      pixels[targetOffset + 3] = 255;
    }
  }

  return { pixels, width, height };
}

function blurAndFeather(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  radius: number,
) {
  const workCanvas = document.createElement("canvas");
  workCanvas.width = width;
  workCanvas.height = height;
  const workContext = workCanvas.getContext("2d")!;
  workContext.putImageData(
    new ImageData(new Uint8ClampedArray(pixels), width, height),
    0,
    0,
  );

  const output = document.createElement("canvas");
  output.width = width + radius * 2;
  output.height = height + radius * 2;
  const outputContext = output.getContext("2d", { willReadFrequently: true })!;
  outputContext.filter = "blur(" + radius + "px)";
  outputContext.drawImage(workCanvas, radius, radius);
  outputContext.filter = "none";

  const image = outputContext.getImageData(0, 0, output.width, output.height);
  const feather = Math.max(3, Math.round(radius * 1.5));

  for (let y = 0; y < output.height; y += 1) {
    for (let x = 0; x < output.width; x += 1) {
      const offset = (y * output.width + x) * 4;
      const edge = Math.min(
        x + 0.5,
        y + 0.5,
        output.width - x - 0.5,
        output.height - y - 0.5,
      );
      const amount = Math.max(0, Math.min(1, edge / feather));
      const smooth = amount * amount * (3 - 2 * amount);
      image.data[offset + 3] = Math.round(smooth * 255);
    }
  }

  outputContext.putImageData(image, 0, 0);
  return output;
}

function replaceWithBlur(start: Point, end: Point) {
  const left = Math.max(0, Math.floor(Math.min(start.x, end.x)));
  const top = Math.max(0, Math.floor(Math.min(start.y, end.y)));
  const right = Math.min(canvas.width, Math.ceil(Math.max(start.x, end.x)));
  const bottom = Math.min(canvas.height, Math.ceil(Math.max(start.y, end.y)));
  const width = right - left;
  const height = bottom - top;

  if (width < 2 || height < 2) return;

  const source = context.getImageData(left, top, width, height);
  const palette = createPalette(source.data);
  const radius = Math.max(2, Math.min(30, Math.round(Math.min(width, height) * 0.1)));
  const padded = paddedPixels(source.data, width, height, radius);
  quantizeToPalette(padded.pixels, palette);

  const randomIndex = createRandomIndex();
  const smallestSide = Math.min(padded.width, padded.height);
  const firstBlock = 2 ** Math.floor(Math.log2(Math.min(128, Math.max(2, smallestSide))));

  for (let block = firstBlock; block >= 2; block = Math.floor(block / 2)) {
    shuffleBlocks(padded.pixels, padded.width, padded.height, block, randomIndex);
  }
  shuffleAllPixels(padded.pixels, randomIndex);

  const blurred = blurAndFeather(
    padded.pixels,
    padded.width,
    padded.height,
    radius,
  );

  // The blurred layer extends beyond the selection so its feather can fade cleanly.
  const overlayOffset = radius * 2;
  context.drawImage(blurred, left - overlayOffset, top - overlayOffset);
  announce("Area blurred.", "success");
}

canvas.addEventListener("pointerdown", (event) => {
  if (!hasImage || event.button !== 0) return;

  event.preventDefault();
  canvas.focus();
  const point = canvasPoint(event);
  dragSelection = {
    pointerId: event.pointerId,
    start: point,
    current: point,
  };
  canvas.setPointerCapture(event.pointerId);
  showSelection(point, point);
});

canvas.addEventListener("pointermove", (event) => {
  if (!dragSelection || dragSelection.pointerId !== event.pointerId) return;
  dragSelection.current = canvasPoint(event);
  showSelection(dragSelection.start, dragSelection.current);
});

canvas.addEventListener("pointerup", (event) => {
  if (!dragSelection || dragSelection.pointerId !== event.pointerId) return;

  const start = dragSelection.start;
  const end = canvasPoint(event);
  dragSelection = null;
  selectionFrame.hidden = true;

  try {
    replaceWithBlur(start, end);
  } catch {
    announce("Could not blur that area.", "error");
  }
});

canvas.addEventListener("pointercancel", () => {
  dragSelection = null;
  selectionFrame.hidden = true;
});

function openImage() {
  fileInput.click();
}

openLink.addEventListener("click", (event) => {
  event.preventDefault();
  openImage();
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files?.[0];
  if (file) void loadImageFile(file);
  fileInput.value = "";
});

stage.addEventListener("dragover", (event) => event.preventDefault());
stage.addEventListener("drop", (event) => {
  event.preventDefault();
  const file = Array.from(event.dataTransfer?.files ?? []).find((item) =>
    ["image/png", "image/jpeg", "image/webp"].includes(item.type),
  );
  if (file) void loadImageFile(file);
});

document.addEventListener("paste", (event) => {
  const item = Array.from(event.clipboardData?.items ?? []).find(
    (clipboardItem) =>
      clipboardItem.kind === "file" &&
      ["image/png", "image/jpeg", "image/webp"].includes(clipboardItem.type),
  );
  const file = item?.getAsFile();

  if (file) {
    event.preventDefault();
    void loadImageFile(file);
  }
});

window.addEventListener("keydown", (event) => {
  if (!(event.ctrlKey || event.metaKey) || event.altKey) return;

  const key = event.key.toLowerCase();
  if (key === "v") {
    event.preventDefault();
    void pasteImage();
  } else if (key === "c" && hasImage) {
    event.preventDefault();
    void copyImage();
  } else if (key === "o") {
    event.preventDefault();
    openImage();
  }
});

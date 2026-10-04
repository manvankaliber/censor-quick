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
const openButton = getElement<HTMLButtonElement>("#open-image");
const emptyOpenButton = getElement<HTMLButtonElement>("#empty-open");
const copyButton = getElement<HTMLButtonElement>("#copy-image");
const pixelSize = getElement<HTMLInputElement>("#pixel-size");
const pixelOutput = getElement<HTMLOutputElement>("#pixel-output");
const status = getElement<HTMLElement>("#status");
const statusText = getElement<HTMLElement>("#status-text");
const imageInfo = getElement<HTMLElement>("#image-info");

const maxPixels = 30_000_000;
let hasImage = false;
let clipboardBusy = false;
let dragSelection: DragSelection | null = null;

function announce(message: string, tone: StatusTone = "ready") {
  statusText.textContent = message;
  status.dataset.state = tone;
}

function setImageReady() {
  hasImage = true;
  emptyState.hidden = true;
  canvasWrap.hidden = false;
  copyButton.disabled = false;
  pixelSize.disabled = false;
  imageInfo.hidden = false;
  imageInfo.textContent =
    new Intl.NumberFormat().format(canvas.width) +
    " × " +
    new Intl.NumberFormat().format(canvas.height);
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
  const imageData = new ImageData(new Uint8ClampedArray(pixels), width, height);
  context.putImageData(imageData, 0, 0);
  setImageReady();
}

async function loadImageFile(file: File) {
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    announce("Choose an image file to open.", "error");
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
    announce("Image ready. Drag across anything private.", "success");
  } catch {
    announce("Image could not be opened. Try a PNG, JPEG, or WebP.", "error");
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
    announce("Pasted image. Drag across anything private.", "success");
  } catch {
    announce("Clipboard has no readable image. Copy an image and try again.", "error");
  } finally {
    clipboardBusy = false;
  }
}

async function copyImage() {
  if (!hasImage || copyButton.disabled) return;

  copyButton.disabled = true;
  announce("Copying edited image…", "working");

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
    announce("Copied edited image. Paste it anywhere.", "success");
  } catch {
    announce("Could not copy the image. Try again in the desktop app.", "error");
  } finally {
    copyButton.disabled = !hasImage;
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

function randomBytes(length: number) {
  const bytes = new Uint8Array(length);
  const limit = 65_536;

  for (let offset = 0; offset < length; offset += limit) {
    crypto.getRandomValues(bytes.subarray(offset, Math.min(offset + limit, length)));
  }

  return bytes;
}

function replaceWithNoise(start: Point, end: Point) {
  const left = Math.max(0, Math.floor(Math.min(start.x, end.x)));
  const top = Math.max(0, Math.floor(Math.min(start.y, end.y)));
  const right = Math.min(canvas.width, Math.ceil(Math.max(start.x, end.x)));
  const bottom = Math.min(canvas.height, Math.ceil(Math.max(start.y, end.y)));
  const width = right - left;
  const height = bottom - top;

  if (width < 2 || height < 2) {
    announce("Drag a larger area to pixelate it.", "ready");
    return;
  }

  const block = Number(pixelSize.value);
  const columns = Math.ceil(width / block);
  const rows = Math.ceil(height / block);
  const colors = randomBytes(columns * rows * 3);
  const patch = context.createImageData(width, height);

  for (let row = 0; row < rows; row += 1) {
    const yStart = row * block;
    const yEnd = Math.min(yStart + block, height);

    for (let column = 0; column < columns; column += 1) {
      const xStart = column * block;
      const xEnd = Math.min(xStart + block, width);
      const colorIndex = (row * columns + column) * 3;
      const red = colors[colorIndex];
      const green = colors[colorIndex + 1];
      const blue = colors[colorIndex + 2];

      for (let y = yStart; y < yEnd; y += 1) {
        for (let x = xStart; x < xEnd; x += 1) {
          const index = (y * width + x) * 4;
          patch.data[index] = red;
          patch.data[index + 1] = green;
          patch.data[index + 2] = blue;
          patch.data[index + 3] = 255;
        }
      }
    }
  }

  context.putImageData(patch, left, top);
  canvas.classList.remove("settle-noise");
  void canvas.offsetWidth;
  canvas.classList.add("settle-noise");
  window.setTimeout(() => canvas.classList.remove("settle-noise"), 320);
  announce("Area replaced with independent random pixels.", "success");
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
  replaceWithNoise(start, end);
});

canvas.addEventListener("pointercancel", () => {
  dragSelection = null;
  selectionFrame.hidden = true;
});

function openImage() {
  fileInput.click();
}

openButton.addEventListener("click", openImage);
emptyOpenButton.addEventListener("click", openImage);
copyButton.addEventListener("click", () => void copyImage());

fileInput.addEventListener("change", () => {
  const file = fileInput.files?.[0];
  if (file) void loadImageFile(file);
  fileInput.value = "";
});

pixelSize.addEventListener("input", () => {
  pixelOutput.value = pixelSize.value + " px";
  pixelOutput.textContent = pixelOutput.value;
});

stage.addEventListener("dragover", (event) => event.preventDefault());
stage.addEventListener("drop", (event) => {
  event.preventDefault();
  const file = Array.from(event.dataTransfer?.files ?? []).find((item) =>
    item.type.startsWith("image/"),
  );
  if (file) void loadImageFile(file);
});

document.addEventListener("paste", (event) => {
  const item = Array.from(event.clipboardData?.items ?? []).find(
    (clipboardItem) =>
      clipboardItem.kind === "file" &&
      clipboardItem.type.startsWith("image/"),
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

pixelOutput.value = pixelSize.value + " px";
pixelOutput.textContent = pixelOutput.value;
copyButton.disabled = true;
pixelSize.disabled = true;

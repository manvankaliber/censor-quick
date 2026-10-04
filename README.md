# censor-quick

A small Tauri desktop tool for removing private details from screenshots before sharing them.

## Use

- Press Ctrl+V to paste an image, or choose Open image.
- Drag a rectangle over anything you want to remove.
- Adjust Pixel size before selecting an area.
- Press Ctrl+C or choose Copy image to copy the edited image.

## Pixelation

Censor Quick replaces every pixel in the selected rectangle with fresh random color blocks. The replacement pixels are generated independently from the source image, so the copied image contains no original pixel data from that area for a deblurring algorithm to reverse. A model could still guess details from surrounding context or another copy. The app does not keep an undo copy.

Image processing happens locally. Censor Quick does not upload or save the image. It cannot remove other copies of the original image, clipboard history, or guarantee that operating system memory is securely erased when the app closes.

## Run on Windows

Install Node.js, Rust, the Microsoft C++ Build Tools, and WebView2.

    npm install
    npm run tauri dev

To create a desktop build:

    npm run tauri build

## Shortcuts

- Ctrl+V: paste an image
- Ctrl+C: copy the edited image
- Ctrl+O: open an image

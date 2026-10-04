# censor-quick

A small Tauri desktop tool for blurring selected areas of screenshots.

The borderless white window has custom minimize, maximize, and close controls. When an image opens, the window resizes to the image's pixel dimensions.

## Use

- Press Ctrl+V to paste an image, drag an image into the window, or select "open image".
- Drag over an area to blur it.
- Press Ctrl+C to copy the edited image to the clipboard.
- Press Ctrl+O to open another image.

The blur samples a palette from the selected area, maps pixels to nearby colors from that palette, and shuffles pixels inside progressively smaller local blocks. A final shuffle stays local to small blocks. It then applies a Gaussian blur and a wide feather that fades both outside and into the selection. Processing happens locally. The app does not upload or save the image.

This is a visual blur, not guaranteed irreversible redaction. A blur may reveal details under some conditions, so use a solid opaque cover when information must be removed with certainty. The app does not keep an undo copy or erase other copies of the original image, clipboard history, or operating system memory.

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

## Product website

The SvelteKit website lives in `website/` and deploys from that directory on Vercel. Its product preview, feature walkthrough, and free Windows download are at [censor-quick.vercel.app](https://censor-quick.vercel.app).

<script lang="ts">
	const downloadUrl = 'https://github.com/manvankaliber/censor-quick/releases/download/v0.1.0/censor-quick-windows-x64.zip';
</script>

<svelte:head>
	<title>Censor Quick — clean up screenshots on Windows</title>
	<meta name="description" content="Paste a screenshot, drag over the details, and copy the softened image. A free, local-first screenshot redaction tool for Windows." />
	<meta name="theme-color" content="#f7f8fa" />
	<meta property="og:title" content="Censor Quick — clean up screenshots on Windows" />
	<meta property="og:description" content="A small Windows tool for softening sensitive details in screenshots. Paste, select, copy." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://censor-quick.vercel.app" />
</svelte:head>

<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
	<a class="wordmark" href="#top" aria-label="Censor Quick home">censor<span>quick</span></a>
	<nav aria-label="Main navigation">
		<a href="#how-it-works">How it works</a>
		<a href="#features">Features</a>
		<a class="nav-cta" href={downloadUrl}>Free download <span aria-hidden="true">↗</span></a>
	</nav>
</header>

<main id="main">
	<section class="hero" id="top">
		<div class="hero-copy">
			<p class="eyebrow"><span class="eyebrow-dot"></span> A tiny Windows screenshot tool</p>
			<h1>Keep the screenshot.<br /><span>Lose the details.</span></h1>
			<p class="intro">Quickly soften names, messages, and other sensitive bits. Paste an image, drag to select, then copy it straight back to your clipboard.</p>
			<div class="hero-actions">
				<a class="primary-button" href={downloadUrl}>
					<span>Download for Windows</span><span class="button-arrow" aria-hidden="true">↓</span>
				</a>
				<span class="version-note">Free · Windows 10 and 11</span>
			</div>
			<div class="quick-flow" aria-label="Keyboard shortcuts">
				<span><kbd>Ctrl</kbd><kbd>V</kbd> paste</span><i></i>
				<span class="flow-select"><b></b> drag to blur</span><i></i>
				<span><kbd>Ctrl</kbd><kbd>C</kbd> copy</span>
			</div>
		</div>
		<div class="hero-visual">
			<div class="visual-note"><span class="note-line"></span> Ready in a few seconds</div>
			<figure class="app-preview hero-preview">
				<img src="/screenshots/drop-preview.svg" alt="The slim white Censor Quick window with a centered prompt to paste, drag and drop, or open a file" width="1000" height="280" />
				<figcaption><span class="caption-dot"></span> Small window. One job.</figcaption>
			</figure>
			<div class="visual-sticker" aria-hidden="true"><span>local</span><span>by</span><span>design</span><b>↗</b></div>
		</div>
	</section>

	<div class="trust-strip" aria-label="Product details">
		<span><b>01</b> No account</span><span><b>02</b> No upload</span><span><b>03</b> Free to use</span>
	</div>

	<section class="how section-wrap" id="how-it-works">
		<div class="section-heading">
			<p class="eyebrow">Three quick moves</p>
			<h2>From capture<br />to shareable.</h2>
			<p>Keep your flow in the app you already use. Censor Quick sits between the screenshot and the send button.</p>
		</div>
		<div class="steps">
			<article class="step">
				<span class="step-number">01</span>
				<div><h3>Paste or drop</h3><p>Use <kbd>Ctrl</kbd><kbd>V</kbd>, drag a file in, or open an image. PNG, JPEG, and WebP work.</p></div>
				<div class="step-icon paste-icon" aria-hidden="true"><span>▧</span><b>⌘</b></div>
			</article>
			<article class="step">
				<span class="step-number">02</span>
				<div><h3>Drag over a detail</h3><p>Mark a name, a notification, or anything else you want softened. The fade runs into the surrounding image.</p></div>
				<div class="step-icon select-icon" aria-hidden="true"><span></span><i></i></div>
			</article>
			<article class="step">
				<span class="step-number">03</span>
				<div><h3>Copy and carry on</h3><p>Press <kbd>Ctrl</kbd><kbd>C</kbd> and paste the edited image wherever you need it.</p></div>
				<div class="step-icon copy-icon" aria-hidden="true"><span>↗</span></div>
			</article>
		</div>
	</section>

	<section class="showcase section-wrap" aria-labelledby="showcase-title">
		<div class="showcase-heading">
			<p class="eyebrow">Made for the moment after Print Screen</p>
			<h2 id="showcase-title">Just enough editing.</h2>
			<p>No project setup or export dialog. The image opens to its size, and the whole window is the canvas.</p>
		</div>
		<div class="showcase-grid">
			<figure class="app-preview showcase-preview">
				<img src="/screenshots/select-preview.svg" alt="Illustrative Censor Quick preview with a landscape screenshot and one softly feathered area" width="1000" height="590" loading="lazy" />
				<figcaption><span class="caption-dot"></span> Draw a selection right on the image</figcaption>
			</figure>
			<div class="showcase-aside">
				<div class="aside-label"><span>THE EDIT</span><span>01 / 01</span></div>
				<h3>Soft edges.<br />Color that belongs.</h3>
				<p>Before the blur, the selected pixels are shuffled within a local color palette. The resulting texture stays close to its surroundings, then fades softly at the edge.</p>
				<div class="swatch-row" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><span>Sampled from the selection</span></div>
				<p class="safety-note"><span aria-hidden="true">↗</span> For information that must be removed with certainty, use an opaque cover. A blur is a visual treatment.</p>
			</div>
		</div>
	</section>

	<section class="features section-wrap" id="features">
		<div class="features-title"><p class="eyebrow">Small on purpose</p><h2>Nothing between<br />you and the image.</h2></div>
		<div class="features-list">
			<article><span class="feature-index">A</span><div><h3>Made for Windows</h3><p>A compact, borderless desktop window with familiar paste, drag, and copy shortcuts.</p></div></article>
			<article><span class="feature-index">B</span><div><h3>Works on your device</h3><p>Images are handled locally in the app. Censor Quick has no upload flow or account.</p></div></article>
			<article><span class="feature-index">C</span><div><h3>Open, edit, move on</h3><p>The window fits the image. Select any area and continue with the copy already on your clipboard.</p></div></article>
		</div>
	</section>

	<section class="download-band" id="download">
		<div><p class="eyebrow"><span class="eyebrow-dot"></span> Free download</p><h2>Ready when<br />your next screenshot is.</h2></div>
		<div class="download-side"><p>A small, free tool for Windows. Download the portable build, open it, and paste your image.</p><a class="primary-button light-button" href={downloadUrl}><span>Download for Windows</span><span class="button-arrow" aria-hidden="true">↓</span></a><span class="download-meta">Windows x64 · ZIP · v0.1.0</span></div>
	</section>
</main>

<footer class="site-footer"><a class="wordmark" href="#top">censor<span>quick</span></a><p>Made for sharing screenshots with a little more care.</p><a href="https://github.com/manvankaliber/censor-quick">Source on GitHub <span aria-hidden="true">↗</span></a></footer>

<style>
	:global(*) { box-sizing: border-box; }
	:global(html) { scroll-behavior: smooth; background: #f7f8fa; }
	:global(body) { margin: 0; color: #17202b; background: #f7f8fa; font-family: "Segoe UI Variable Text", "Segoe UI", Inter, system-ui, sans-serif; font-size: 15px; -webkit-font-smoothing: antialiased; }
	:global(a) { color: inherit; }
	.skip-link { position: absolute; z-index: 5; top: 8px; left: 8px; padding: 10px 14px; border-radius: 6px; background: #fff; transform: translateY(-150%); }
	.skip-link:focus { transform: translateY(0); }
	.site-header { height: 76px; max-width: 1240px; margin: 0 auto; padding: 0 44px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e5e8ed; }
	.wordmark { font-size: 18px; font-weight: 700; letter-spacing: -.8px; text-decoration: none; color: #15202c; }
	.wordmark span { color: #1a69c7; }
	.site-header nav { display: flex; gap: 34px; align-items: center; color: #526070; font-size: 13px; }
	.site-header nav a { text-decoration: none; }
	.site-header nav a:hover, .site-footer a:hover { color: #155eae; }
	.site-header nav .nav-cta { padding: 10px 16px; border: 1px solid #cbd4df; border-radius: 6px; background: #fff; color: #17202b; font-weight: 600; }
	.site-header nav .nav-cta span { margin-left: 7px; color: #1a69c7; }
	.hero { max-width: 1240px; min-height: 585px; margin: 0 auto; padding: 83px 44px 65px; display: grid; grid-template-columns: 1fr 1.04fr; gap: 34px; align-items: center; }
	.eyebrow { display: flex; align-items: center; gap: 9px; margin: 0 0 18px; color: #586778; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; line-height: 1.5; text-transform: uppercase; }
	.eyebrow-dot { width: 7px; height: 7px; border-radius: 50%; background: #2376cf; box-shadow: 0 0 0 4px #e0edf9; }
	h1 { margin: 0; color: #17202b; font-size: clamp(45px, 4.7vw, 64px); font-weight: 650; letter-spacing: -3.4px; line-height: 1.04; }
	h1 span { color: #1870c8; }
	.intro { max-width: 430px; margin: 23px 0 0; color: #566474; font-size: 16px; line-height: 1.75; }
	.hero-actions { margin-top: 29px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
	.primary-button { min-height: 48px; padding: 0 15px 0 19px; display: inline-flex; align-items: center; justify-content: space-between; gap: 25px; border: 1px solid #135bac; border-radius: 6px; background: #1768bf; box-shadow: 0 2px 3px rgb(17 66 119 / 12%); color: #fff; font-size: 13px; font-weight: 650; text-decoration: none; transition: background 150ms ease, transform 150ms ease; }
	.primary-button:hover { background: #1159a7; transform: translateY(-1px); }
	.primary-button:focus-visible, .site-header a:focus-visible, .site-footer a:focus-visible { outline: 3px solid #84baf2; outline-offset: 3px; }
	.button-arrow { font-size: 17px; font-weight: 400; }
	.version-note { color: #6e7b89; font-size: 12px; }
	.quick-flow { margin-top: 28px; display: flex; align-items: center; gap: 12px; color: #687686; font-size: 11px; }
	.quick-flow > span { display: inline-flex; align-items: center; gap: 3px; white-space: nowrap; }
	.quick-flow i { width: 3px; height: 3px; border-radius: 50%; background: #a5afba; }
	kbd { display: inline-grid; min-width: 22px; height: 20px; padding: 0 4px; place-items: center; border: 1px solid #dae0e6; border-radius: 4px; background: #fff; box-shadow: 0 1px #d3d9e0; color: #4e5b69; font-family: inherit; font-size: 10px; font-weight: 600; }
	.flow-select { gap: 7px !important; }
	.flow-select b { width: 11px; height: 11px; border: 1px solid #387fc3; background: #d5e7f8; }
	.hero-visual { position: relative; padding: 35px 0 0 15px; }
	.visual-note { position: absolute; z-index: 2; top: 0; right: 8%; display: flex; align-items: center; gap: 9px; color: #6b7887; font-size: 11px; letter-spacing: .3px; }
	.note-line { width: 28px; height: 1px; background: #94a4b4; }
	.app-preview { margin: 0; padding: 10px; overflow: hidden; border: 1px solid #e4e8ed; border-radius: 9px; background: #fff; box-shadow: 0 18px 50px rgb(24 41 58 / 13%), 0 3px 8px rgb(24 41 58 / 6%); }
	.app-preview img { width: 100%; height: auto; display: block; border: 1px solid #e8eaed; border-radius: 3px; }
	.app-preview figcaption { height: 33px; padding: 8px 4px 0; display: flex; align-items: center; gap: 8px; color: #657383; font-size: 10px; }
	.caption-dot { width: 6px; height: 6px; border-radius: 50%; background: #3d91d8; }
	.visual-sticker { position: absolute; right: -7px; bottom: -22px; width: 64px; height: 64px; display: flex; flex-direction: column; justify-content: center; border: 1px solid #dce6ef; border-radius: 50%; background: #fff; box-shadow: 0 4px 14px rgb(24 41 58 / 10%); color: #49647c; font-size: 9px; line-height: 1.15; text-align: center; transform: rotate(8deg); }
	.visual-sticker b { position: absolute; right: 11px; top: 11px; color: #1d6cba; font-size: 10px; }
	.trust-strip { min-height: 67px; max-width: 1152px; margin: 0 auto; padding: 16px 0; display: flex; align-items: center; justify-content: center; gap: clamp(38px, 8vw, 112px); border-top: 1px solid #e5e8ed; border-bottom: 1px solid #e5e8ed; color: #657383; font-size: 12px; }
	.trust-strip span { display: flex; align-items: center; gap: 9px; }
	.trust-strip b { color: #1d70c7; font-size: 10px; letter-spacing: .4px; }
	.section-wrap { max-width: 1152px; margin: 0 auto; padding: 112px 0; }
	.how { display: grid; grid-template-columns: .7fr 1.3fr; gap: 10%; align-items: start; }
	.section-heading h2, .showcase h2, .features h2, .download-band h2 { margin: 0; color: #17202b; font-size: 43px; font-weight: 630; letter-spacing: -1.9px; line-height: 1.1; }
	.section-heading > p:last-child { max-width: 285px; margin: 20px 0 0; color: #687584; font-size: 14px; line-height: 1.75; }
	.steps { border-top: 1px solid #dfe4e9; }
	.step { min-height: 111px; display: grid; grid-template-columns: 45px 1fr 58px; gap: 14px; align-items: center; border-bottom: 1px solid #dfe4e9; }
	.step-number { align-self: start; padding-top: 25px; color: #1c70c4; font-size: 11px; font-weight: 700; }
	.step h3, .features h3 { margin: 0; color: #1c2631; font-size: 15px; font-weight: 650; }
	.step p { max-width: 480px; margin: 7px 0 0; color: #697685; font-size: 12px; line-height: 1.7; }
	.step p kbd { min-width: 19px; height: 17px; font-size: 9px; }
	.step-icon { position: relative; width: 44px; height: 44px; justify-self: center; display: grid; place-items: center; border: 1px solid #e2e7ec; border-radius: 50%; background: #fff; color: #2c75bc; }
	.paste-icon span { font-size: 20px; }
	.paste-icon b { position: absolute; right: 9px; bottom: 7px; font-size: 8px; }
	.select-icon span { width: 20px; height: 15px; border: 1px solid #4186c4; background: linear-gradient(110deg, #f1f6fb 20%, #c8e1f8 100%); }
	.select-icon i { position: absolute; right: 10px; top: 10px; width: 1px; height: 28px; background: #4186c4; transform: rotate(43deg); }
	.copy-icon span { width: 20px; height: 20px; display: grid; place-items: center; border: 1px solid #b8d2e8; border-radius: 4px; background: #e6f2fb; font-size: 13px; }
	.showcase { padding-top: 91px; border-top: 1px solid #e5e8ed; }
	.showcase-heading { display: flex; flex-wrap: wrap; align-items: end; justify-content: space-between; gap: 18px; margin-bottom: 32px; }
	.showcase-heading .eyebrow { width: 100%; margin-bottom: -8px; }
	.showcase-heading > p:last-child { max-width: 335px; margin: 0 4% 3px 0; color: #687584; font-size: 13px; line-height: 1.7; }
	.showcase-grid { display: grid; grid-template-columns: 1.2fr .8fr; gap: 64px; align-items: center; }
	.showcase-preview { padding: 10px; }
	.showcase-aside { max-width: 375px; }
	.aside-label { padding-bottom: 14px; display: flex; justify-content: space-between; border-bottom: 1px solid #dfe4e9; color: #8693a0; font-size: 9px; font-weight: 700; letter-spacing: 1.1px; }
	.showcase-aside h3 { margin: 22px 0 10px; color: #17202b; font-size: 26px; font-weight: 620; letter-spacing: -1px; line-height: 1.25; }
	.showcase-aside > p { margin: 0; color: #687584; font-size: 13px; line-height: 1.75; }
	.swatch-row { margin: 20px 0 27px; display: flex; align-items: center; gap: 5px; color: #788595; font-size: 10px; }
	.swatch-row i { width: 15px; height: 15px; border-radius: 3px; background: #e8dbbd; }.swatch-row i:nth-child(2) { background: #b3c3a0; }.swatch-row i:nth-child(3) { background: #738a83; }.swatch-row i:nth-child(4) { background: #d8b29a; }.swatch-row i:nth-child(5) { margin-right: 5px; background: #a8bdc6; }
	.safety-note { padding: 12px 13px; border-left: 2px solid #9dbddc; background: #eef3f7; color: #607182 !important; font-size: 11px !important; }
	.safety-note span { margin-right: 4px; color: #2875ba; }
	.features { display: grid; grid-template-columns: .8fr 1.2fr; gap: 12%; padding-top: 92px; border-top: 1px solid #e5e8ed; }
	.features-list { border-top: 1px solid #dfe4e9; }
	.features-list article { min-height: 84px; display: grid; grid-template-columns: 35px 1fr; gap: 10px; align-items: center; border-bottom: 1px solid #dfe4e9; }
	.feature-index { color: #2875bb; font-size: 10px; font-weight: 700; }
	.features h3 { font-size: 14px; }
	.features-list p { margin: 5px 0 0; color: #697685; font-size: 12px; line-height: 1.65; }
	.download-band { max-width: 1152px; min-height: 294px; margin: 0 auto 85px; padding: 48px 56px; display: grid; grid-template-columns: 1.1fr .9fr; align-items: center; gap: 12%; border-radius: 8px; background: #1b2b3d; color: #fff; }
	.download-band .eyebrow { color: #c2d2e3; }
	.download-band .eyebrow-dot { background: #82b9ed; box-shadow: 0 0 0 4px rgb(130 185 237 / 14%); }
	.download-band h2 { color: #fff; font-size: 39px; }
	.download-side { max-width: 335px; }
	.download-side > p { margin: 0 0 18px; color: #c4d0dd; font-size: 13px; line-height: 1.7; }
	.light-button { border-color: #d6e6f7; background: #fff; box-shadow: none; color: #17324b; }
	.light-button:hover { background: #eaf3fb; }
	.download-meta { display: block; margin-top: 12px; color: #9fb1c4; font-size: 10px; }
	.site-footer { max-width: 1152px; min-height: 83px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 20px; border-top: 1px solid #e5e8ed; color: #6a7786; font-size: 11px; }
	.site-footer .wordmark { font-size: 15px; }.site-footer p { margin: 0; }.site-footer > a:last-child { text-decoration: none; }
	@media (max-width: 1200px) { .section-wrap, .trust-strip, .download-band, .site-footer { margin-left: 44px; margin-right: 44px; } }
	@media (max-width: 820px) { .site-header { padding: 0 25px; }.hero { padding: 66px 25px 55px; grid-template-columns: 1fr; gap: 48px; }.hero-copy { max-width: 610px; }.hero-visual { max-width: 640px; width: 100%; margin: auto; }.hero-preview { margin-right: 10px; }.trust-strip { margin: 0 25px; justify-content: space-around; gap: 10px; }.section-wrap { margin: 0 25px; padding: 83px 0; }.how, .features { grid-template-columns: 1fr; gap: 42px; }.section-heading h2, .showcase h2, .features h2 { font-size: 37px; }.section-heading h2 br, .features-title h2 br { display: none; }.showcase-grid { grid-template-columns: 1fr; gap: 35px; }.showcase-aside { max-width: 550px; }.download-band { margin: 0 25px 60px; padding: 40px 35px; gap: 35px; }.site-footer { margin: 0 25px; } }
	@media (max-width: 520px) { .site-header { height: 65px; padding: 0 18px; }.site-header nav { gap: 17px; font-size: 11px; }.site-header nav .nav-cta { padding: 9px 11px; }.wordmark { font-size: 16px; }.hero { padding: 55px 20px 46px; }.eyebrow { font-size: 9px; letter-spacing: 1.25px; }h1 { font-size: clamp(43px, 12vw, 57px); letter-spacing: -2.5px; }.intro { margin-top: 18px; font-size: 14px; }.hero-actions { gap: 12px; }.primary-button { min-height: 45px; font-size: 12px; }.quick-flow { gap: 8px; font-size: 9px; }.quick-flow > span { gap: 2px; }.quick-flow kbd { min-width: 19px; height: 18px; }.hero-visual { padding: 31px 0 0; }.visual-note { right: 3%; font-size: 9px; }.visual-sticker { right: -3px; width: 53px; height: 53px; }.trust-strip { margin: 0 20px; font-size: 10px; }.trust-strip span { gap: 5px; }.section-wrap { margin: 0 20px; padding: 68px 0; }.section-heading h2, .showcase h2, .features h2 { font-size: 34px; }.step { grid-template-columns: 30px 1fr 45px; gap: 8px; }.step-icon { width: 39px; height: 39px; }.showcase-heading { align-items: start; }.showcase-heading > p:last-child { margin-top: 5px; }.showcase-preview { padding: 6px; }.download-band { margin: 0 20px 45px; min-height: 0; padding: 34px 23px; grid-template-columns: 1fr; gap: 27px; }.download-band h2 { font-size: 34px; }.site-footer { margin: 0 20px; min-height: 95px; flex-wrap: wrap; padding: 17px 0; }.site-footer p { order: 3; width: 100%; font-size: 10px; } }
	@media (prefers-reduced-motion: reduce) { :global(html) { scroll-behavior: auto; }.primary-button { transition: none; } }
</style>

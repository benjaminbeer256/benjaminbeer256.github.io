# Matt Can — Simple GitHub Pages Meme Overlay

This is a tiny static site (HTML/CSS/JS) that overlays a user-provided name next to the text "MATT CAN" on the provided image.

How to use
- Save the attached image from your conversation as `mattcan.png` in this folder (`/Users/ben/Desktop/site/`).
- Open `index.html` in your browser (or push this repo to GitHub Pages).
- Enter a name into the input (default is `me`) and click the `Update` button.

Notes
- The site uses only vanilla HTML/CSS/JS and draws the image and text on a `<canvas>` so it works on desktop and mobile.
- Font: the page requests the Impact-style font via CSS font-family (Impact, Haettenschweiler, Arial Black). Most systems have it installed; if not, the browser will fallback to a bold sans serif.

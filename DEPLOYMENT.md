# Publish Cricket Hub Canada on GitHub Pages

## Before upload

Open `assets/js/config.js` and review:

- `phoneDisplay`
- `whatsappNumber`
- `publicEmail`
- `instagramUrl`
- `contactFormEndpoint`

The site works as a catalogue immediately. For direct form delivery, complete `backend/google-apps-script/SETUP.md` and add the Apps Script `/exec` URL.

## Method A: Upload using the GitHub website

1. Sign in to GitHub.
2. Create a new **public** repository named `cricket-hub-canada`.
3. Do not initialize it with a theme.
4. Open the repository and choose **Add file → Upload files**.
5. Upload the **contents** of this folder so `index.html` is at the repository root.
6. Commit the files.
7. Open **Settings → Pages**.
8. Under **Build and deployment**, choose:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
9. Save and wait for GitHub to publish the site.
10. Your address will normally be:

`https://YOUR-GITHUB-USERNAME.github.io/cricket-hub-canada/`

## Method B: Git commands

From inside this folder:

```bash
git init
git add .
git commit -m "Launch Cricket Hub Canada website"
git branch -M main
git remote add origin https://github.com/YOUR-GITHUB-USERNAME/cricket-hub-canada.git
git push -u origin main
```

Then enable GitHub Pages from the `main` branch and root folder.

## TinyURL or Bitly

After the GitHub Pages URL is working:

1. Copy the full GitHub Pages address.
2. Create one short link using TinyURL or Bitly.
3. Put the short link in the Instagram bio.
4. Keep the GitHub Pages link as the actual destination.

## Updating products later

- Product content: `assets/js/products.js`
- Business settings: `assets/js/config.js`
- Product photos: `assets/images/products/<product-folder>/`
- Design: `assets/css/styles.css`
- Homepage sections: `index.html`

After editing, commit the changes. GitHub Pages will republish the site.

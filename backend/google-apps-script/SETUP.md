# Contact-form email setup

The website form is already coded. Google Apps Script receives the form, saves every inquiry in a Google Sheet, and emails all details to **crickethubcanada@gmail.com**.

## 1. Create the lead sheet

1. Sign in to the Google account that owns `crickethubcanada@gmail.com`.
2. Open Google Sheets and create a blank spreadsheet.
3. Name it `Cricket Hub Canada Leads`.
4. In the spreadsheet, choose **Extensions → Apps Script**.

## 2. Add the backend code

1. Delete the sample code in the Apps Script editor.
2. Open `backend/google-apps-script/Code.gs` from this website project.
3. Copy the complete file and paste it into Apps Script.
4. Click **Save**.

## 3. Deploy as a web app

1. Click **Deploy → New deployment**.
2. Click the gear icon and select **Web app**.
3. Description: `Cricket Hub Canada contact form`.
4. Execute as: **Me**.
5. Who has access: **Anyone**.
6. Click **Deploy** and approve the requested Google permissions.
7. Copy the web-app URL ending in `/exec`.

## 4. Connect it to the website

Open `assets/js/config.js` and replace:

```js
contactFormEndpoint: "",
```

with:

```js
contactFormEndpoint: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec",
```

Commit and push that change to GitHub.

## 5. Test

1. Wait for GitHub Pages to redeploy.
2. Open the live website in a private/incognito window.
3. Fill in every form field and click **Send inquiry**.
4. Confirm that:
   - the site displays a success message;
   - an email arrives at `crickethubcanada@gmail.com`;
   - a `Leads` tab is created in the Google Sheet;
   - all submitted fields appear in one new row.

The email includes inquiry type, product, name, email, phone, city, message, page URL, and a submission ID. Replies go directly to the customer's submitted email address.

## Updating the script later

After changing `Code.gs`, go to **Deploy → Manage deployments**, edit the existing deployment, choose **New version**, and deploy again. Keep the same `/exec` URL.

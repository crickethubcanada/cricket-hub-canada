# Free contact-form backend: Google Apps Script

This backend does two things:

1. Sends every valid website inquiry to the script owner's email.
2. Saves every inquiry in a private `Leads` tab in Google Sheets.

No server or paid hosting is required.

## Setup

1. Create a new Google Sheet named `Cricket Hub Canada Leads`.
2. In that Sheet, choose **Extensions → Apps Script**.
3. Delete the sample code and paste the contents of `Code.gs`.
4. Click **Save**.
5. Choose **Deploy → New deployment**.
6. Select **Web app** as the deployment type.
7. Set:
   - Execute as: **Me**
   - Who has access: **Anyone**
8. Click **Deploy** and approve the requested permissions.
9. Copy the web-app URL ending in `/exec`.
10. Open `assets/js/config.js` in this website and paste the URL here:

```js
contactFormEndpoint: "PASTE_THE_EXEC_URL_HERE",
```

11. Commit the edited file to GitHub. The form will now send email and create lead rows.

## Recipient email

By default, the email is sent to the Google account that owns and deploys the Apps Script.

To use a different email:

1. In Apps Script, open **Project Settings**.
2. Under **Script Properties**, add:
   - Property: `CONTACT_EMAIL`
   - Value: your business email
3. Deploy a new version.

## Testing

1. Open the `/exec` URL directly. It should say the endpoint is running.
2. Submit a test message from the published website.
3. Confirm:
   - the email reaches the recipient;
   - a `Leads` sheet is created;
   - the new row is marked `New`.

## Important

- Keep the Google Sheet private.
- Do not publish the Sheet or share edit access publicly.
- Google Apps Script and MailApp have usage quotas. This setup is intended for a small launch, not high-volume ecommerce.

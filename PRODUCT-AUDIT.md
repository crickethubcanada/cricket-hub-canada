# Product and launch audit

## Included

- 11 unique products
- 8 English willow bats
- 1 hard-tennis bat
- 2 leather cricket balls
- Product photographs for every listed item
- Square logo and a dark website banner
- Retail prices and product descriptions
- Kingston phone number
- Contact form, phone/text inquiries and policy page
- Google Apps Script email/lead backend

## Missing or requiring confirmation

1. **Instagram URL is blank.** Add it to `assets/js/config.js` when the account is ready.
2. **A dedicated business email was not provided.** The site currently uses `gandhi.divansh@gmail.com` as the public fallback. Replace it before launch if you create a business email.
3. **The Google Apps Script endpoint must be deployed.** Until its URL is added to `config.js`, the form falls back to opening the visitor's email app.
4. **Supplier return and warranty rules need confirmation.** The draft policy is conservative but should match your cousin's actual wholesale arrangement.
5. **Shipping prices are not available.** The website therefore says shipping is confirmed before payment.
6. **Tax treatment is not configured.** The site is an inquiry catalogue and does not calculate or collect tax.
7. **Inventory is not synchronized.** Each inquiry must be checked with the supplier before accepting payment.
8. **No gloves or protective gear were included in the uploaded product folders.** They can be added later.

## Product-data issues corrected in the website

- Product IDs were blank in the spreadsheet; the folder names are now used as stable IDs.
- Duplicate spreadsheet rows for SH/LB variants were merged into one product with selectable variants.
- The tennis-bat title typo `Think Blade Scope` was corrected to `Thick Scoop`.
- `Grade` was corrected from `Garde` in the Max Pro copy.
- Incorrect pound conversions such as `2.9–2.11 lbs` were removed; the website uses grams.
- Max Limited had conflicting weight values between spreadsheet columns and description. The site asks the customer to confirm the exact available bat weight.
- `Original Price` and `Price` were identical, so no fake discount or crossed-out price is shown.
- The uploaded `header-banner.png` contains a checkerboard pattern baked into the image. The website uses `header-banner-wd-bg.png` instead.

## Confirm before accepting money

- Current supplier availability and exact variant
- Your wholesale cost and real profit after shipping/fees
- Exact bat photos, weight and size
- Delivery time to Kingston or direct shipping process
- Customer shipping charge
- Return, damage and warranty responsibility
- Whether HST should be charged

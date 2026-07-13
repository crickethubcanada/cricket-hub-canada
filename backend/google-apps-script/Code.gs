const LEADS_SHEET_NAME = 'Leads';

/**
 * Cricket Hub Canada contact-form backend.
 * Create this script from a Google Sheet:
 * Google Sheet > Extensions > Apps Script
 */
function doGet() {
  return HtmlService.createHtmlOutput(
    '<!doctype html><html><body style="font-family:Arial;padding:24px">' +
    '<h2>Cricket Hub Canada contact endpoint is running.</h2>' +
    '<p>You can close this page.</p></body></html>'
  );
}

function doPost(e) {
  try {
    const data = normalizeSubmission_(e && e.parameter ? e.parameter : {});

    // Honeypot: bots often fill hidden fields.
    if (data.website) {
      return responsePage_('Thank you', 'Your message was received.');
    }

    validateSubmission_(data);

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      saveLead_(data);
    } finally {
      lock.releaseLock();
    }

    sendOwnerEmail_(data);
    return responsePage_('Thank you', 'Your inquiry was sent to Cricket Hub Canada.');
  } catch (error) {
    console.error(error);
    return responsePage_(
      'Message not sent',
      'There was a problem sending your message. Please contact Cricket Hub Canada by phone or email.'
    );
  }
}

function normalizeSubmission_(p) {
  return {
    id: Utilities.getUuid(),
    submittedAt: new Date(),
    inquiryType: clean_(p.inquiry_type, 80),
    product: clean_(p.product, 180),
    name: clean_(p.name, 120),
    email: clean_(p.email, 180).toLowerCase(),
    phone: clean_(p.phone, 60),
    city: clean_(p.city, 120),
    message: clean_(p.message, 4000),
    consent: clean_(p.consent, 20),
    pageUrl: clean_(p.page_url, 500),
    website: clean_(p.website, 200)
  };
}

function validateSubmission_(data) {
  if (!data.name || !data.email || !data.message) {
    throw new Error('Required fields are missing.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    throw new Error('The email address is invalid.');
  }
  if (data.consent !== 'yes') {
    throw new Error('Consent is required.');
  }
}

function saveLead_(data) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    throw new Error('This script must be created from a Google Sheet.');
  }

  let sheet = spreadsheet.getSheetByName(LEADS_SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(LEADS_SHEET_NAME);
    sheet.appendRow([
      'Submission ID',
      'Submitted At',
      'Inquiry Type',
      'Product',
      'Name',
      'Email',
      'Phone',
      'City',
      'Message',
      'Page URL',
      'Status'
    ]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 11).setFontWeight('bold').setBackground('#cf161d').setFontColor('#ffffff');
  }

  sheet.appendRow([
    data.id,
    data.submittedAt,
    data.inquiryType,
    data.product,
    data.name,
    data.email,
    data.phone,
    data.city,
    data.message,
    data.pageUrl,
    'New'
  ]);
}

function sendOwnerEmail_(data) {
  const recipient = getRecipientEmail_();
  const subjectParts = ['Cricket Hub Canada', data.inquiryType || 'Website inquiry'];
  if (data.product) subjectParts.push(data.product);

  const plainBody = [
    'New Cricket Hub Canada website inquiry',
    '',
    'Inquiry type: ' + data.inquiryType,
    'Product: ' + data.product,
    'Name: ' + data.name,
    'Email: ' + data.email,
    'Phone: ' + data.phone,
    'City: ' + data.city,
    '',
    'Message:',
    data.message,
    '',
    'Page: ' + data.pageUrl,
    'Submission ID: ' + data.id
  ].join('\n');

  const htmlBody =
    '<h2>New Cricket Hub Canada inquiry</h2>' +
    '<table cellpadding="7" cellspacing="0" style="border-collapse:collapse">' +
    row_('Inquiry type', data.inquiryType) +
    row_('Product', data.product) +
    row_('Name', data.name) +
    row_('Email', data.email) +
    row_('Phone', data.phone) +
    row_('City', data.city) +
    '</table>' +
    '<h3>Message</h3><p style="white-space:pre-wrap">' + escapeHtml_(data.message) + '</p>' +
    '<p><small>Submission ID: ' + escapeHtml_(data.id) + '</small></p>';

  MailApp.sendEmail({
    to: recipient,
    subject: '[' + subjectParts.join('] [') + ']',
    body: plainBody,
    htmlBody: htmlBody,
    replyTo: data.email,
    name: 'Cricket Hub Canada Website'
  });
}

function getRecipientEmail_() {
  const configured = PropertiesService.getScriptProperties().getProperty('CONTACT_EMAIL');
  const effectiveUser = Session.getEffectiveUser().getEmail();
  const recipient = configured || effectiveUser;
  if (!recipient) {
    throw new Error('No contact email is configured.');
  }
  return recipient;
}

function clean_(value, maxLength) {
  return String(value || '').replace(/\u0000/g, '').trim().slice(0, maxLength);
}

function row_(label, value) {
  return '<tr><th align="left" style="border:1px solid #ddd;background:#f6f6f6">' +
    escapeHtml_(label) +
    '</th><td style="border:1px solid #ddd">' +
    escapeHtml_(value || '—') +
    '</td></tr>';
}

function escapeHtml_(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function responsePage_(heading, message) {
  return HtmlService.createHtmlOutput(
    '<!doctype html><html><head><meta charset="utf-8"></head>' +
    '<body style="font-family:Arial;padding:24px">' +
    '<h2>' + escapeHtml_(heading) + '</h2>' +
    '<p>' + escapeHtml_(message) + '</p>' +
    '</body></html>'
  ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

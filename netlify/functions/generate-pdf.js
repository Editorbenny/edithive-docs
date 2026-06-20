const fs       = require('fs');
const path     = require('path');
const chromium = require('@sparticuz/chromium-min');
const puppeteer = require('puppeteer-core');
const { templates } = require('./templates');

const CHROMIUM_URL =
  'https://github.com/Sparticuz/chromium/releases/download/v119.0.2/chromium-v119.0.2-pack.tar';

/* Load + cache the logo as a base64 data URL (once per cold start) */
let _logoDataUrl = null;
function getLogoDataUrl() {
  if (_logoDataUrl) return _logoDataUrl;
  try {
    const logoPath = path.join(__dirname, 'edithive-logo.png');
    const b64 = fs.readFileSync(logoPath, 'base64');
    _logoDataUrl = `data:image/png;base64,${b64}`;
  } catch {
    /* Fallback: transparent 1×1 PNG if file is missing */
    _logoDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  }
  return _logoDataUrl;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let docType, formData, items;
  try {
    ({ docType, formData = {}, items = [] } = JSON.parse(event.body || '{}'));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const templateFn = templates[docType];
  if (!templateFn) {
    return { statusCode: 400, body: JSON.stringify({ error: `Unknown document type: ${docType}` }) };
  }

  const logoDataUrl = getLogoDataUrl();
  const html        = templateFn(formData, items, logoDataUrl);

  let browser;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1240, height: 1754 },
      executablePath: await chromium.executablePath(CHROMIUM_URL),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
    });

    await browser.close();

    const stamp = new Date().toISOString().slice(0, 10);
    const slug  = docType.replace(/-/g, '_');

    return {
      statusCode: 200,
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="edithive-${slug}-${stamp}.pdf"`,
        'Cache-Control':       'no-cache, no-store',
      },
      body: Buffer.from(pdf).toString('base64'),
      isBase64Encoded: true,
    };
  } catch (err) {
    if (browser) await browser.close().catch(() => {});
    console.error('[generate-pdf] Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'PDF generation failed', detail: err.message }),
    };
  }
};

const chromium = require('@sparticuz/chromium-min');
const puppeteer = require('puppeteer-core');
const { templates } = require('./templates');

// Chromium binary URL — use a stable release compatible with Node 18
const CHROMIUM_URL =
  'https://github.com/Sparticuz/chromium/releases/download/v119.0.2/chromium-v119.0.2-pack.tar';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let docType, formData, items;
  try {
    ({ docType, formData, items = [] } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: 'Invalid JSON body' };
  }

  const templateFn = templates[docType];
  if (!templateFn) {
    return { statusCode: 400, body: `Unknown document type: ${docType}` };
  }

  const html = templateFn(formData, items);

  let browser;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(CHROMIUM_URL),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
    });

    await browser.close();

    const docLabel = docType.replace(/-/g, '_');
    const timestamp = new Date().toISOString().slice(0, 10);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="edithive-${docLabel}-${timestamp}.pdf"`,
        'Cache-Control': 'no-cache',
      },
      body: Buffer.from(pdf).toString('base64'),
      isBase64Encoded: true,
    };
  } catch (err) {
    if (browser) await browser.close().catch(() => {});
    console.error('PDF generation error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'PDF generation failed', detail: err.message }),
    };
  }
};

import puppeteer from 'puppeteer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { phone, message } = await req.json();

    if (!phone || !message) {
      return NextResponse.json(
        { error: 'Phone and message are required' },
        { status: 400 }
      );
    }

    const browser = await puppeteer.launch({ headless: false }); // Open Chrome
    const page = await browser.newPage();
    await page.goto('https://web.whatsapp.com');

    console.log(
      'Scan the QR Code on WhatsApp Web and press Enter in console...'
    );
    await new Promise((resolve) =>
      require('readline')
        .createInterface({
          input: process.stdin,
          output: process.stdout
        })
        .question('', resolve)
    );

    const url = `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
    await page.goto(url);
    await page.waitForSelector("span[data-icon='send']", { timeout: 15000 });

    const sendButton = await page.$("span[data-icon='send']");
    if (sendButton) {
      await sendButton.click();
      await new Promise((r) => setTimeout(r, 5000)); // Wait for sending
    }

    await browser.close();
    return NextResponse.json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

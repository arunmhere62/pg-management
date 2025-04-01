import { BadRequestError, errorHandler } from '@/services/utils/error';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const email = formData.get('email') as string;
    const file = formData.get('file') as File;

    if (!email || !file) {
      throw new BadRequestError('Email and file are required');
    }

    // Convert file to buffer
    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);

    // Nodemailer setup
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'arunmhere98@gmail.com',
        pass: 'cffp atvm dqvf lbus'
      }
    });

    // Mail options
    let mailOptions = {
      from: 'arunmhere98@gmail.com',
      to: email,
      subject: 'Payment Receipt',
      text: 'Please find your payment receipt attached.',
      attachments: [
        {
          filename: 'receipt.pdf',
          content: buffer,
          contentType: 'application/pdf'
        }
      ]
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Receipt sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    return errorHandler(error);
  }
}

import prisma from '@/lib/prisma';
import { errorHandler } from '@/services/utils/error';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const GET = async (req: NextRequest) => {
  try {
    const cookies = req.cookies;
    const pgLocationId = cookies.get('pgLocationId')?.value;
    if (!pgLocationId) {
      return NextResponse.json({
        error: 'PG location data not found in cookies',
        status: 400
      });
    }
    const res = await prisma.visitors.findMany({
      where: {
        pgId: Number(pgLocationId),
        isDeleted: false
      },
      include: {
        rooms: {
          select: {
            roomNo: true
          }
        },
        beds: {
          select: {
            bedNo: true
          }
        }
      }
    });
    return NextResponse.json(
      {
        message: 'Visitors fetched successfully',
        data: res
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};

const visitorsSchema = z.object({
  pgId: z.number().min(1, 'PG ID is required'),
  bedId: z.number().min(1, 'Bed ID is required'),
  roomId: z.number().min(1, 'Room ID is required'),
  visitorName: z.string().min(1, 'Visitor Name is required'),
  phoneNo: z.string().min(10, 'Phone number is required'),
  purpose: z.string().min(1, 'Purpose is required'),
  visitedDate: z.string().min(1, 'Visit date is required'),
  checkInTime: z.string().min(1, 'Check-in time is required'),
  checkOutTime: z.string().optional()
});

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const parsedData = visitorsSchema.safeParse(body.data);
    if (!parsedData.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parsedData.error.format() },
        { status: 400 }
      );
    }
    const res = await prisma.visitors.create({
      data: {
        pgId: parsedData.data.pgId,
        visitedBedId: parsedData.data.bedId,
        visitedRoomId: parsedData.data.roomId,
        visitorName: parsedData.data.visitorName,
        phoneNo: parsedData.data.phoneNo,
        purpose: parsedData.data.purpose,
        visitedDate: parsedData.data.visitedDate,
        checkInTime: parsedData.data.checkInTime,
        checkOutTime: parsedData.data.checkOutTime || null
      }
    });
    return NextResponse.json({
      message: 'Visitor created successfully',
      status: 201,
      data: res
    });
  } catch (error) {
    return errorHandler(error);
  }
};

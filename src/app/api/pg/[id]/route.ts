import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Id is required' }, { status: 400 });
    }
    const pgLocation = await prisma.pg_locations.findUnique({
      where: {
        id: Number(id)
      }
    });
    if (!pgLocation) {
      return NextResponse.json(
        { error: 'pg location not fount' },
        { status: 404 }
      );
    }
    return NextResponse.json(pgLocation, { status: 200 });
  } catch (error: any) {
    if (error.name === 'PrismaClientKnownRequestError') {
      NextResponse.json(
        { error: 'Database query error', details: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;

    const body = await req.json();
    const updatedPG = await prisma.pg_locations.update({
      where: {
        id: Number(id)
      },
      data: {
        address: body.data.address,
        cityId: Number(body.data.city),
        stateId: Number(body.data.state),
        pincode: body.data.pincode,
        locationName: body.data.locationName,
        images: body.data.images
      }
    });
    return NextResponse.json(
      { message: 'PG updated successfully', updatedPG },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.name === 'PrismaClientKnownRequestError') {
      NextResponse.json(
        { error: 'Database query error', details: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
};

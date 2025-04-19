import prisma from '@/lib/prisma';
import { BadRequestError, errorHandler } from '@/services/utils/error';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
    const cookies = req.cookies;
    const pgLocationId = cookies.get('pgLocationId')?.value;
    if (!pgLocationId) throw new BadRequestError('Select PG Location');

    // Get PG details
    const pgDetails = await prisma.pg_locations.findUnique({
      where: {
        id: Number(pgLocationId)
      },
      select: {
        id: true,
        locationName: true,
        address: true,
        cityId: true,
        stateId: true
      }
    });

    if (!pgDetails) {
      throw new BadRequestError('PG not found');
    }

    // Get total rooms count
    const totalRooms = await prisma.rooms.count({
      where: {
        pgId: Number(pgLocationId),
        isDeleted: false
      }
    });

    // Get total beds count
    const totalBeds = await prisma.beds.count({
      where: {
        rooms: {
          pgId: Number(pgLocationId)
        },
        isDeleted: false
      }
    });

    // Get occupied beds count
    const occupiedBeds = await prisma.beds.count({
      where: {
        rooms: {
          pgId: Number(pgLocationId)
        },
        isDeleted: false,
        tenants: {
          some: {
            isDeleted: false
          }
        }
      }
    });

    // Get total tenants count
    const totalTenants = await prisma.tenants.count({
      where: {
        pgId: Number(pgLocationId),
        isDeleted: false,
        status: 'ACTIVE'
      }
    });

    // Calculate occupancy rate
    const occupancyRate = totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0;

    // Get room sharing statistics
    const rooms = await prisma.rooms.findMany({
      where: {
        pgId: Number(pgLocationId),
        isDeleted: false
      },
      select: {
        id: true,
        roomNo: true,
        rentPrice: true,
        _count: {
          select: {
            beds: true
          }
        }
      }
    });

    // Calculate total rooms price and room sharing statistics
    let totalRoomsPrice = 0;
    const roomSharing: Record<string, number> = {};

    for (const room of rooms) {
      totalRoomsPrice += Number(room.rentPrice || 0);

      // Use bed count to determine room type (e.g., Single, Double, etc.)
      const bedCount = room._count.beds;
      const roomType =
        bedCount === 1
          ? 'Single'
          : bedCount === 2
            ? 'Double'
            : bedCount === 3
              ? 'Triple'
              : bedCount >= 4
                ? 'Shared'
                : 'Other';

      if (!roomSharing[roomType]) {
        roomSharing[roomType] = 0;
      }
      roomSharing[roomType]++;
    }

    return NextResponse.json({
      pgDetails,
      propertyStats: {
        totalRooms,
        totalBeds,
        occupiedBeds,
        totalTenants,
        occupancyRate: Math.round(occupancyRate),
        totalRoomsPrice,
        roomSharing
      }
    });
  } catch (error) {
    return errorHandler(error);
  }
};

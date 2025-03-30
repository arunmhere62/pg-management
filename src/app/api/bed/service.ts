import prisma from '@/lib/prisma';
import { errorHandler } from '@/services/utils/error';
import { BedStatus, rooms_status } from '@prisma/client';

export async function updateBedStatus(bedId: number, status: BedStatus) {
  return await prisma.$transaction(async (prisma) => {
    try {
      const bed = await prisma.beds.update({
        where: { id: bedId },
        data: { status }
      });

      // Ensure roomId exists
      if (!bed.roomId) {
        return bed;
      }

      // Count total & occupied beds in the room
      const [totalBeds, occupiedBeds] = await Promise.all([
        prisma.beds.count({ where: { roomId: bed.roomId } }),
        prisma.beds.count({
          where: { roomId: bed.roomId, status: BedStatus.OCCUPIED }
        })
      ]);
      const newRoomStatus =
        totalBeds === occupiedBeds
          ? rooms_status.OCCUPIED
          : rooms_status.AVAILABLE;

      // Ensure room exists before updating
      const roomExists = await prisma.rooms.findUnique({
        where: { id: bed.roomId }
      });

      if (!roomExists) {
        return bed;
      }

      // Update room status
      await prisma.rooms.update({
        where: { id: bed.roomId, pgId: bed.pgId },
        data: { status: newRoomStatus }
      });

      return bed;
    } catch (error) {
      return errorHandler(error);
    }
  });
}

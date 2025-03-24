import prisma from '@/lib/prisma';
import { BedStatus, rooms_status } from '@prisma/client';

export async function updateBedStatus(bedId: number, status: BedStatus) {
  return await prisma.$transaction(async (prisma) => {
    try {
      // Update bed status
      console.log('bedId', bedId);

      const bed = await prisma.beds.update({
        where: { id: bedId },
        data: { status }
      });

      console.log('bed', bed);

      // Ensure roomId exists
      if (!bed.roomId) {
        console.error('Error: Bed does not have a roomId');
        return bed;
      }

      console.log('Fetching room details for roomId:', bed.roomId);

      // Count total & occupied beds in the room
      const [totalBeds, occupiedBeds] = await Promise.all([
        prisma.beds.count({ where: { roomId: bed.roomId } }),
        prisma.beds.count({
          where: { roomId: bed.roomId, status: BedStatus.OCCUPIED }
        })
      ]);
      console.log(`Total beds: ${totalBeds}, Occupied beds: ${occupiedBeds}`);

      // ✅ Use Prisma's Enum Type Here
      const newRoomStatus =
        totalBeds === occupiedBeds
          ? rooms_status.OCCUPIED
          : rooms_status.AVAILABLE;

      console.log('newRoomStatus', newRoomStatus);
      console.log('bed id', bed.id);

      // Ensure room exists before updating
      const roomExists = await prisma.rooms.findUnique({
        where: { id: bed.roomId }
      });

      if (!roomExists) {
        console.error('Error: Room does not exist for roomId:', bed.roomId);
        return bed;
      }

      console.log('Updating room status...');

      // Update room status
      await prisma.rooms.update({
        where: { id: bed.roomId, pgId: bed.pgId },
        data: { status: newRoomStatus }
      });

      console.log('Room status updated successfully');

      return bed;
    } catch (error: any) {
      console.error('Error updating bed status:', error);
      throw new Error(`Failed to update bed status: ${error.message}`);
    }
  });
}

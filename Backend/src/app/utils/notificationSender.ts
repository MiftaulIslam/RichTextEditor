

import { v4 as uuidv4 } from "uuid";
import { Repository } from "../repository/implementation/Repository";
import { notifications } from "@prisma/client";
import { io, userSocketMap } from "../../socket/socketServer";

/**
 * Sends a notification and emits a real-time event if the recipient is online.
 * @param recipientId The user who will receive the notification.
 * @param senderId The user who triggered the notification.
 * @param content The message content.
 * @param url The URL to redirect to when the notification is clicked.
 * @param type The type of notification (default: "other").
 * @param title Notification title (default: "Notification").
 */

const _notificationsRepository = new Repository<notifications>("notifications")
export const sendNotification = async (
  recipientId: string,
  senderId: string,
  content: string,
  url: string,
  type: string = "other",
  title: string = "Notification"
) => {
  try {
    console.log(`Sending notification to ${recipientId} from ${senderId}...`);

    // Save notification in the database
    const notification = await _notificationsRepository.create({
      id: uuidv4(),
      recipient_id: recipientId,
      sender_id: senderId,
      type,
      title,
      content,
      url_to: url,
      is_read: false,
      highlight: true,
    });

    // Emit real-time notification if recipient is online
    const recipientSocketId = userSocketMap.get(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("new-notification", notification);
    } else {
      console.warn(`User ${recipientId} is offline, notification saved.`);
    }
  } catch (error) {
    console.error("Failed to send notification:", error);
  }
};

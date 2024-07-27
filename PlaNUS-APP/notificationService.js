// Utils/notificationService.js

import * as Notifications from 'expo-notifications';

export const schedulePushNotification = async (title, body, date) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: {
      date,
    },
  });
};

export const cancelAllScheduledNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

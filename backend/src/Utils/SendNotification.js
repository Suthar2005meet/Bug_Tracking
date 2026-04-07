const Notification = require("../Models/NotificationModel");

const sendNotification = async ({
    receiver,
    sender,
    type,
    bug = null,
    project = null,
    message = ""
}) => {
    try {
        await Notification.create({
            receiver,
            sender,
            type,
            bug,
            project,
            message
        });
    } catch (err) {
        console.error("Notification Error:", err.message);
    }
};

module.exports = sendNotification;
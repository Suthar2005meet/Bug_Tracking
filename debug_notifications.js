const mongoose = require('mongoose');
const NotificationModel = require('./backend/src/Models/NotificationModel');
require('./backend/src/Models/UserModel');
require('./backend/src/Models/BugModel');
require('./backend/src/Models/ProjectModel');
require('./backend/src/Models/IssueModel');

mongoose.connect('mongodb://127.0.0.1:27017/bugtracking', { useNewUrlParser: true, useUnifiedTopology: true })
.then(async () => {
    try {
        console.log("Connected to DB, querying...");
        const notifications = await NotificationModel.find()
            .populate('sender', 'name email')
            .populate('bug', 'title')
            .populate('task', 'title status')
            .populate('project', 'title')
            .sort({ createdAt: -1 })
            .limit(10);
        console.log("SUCCESS!", notifications.length);
    } catch (err) {
        console.error("ERROR CAUGHT:");
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
})
.catch(err => console.error("DB connection error", err));

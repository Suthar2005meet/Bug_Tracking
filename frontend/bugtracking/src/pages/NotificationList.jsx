export const NotificationList = ({ notifications }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="font-bold text-slate-700 mb-3">Notifications</h2>

      {notifications?.length === 0 ? (
        <p className="text-sm text-slate-400">No notifications</p>
      ) : (
        notifications.map((note) => (
          <div key={note._id} className="border-b py-2 text-sm">
            {note.message}
          </div>
        ))
      )}
    </div>
  );
};
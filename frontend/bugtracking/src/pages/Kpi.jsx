export const Kpi = ({ title, value }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-5 border border-slate-200">
      <h3 className="text-sm text-slate-500 uppercase">{title}</h3>
      <p className="text-3xl font-bold text-indigo-600 mt-2">{value}</p>
    </div>
  );
};
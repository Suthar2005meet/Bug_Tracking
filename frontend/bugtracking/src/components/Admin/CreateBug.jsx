import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../AuthProvider";

export const CreateBug = () => {
  const { userId } = useContext(AuthContext)
  const [projects, setProjects] = useState([]);
  const [reported, setReported] = useState([]);
  const [developer, setdeveloper] = useState([]);
  const navigate = useNavigate();
  const location = useLocation()
  const projectIds = projects.map(project => project._id);
  const developerIds = projects.map(project => project?.assignedDevelopers.map(dev => (dev._id)));
  console.log(projectIds,developerIds)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandle = async (data) => {
    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("type", data.type);
      formData.append("priority", data.priority);
      formData.append("expectedResult", data.expectedResult);
      formData.append("dueDate", data.dueDate);
      formData.append("reportedBy", data.reportedBy);
      formData.append("assignedDeveloper", projects[0]?.assignedDevelopers[1]?._id);
      formData.append("projectId", projects[0]?._id);


      formData.append("image", data.image[0]);
      console.log(data)
      const res = await axios.post("/bug/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 201) {
        toast.success("Bug Created Successfully!");
        navigate(-1);
        console.log(res)
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to create bug");
    }
  };

  const getProjectTOTester = async () => {
    try{
      const res = await axios.get(`project/tester/${userId}`)
      console.log(res.data.data)
      setProjects(res.data.data)
    }catch(err){
      console.log(err)
    }
  }

  const fetchAllReported = async () => {
    try {
      const report = await axios.get("/user/tester");
      setReported(report.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAllReported();
    getProjectTOTester();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8 bg-white border-l-4 border-amber-400 pl-5 pr-4 py-4 shadow-sm">
          <p className="text-xs font-mono text-amber-500 uppercase tracking-widest mb-1">Bug Tracker</p>
          <h1 className="text-2xl font-mono font-bold text-slate-800">Create Bug</h1>
        </div>

        <form onSubmit={handleSubmit(submitHandle)} className="space-y-4">

          {/* Bug Title */}
          <div className="bg-sky-50 border border-sky-200 border-l-4 border-l-sky-500 p-5 hover:bg-sky-100 hover:border-l-sky-600">
            <label className="block text-xs font-mono text-sky-600 uppercase tracking-widest mb-2">
              Bug Title
            </label>
            <input
              type="text"
              {...register("title", { required: "Bug title is required" })}
              className="w-full bg-white border border-sky-200 px-3 py-2 font-mono text-sm text-slate-700 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
            />
            {errors.title && (
              <p className="text-red-500 font-mono text-xs mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="bg-orange-50 border border-orange-200 border-l-4 border-l-orange-500 p-5 hover:bg-orange-100 hover:border-l-orange-600">
            <label className="block text-xs font-mono text-orange-600 uppercase tracking-widest mb-2">
              Description
            </label>
            <textarea
              rows={3}
              {...register("description", { required: "Description is required" })}
              className="w-full bg-white border border-orange-200 px-3 py-2 font-mono text-sm text-slate-700 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 resize-none"
            />
            {errors.description && (
              <p className="text-red-500 font-mono text-xs mt-1">{errors.description.message}</p>
            )}
          </div>


          {/* Expected Result */}
          <div className="bg-emerald-50 border border-emerald-200 border-l-4 border-l-emerald-500 p-5 hover:bg-emerald-100 hover:border-l-emerald-600">
            <label className="block text-xs font-mono text-emerald-600 uppercase tracking-widest mb-2">
              Expected Result
            </label>
            <input
              type="text"
              placeholder="Expected results"
              {...register("expectedResult", { required: "Expected result is required" })}
              className="w-full bg-white border border-emerald-200 px-3 py-2 font-mono text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
            />
            {errors.expectedResult && (
              <p className="text-red-500 font-mono text-xs mt-1">{errors.expectedResult.message}</p>
            )}
          </div>

          {/* Image Upload */}
          <div className="bg-slate-50 border border-slate-200 border-l-4 border-l-slate-400 p-5 hover:bg-slate-100 hover:border-l-slate-500">
            <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
              Screenshot / Image
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("image", { required: "Image is required" })}
              className="w-full bg-white border border-slate-200 px-3 py-2 font-mono text-sm text-slate-600 file:mr-3 file:py-1 file:px-3 file:border file:border-slate-300 file:bg-slate-100 file:font-mono file:text-xs file:text-slate-600 file:uppercase file:tracking-widest hover:file:bg-slate-200"
            />
            {errors.image && (
              <p className="text-red-500 font-mono text-xs mt-1">{errors.image.message}</p>
            )}
          </div>

          <input type="hidden" {...register('projectId')} defaultValue={projectIds} />
          
          <input type="hidden" {...register('assignedDeveloper')} value={developerIds} />

          <input type="hidden" {...register('reportedBy')} value={userId} />

          {/* Component & Priority & Due Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <div className="bg-violet-50 border border-violet-200 border-l-4 border-l-violet-500 p-5 hover:bg-violet-100 hover:border-l-violet-600">
              <label className="block text-xs font-mono text-violet-600 uppercase tracking-widest mb-2">
                Component
              </label>
              <select
                {...register("type", { required: "Component type is required" })}
                className="w-full bg-white border border-violet-200 px-3 py-2 font-mono text-sm text-slate-700 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-200"
              >
                <option value="">Select</option>
                <option value="UI based">UI Based</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="API">API</option>
              </select>
              {errors.type && (
                <p className="text-red-500 font-mono text-xs mt-1">{errors.type.message}</p>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-200 border-l-4 border-l-amber-500 p-5 hover:bg-amber-100 hover:border-l-amber-600">
              <label className="block text-xs font-mono text-amber-600 uppercase tracking-widest mb-2">
                Priority
              </label>
              <select
                {...register("priority", { required: "Priority is required" })}
                className="w-full bg-white border border-amber-200 px-3 py-2 font-mono text-sm text-slate-700 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-200"
              >
                <option value=""></option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              {errors.priority && (
                <p className="text-red-500 font-mono text-xs mt-1">{errors.priority.message}</p>
              )}
            </div>

            <div className="bg-orange-50 border border-orange-200 border-l-4 border-l-orange-500 p-5 hover:bg-orange-100 hover:border-l-orange-600">
              <label className="block text-xs font-mono text-orange-600 uppercase tracking-widest mb-2">
                Due Date
              </label>
              <input
                type="date"
                {...register("dueDate", { required: "Due date is required" })}
                className="w-full bg-white border border-orange-200 px-3 py-2 font-mono text-sm text-slate-700 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200"
              />
              {errors.dueDate && (
                <p className="text-red-500 font-mono text-xs mt-1">{errors.dueDate.message}</p>
              )}
            </div>

          </div>

          {/* Assign Developers */}
          {/* <div className="bg-rose-50 border border-rose-200 border-l-4 border-l-rose-500 p-5 hover:bg-rose-100 hover:border-l-rose-600">
            <label className="block text-xs font-mono text-rose-600 uppercase tracking-widest mb-3">
              Assign Developers
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {developer.map((dev) => (
                <label
                  key={dev._id}
                  className="flex items-center gap-2 bg-white border border-rose-200 px-3 py-2 cursor-pointer hover:bg-rose-50 hover:border-rose-400"
                >
                  <input
                    type="checkbox"
                    value={dev._id}
                    {...register("assigned")}
                    className="accent-rose-500 w-4 h-4"
                  />
                  <span className="font-mono text-sm text-slate-700">{dev.name}</span>
                </label>
              ))}
            </div>
          </div> */}

          {/* Divider */}
          <div className="flex items-center gap-3 py-2">
            <div className="h-px flex-1 bg-slate-300" />
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Actions</span>
            <div className="h-px flex-1 bg-slate-300" />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-3 bg-amber-400 text-slate-900 font-mono text-xs uppercase tracking-widest font-bold border border-amber-300 border-l-4 border-l-amber-600 hover:bg-amber-500 hover:border-l-amber-700"
            >
              Submit Bug
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
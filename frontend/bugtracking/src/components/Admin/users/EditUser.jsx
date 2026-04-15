import axios from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  FiAlertCircle,
  FiArrowLeft,
  FiCamera,
  FiCheckCircle,
  FiImage,
  FiMail, FiPhone,
  FiSave,
  FiShield,
  FiUser
} from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'
import { getCanonicalRole } from '../../../utils/roles'
import { motion } from 'framer-motion'

// ── FIELD CONFIG ──
const FIELD_CONFIG = [
  { key: 'image', type: 'image', label: 'Profile Image', icon: <FiImage />, color: 'text-pink-400', bg: 'bg-pink-500/15' },
  { key: 'name', type: 'text', label: 'Full Name', placeholder: 'Enter full name', icon: <FiUser />, color: 'text-cyan-400', bg: 'bg-cyan-500/15', rules: { required: 'Name is required' } },
  { key: 'email', type: 'email', label: 'Email Address', placeholder: 'Enter email address', icon: <FiMail />, color: 'text-violet-400', bg: 'bg-violet-500/15', rules: { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email format' } } },
  { key: 'mobileno', type: 'tel', label: 'Mobile Number', placeholder: 'Enter mobile number', icon: <FiPhone />, color: 'text-emerald-400', bg: 'bg-emerald-500/15', rules: { required: 'Mobile number is required', pattern: { value: /^[0-9]{10}$/, message: 'Must be 10 digits' } } },
  { key: 'role', type: 'select', label: 'Role', icon: <FiShield />, color: 'text-amber-400', bg: 'bg-amber-500/15', rules: { required: 'Role is required' }, options: [ { value: '', label: 'Select a role' }, { value: 'Admin', label: 'Admin' }, { value: 'ProjectManager', label: 'Project Manager' }, { value: 'Developer', label: 'Developer' }, { value: 'Tester', label: 'Tester' } ] },
  { key: 'isActive', type: 'select', label: 'Account Status', icon: <FiCheckCircle />, color: 'text-emerald-400', bg: 'bg-emerald-500/15', options: [ { value: 'true', label: 'Active' }, { value: 'false', label: 'Inactive' } ] },
]

export const EditUser = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm()
  const { id } = useParams()
  const navigate = useNavigate()

  const watchedImage = watch('image')

  useEffect(() => {
    if (watchedImage && (watchedImage instanceof FileList) && watchedImage.length > 0) {
      const file = watchedImage[0]
      if (file instanceof File) {
        try {
          const url = URL.createObjectURL(file)
          setImagePreview(url)
          return () => { if (url?.startsWith('blob:')) URL.revokeObjectURL(url) }
        } catch (e) { console.error('Error creating object URL:', e); setImagePreview(null) }
      }
    } else if (!watchedImage || watchedImage.length === 0) {
      setImagePreview(user?.image || null)
    }
  }, [watchedImage, user?.image])

  const getData = async () => {
    try {
      setLoading(true); setError(null)
      const res = await axios.get(`/user/details/${id}`)
      const data = res.data.data
      setUser(data)
      setImagePreview(data.image || null)
      const { image, ...formData } = data
      reset({ ...formData, role: getCanonicalRole(data.role), isActive: data.isActive ? 'true' : 'false' })
    } catch (err) { setError('Failed to load user data.'); console.error(err) }
    finally { setLoading(false) }
  }

  const submitHandle = async (data) => {
    try {
      setSaving(true); setError(null); setSuccess(false)
      const formData = new FormData()
      formData.append('isActive', data.isActive === 'true')
      Object.keys(data).forEach(key => {
        if (key === 'role') formData.append(key, getCanonicalRole(data[key]))
        else if (key !== 'image' && key !== 'isActive') formData.append(key, data[key])
      })
      if (data.image?.[0]) formData.append('image', data.image[0])
      const res = await axios.put(`/user/update/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      console.log('Update response:', res.data)
      navigate(-1)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) { setError('Failed to update user.'); console.error(err) }
    finally { setSaving(false) }
  }

  useEffect(() => { if (id) getData() }, [id])

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <div className="w-10 h-10 border-3 border-white/10 border-t-cyan-500 rounded-full animate-spin" />
      <p className="text-sm text-slate-500">Loading user data...</p>
    </div>
  )

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-5">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-white transition-colors">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.06]"><FiArrowLeft /></span>
        Back
      </button>

      <div className="glass overflow-hidden">
        {/* Banner */}
        <div className="h-20 bg-gradient-to-br from-cyan-500/30 via-blue-500/20 to-violet-500/30 relative">
          <div className="absolute inset-0 flex items-center px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm text-white text-lg"><FiUser /></div>
              <div>
                <h1 className="text-lg font-extrabold text-white leading-tight">Edit User</h1>
                <p className="text-xs text-white/50 mt-0.5">Update profile information</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          {success && (
            <div className="flex items-center gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 mb-5">
              <FiCheckCircle className="text-emerald-400 shrink-0" />
              <p className="text-sm font-semibold text-emerald-400">User updated successfully!</p>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 mb-5">
              <FiAlertCircle className="text-red-400 shrink-0" />
              <p className="text-sm font-semibold text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(submitHandle)} className="space-y-6">
            {FIELD_CONFIG.map((field) => (
              <FormField key={field.key} icon={field.icon} label={field.label} color={field.color} bg={field.bg} error={errors[field.key]}>
                <FieldRenderer field={field} register={register} errors={errors} user={user} imagePreview={imagePreview} setImagePreview={setImagePreview} />
              </FormField>
            ))}

            <div className="pt-2">
              <button type="submit" disabled={saving} className="btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60">
                {saving ? (<><div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Saving...</>) : (<><FiSave /> Save Changes</>)}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  )
}

const FieldRenderer = ({ field, register, errors, user, imagePreview, setImagePreview }) => {
  if (field.type === 'image') {
    return (
      <div className="flex items-center gap-6">
        <div className="relative shrink-0">
          <div className="h-24 w-24 rounded-2xl overflow-hidden border-2 border-white/[0.08] shadow-lg bg-white/[0.04]">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" onError={() => setImagePreview(null)} />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500 to-violet-600 text-white text-3xl font-bold">
                {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
              </div>
            )}
          </div>
          <div className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white text-sm shadow-md"><FiCamera /></div>
        </div>
        <div className="flex-1">
          <input type="file" accept="image/*" {...register('image')}
            className="input-dark file:mr-3 file:py-1.5 file:px-4 file:border-0 file:bg-pink-500/20 file:text-pink-400 file:font-bold file:text-[10px] file:uppercase file:tracking-widest file:rounded-lg file:cursor-pointer hover:file:bg-pink-500/30" />
          <p className="mt-1.5 text-[10px] text-slate-600 pl-1">JPG, PNG or WEBP · Max 2MB</p>
        </div>
      </div>
    )
  }
  if (field.type === 'select') {
    return (
      <select {...register(field.key, field.rules)} className={`input-dark ${errors[field.key] ? 'border-red-500/40' : ''}`}>
        {field.options.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
      </select>
    )
  }
  return (
    <input type={field.type} placeholder={field.placeholder} {...register(field.key, field.rules)} className={`input-dark ${errors[field.key] ? 'border-red-500/40' : ''}`} />
  )
}

const FormField = ({ icon, label, color, bg, error, children }) => (
  <div className="space-y-1.5">
    <div className="flex items-center gap-2">
      <div className={`flex h-6 w-6 items-center justify-center rounded-lg ${bg} ${color} text-xs`}>{icon}</div>
      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</label>
    </div>
    {children}
    {error && (
      <p className="flex items-center gap-1.5 text-[11px] font-semibold text-red-400 pl-1">
        <FiAlertCircle className="text-[10px]" /> {error.message}
      </p>
    )}
  </div>
)

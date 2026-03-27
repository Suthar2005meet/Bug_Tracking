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

// ── FIELD CONFIG ──────────────────────────────────────────────────────────────
// Central registry of all form fields. Add / remove / reorder here.
const FIELD_CONFIG = [
  {
    key: 'image',
    type: 'image',
    label: 'Profile Image',
    icon: <FiImage />,
    gradient: 'from-pink-500 to-rose-400',
    shadow: 'shadow-pink-200',
  },
  {
    key: 'name',
    type: 'text',
    label: 'Full Name',
    placeholder: 'Enter full name',
    icon: <FiUser />,
    gradient: 'from-sky-400 to-cyan-400',
    shadow: 'shadow-sky-200',
    focusColor: 'focus:border-sky-400 focus:ring-sky-100',
    rules: { required: 'Name is required' },
  },
  {
    key: 'email',
    type: 'email',
    label: 'Email Address',
    placeholder: 'Enter email address',
    icon: <FiMail />,
    gradient: 'from-violet-500 to-purple-400',
    shadow: 'shadow-violet-200',
    focusColor: 'focus:border-violet-400 focus:ring-violet-100',
    rules: {
      required: 'Email is required',
      pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email format' },
    },
  },
  {
    key: 'mobileno',
    type: 'tel',
    label: 'Mobile Number',
    placeholder: 'Enter mobile number',
    icon: <FiPhone />,
    gradient: 'from-emerald-500 to-teal-400',
    shadow: 'shadow-emerald-200',
    focusColor: 'focus:border-emerald-400 focus:ring-emerald-100',
    rules: {
      required: 'Mobile number is required',
      pattern: { value: /^[0-9]{10}$/, message: 'Must be 10 digits' },
    },
  },
  {
    key: 'role',
    type: 'select',
    label: 'Role',
    icon: <FiShield />,
    gradient: 'from-amber-400 to-orange-400',
    shadow: 'shadow-amber-200',
    focusColor: 'focus:border-amber-400 focus:ring-amber-100',
    rules: { required: 'Role is required' },
    options: [
      { value: '', label: 'Select a role' },
      { value: 'admin', label: 'Admin' },
      { value: 'ProjectManager', label: 'Project Manager' },
      { value: 'Developer', label: 'Developer' },
      { value: 'Tester', label: 'Tester' },
    ],
  },
  {
    key: 'isActive',
    type: 'select',
    label: 'Account Status',
    icon: <FiCheckCircle />,
    gradient: 'from-teal-400 to-green-400',
    shadow: 'shadow-teal-200',
    focusColor: 'focus:border-teal-400 focus:ring-teal-100',
    options: [
      { value: 'true', label: 'Active' },
      { value: 'false', label: 'Inactive' },
    ],
  },
]

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export const EditUser = () => {

  const [user, setUser]                 = useState(null)
  const [loading, setLoading]           = useState(true)
  const [saving, setSaving]             = useState(false)
  const [success, setSuccess]           = useState(false)
  const [error, setError]               = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm()
  const { id }   = useParams()
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
        } catch (e) {
          console.error('Error creating object URL:', e)
          setImagePreview(null)
        }
      }
    } else if (!watchedImage || watchedImage.length === 0) {
      setImagePreview(user?.image || null)
    }
  }, [watchedImage, user?.image])

  const getData = async () => {
    try {
      setLoading(true)
      setError(null)
      const res  = await axios.get(`/user/details/${id}`)
      const data = res.data.data
      setUser(data)
      setImagePreview(data.image || null)
      const { image, ...formData } = data
      reset({ ...formData, isActive: data.isActive ? 'true' : 'false' })
    } catch (err) {
      setError('Failed to load user data.')
      console.error('Error fetching user data:', err)
    } finally {
      setLoading(false)
    }
  }

  const submitHandle = async (data) => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(false)

      const formData = new FormData()
      formData.append('isActive', data.isActive === 'true')
      Object.keys(data).forEach(key => {
        if (key !== 'image' && key !== 'isActive') formData.append(key, data[key])
      })
      if (data.image?.[0]) formData.append('image', data.image[0])

      const res = await axios.put(`/user/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      console.log('Update response:', res.data)
      navigate(-1)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError('Failed to update user. Please try again.')
      console.error('Error updating user:', err)
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => { if (id) getData() }, [id])

  // ── LOADING ──
  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink-500 border-r-orange-400 animate-spin" />
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-sky-500 border-l-violet-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
      </div>
      <p className="text-sm font-semibold text-slate-500 tracking-wide">Loading user data...</p>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* ── BACK ── */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors duration-150"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
          <FiArrowLeft />
        </span>
        Back
      </button>

      <div className="rounded-3xl overflow-hidden shadow-lg">

        {/* ── GRADIENT BANNER ── */}
        <div className="h-24 bg-gradient-to-br from-sky-400 via-blue-500 to-violet-500 relative">
          <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10" />
          <div className="absolute top-3 right-20 h-12 w-12 rounded-full bg-white/10" />
          <div className="absolute bottom-0 left-1/4 h-14 w-14 rounded-full bg-white/10" />
          <div className="absolute inset-0 flex items-center px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-white text-lg">
                <FiUser />
              </div>
              <div>
                <h1 className="text-lg font-black text-white leading-tight">Edit User</h1>
                <p className="text-xs text-blue-100/80 mt-0.5">Update profile information</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white px-6 py-6">

          {/* Toasts */}
          {success && (
            <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 mb-5">
              <FiCheckCircle className="text-emerald-500 text-base shrink-0" />
              <p className="text-sm font-semibold text-emerald-700">User updated successfully!</p>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-3 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 mb-5">
              <FiAlertCircle className="text-red-400 text-base shrink-0" />
              <p className="text-sm font-semibold text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(submitHandle)} className="space-y-4">

            {/* ── DYNAMIC FIELDS ── */}
            {FIELD_CONFIG.map((field) => (
              <FormField
                key={field.key}
                icon={field.icon}
                label={field.label}
                gradient={field.gradient}
                shadow={field.shadow}
                error={errors[field.key]}
              >
                <FieldRenderer
                  field={field}
                  register={register}
                  errors={errors}
                  user={user}
                  imagePreview={imagePreview}
                  setImagePreview={setImagePreview}
                />
              </FormField>
            ))}

            {/* ── SUBMIT ── */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-500 to-violet-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
              >
                {saving ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Saving changes...
                  </>
                ) : (
                  <>
                    <FiSave className="text-base" />
                    Save Changes
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

// ── FIELD RENDERER ────────────────────────────────────────────────────────────
// Decides which input element to render based on field.type
const FieldRenderer = ({ field, register, errors, user, imagePreview, setImagePreview }) => {

  if (field.type === 'image') {
    return (
      <div className="flex items-center gap-6">

        {/* Avatar preview — made bigger */}
        <div className="relative shrink-0">
          <div className="h-28 w-28 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-md bg-slate-100">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-full w-full object-cover"
                onError={() => setImagePreview(null)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-400 to-blue-500 text-white text-4xl font-black">
                {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
              </div>
            )}
          </div>
          {/* Camera badge */}
          <div className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-400 text-white text-sm shadow-md">
            <FiCamera />
          </div>
        </div>

        {/* File input */}
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            {...register('image')}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 font-medium outline-none cursor-pointer
              file:mr-3 file:rounded-lg file:border-0 file:bg-pink-50 file:px-3 file:py-1 file:text-xs file:font-bold file:text-pink-600
              hover:file:bg-pink-100 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all duration-150"
          />
          <p className="mt-1.5 text-[10px] text-slate-400 font-medium pl-1">
            JPG, PNG or WEBP · Max 2MB · Changes preview instantly
          </p>
        </div>
      </div>
    )
  }

  if (field.type === 'select') {
    return (
      <select
        {...register(field.key, field.rules)}
        className={selectClass(errors[field.key], field.focusColor)}
      >
        {field.options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    )
  }

  // Default: text / email / tel
  return (
    <input
      type={field.type}
      placeholder={field.placeholder}
      {...register(field.key, field.rules)}
      className={inputClass(errors[field.key], field.focusColor)}
    />
  )
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
const inputClass = (error, focusClass) =>
  `w-full rounded-xl border px-4 py-2.5 text-sm text-slate-700 font-medium outline-none transition-all duration-150 placeholder:text-slate-300
  ${error
    ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100'
    : `border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 ${focusClass}`
  }`

const selectClass = (error, focusClass) =>
  `w-full rounded-xl border px-4 py-2.5 text-sm text-slate-700 font-medium outline-none transition-all duration-150 bg-slate-50 cursor-pointer
  ${error
    ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
    : `border-slate-200 focus:bg-white focus:ring-2 ${focusClass}`
  }`

// ── REUSABLE FORM FIELD ───────────────────────────────────────────────────────
const FormField = ({ icon, label, gradient, shadow, error, children }) => (
  <div className="space-y-1.5">
    <div className="flex items-center gap-2">
      <div className={`flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} text-white text-xs shadow-sm ${shadow}`}>
        {icon}
      </div>
      <label className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</label>
    </div>
    {children}
    {error && (
      <p className="flex items-center gap-1.5 text-[11px] font-semibold text-red-500 pl-1">
        <FiAlertCircle className="text-[10px]" /> {error.message}
      </p>
    )}
  </div>
)
    import axios from 'axios'
    import { useEffect, useState } from 'react'
    import { useForm } from 'react-hook-form'
    import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

    const devPalette = [
    { bg: '#eef2ff', border: '#c7d2fe', text: '#3730a3', av: '#c7d2fe', avt: '#3730a3' },
    { bg: '#fdf4ff', border: '#e9d5ff', text: '#6b21a8', av: '#e9d5ff', avt: '#6b21a8' },
    { bg: '#fff7ed', border: '#fed7aa', text: '#9a3412', av: '#fed7aa', avt: '#9a3412' },
    { bg: '#fdf2f8', border: '#fbcfe8', text: '#9d174d', av: '#fbcfe8', avt: '#9d174d' },
    { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8', av: '#bfdbfe', avt: '#1d4ed8' },
    { bg: '#fefce8', border: '#fde68a', text: '#854d0e', av: '#fde68a', avt: '#854d0e' },
    { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534', av: '#bbf7d0', avt: '#166534' },
    { bg: '#fff1f2', border: '#fecdd3', text: '#9f1239', av: '#fecdd3', avt: '#9f1239' },
    ]

    const testPalette = [
    { bg: '#ecfdf5', border: '#a7f3d0', text: '#065f46', av: '#a7f3d0', avt: '#065f46' },
    { bg: '#ecfeff', border: '#a5f3fc', text: '#164e63', av: '#a5f3fc', avt: '#164e63' },
    { bg: '#f0fdf4', border: '#bbf7d0', text: '#14532d', av: '#bbf7d0', avt: '#14532d' },
    { bg: '#f7fee7', border: '#d9f99d', text: '#365314', av: '#d9f99d', avt: '#365314' },
    { bg: '#cffafe', border: '#67e8f9', text: '#0e7490', av: '#67e8f9', avt: '#0e7490' },
    { bg: '#ecfdf5', border: '#6ee7b7', text: '#064e3b', av: '#6ee7b7', avt: '#064e3b' },
    ]

    const getInitials = (name = '') =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

    const MemberCard = ({ person, palette, index, selectedList, setSelectedList }) => {
    const p = palette[index % palette.length]
    const isSelected = selectedList.includes(person._id)

    const toggle = () => {
        setSelectedList(prev =>
        prev.includes(person._id)
            ? prev.filter(id => id !== person._id)
            : [...prev, person._id]
        )
    }

    return (
        <label
        style={{
            borderColor: isSelected ? p.border : '#f1f5f9',
            background: isSelected ? p.bg : '#fff',
        }}
        className="flex items-center gap-3 p-3 rounded-xl border-[1.5px] cursor-pointer
                    transition-all duration-150 mb-2 hover:-translate-y-px select-none"
        >
        {/* Avatar */}
        <div
            style={{ background: p.av, color: p.avt }}
            className="w-9 h-9 rounded-full flex items-center justify-center
                    text-xs font-bold flex-shrink-0"
        >
            {getInitials(person.name)}
        </div>

        {/* Name & Email */}
        <div className="flex-1 min-w-0">
            <p
            style={{ color: isSelected ? p.text : '#374151' }}
            className={`text-sm truncate ${isSelected ? 'font-bold' : 'font-semibold'}`}
            >
            {person.name}
            </p>
            {person.email && (
            <p className="text-xs text-gray-400 truncate">{person.email}</p>
            )}
        </div>

        {/* Tick */}
        <div
            style={{
            background: isSelected ? p.av : 'transparent',
            borderColor: isSelected ? p.avt : '#d1d5db',
            }}
            className="w-5 h-5 rounded-full border-[1.5px] flex items-center
                    justify-center flex-shrink-0 ml-auto transition-all"
        >
            {isSelected && (
            <svg width="11" height="11" fill="none" viewBox="0 0 24 24"
                stroke={p.avt} strokeWidth="3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            )}
        </div>

        {/* ✅ Fixed: onChange only, no onClick on label */}
        <input
            type="checkbox"
            checked={isSelected}
            onChange={toggle}
            className="sr-only"
        />
        </label>
    )
    }

    export const AssignProject = () => {
    const [developer, setDeveloper] = useState([])
    const [tester, setTester] = useState([])
    const [project, setProject] = useState(null)
    const [devSearch, setDevSearch] = useState('')
    const [testerSearch, setTesterSearch] = useState('')
    const [selectedDevs, setSelectedDevs] = useState([])
    const [selectedTesters, setSelectedTesters] = useState([])
    const navigate = useNavigate()

    // ✅ Fixed: using setValue to sync state with react-hook-form
    const { handleSubmit, setValue } = useForm()
    const { id } = useParams()

    const getData = async () => {
        try {
        const res = await axios.get(`/project/details/${id}`)
        setProject(res.data.data)
        } catch (err) { console.log(err) }
    }

    const fetchAllDeveloper = async () => {
        try {
        const res = await axios.get('/user/developer')
        setDeveloper(res.data.data)
        } catch (err) { console.log(err) }
    }

    const fetchAllTester = async () => {
        try {
        const res = await axios.get('/user/tester')
        setTester(res.data.data)
        } catch (err) { console.log(err) }
    }

    const submitHandle = async (data) => {
        try {
        await axios.put(`/project/update/${id}`, data)
        navigate(-1)
        toast.success("Assign Member Successfully")
        } catch (err) { console.log(err) }
    }

    useEffect(() => {
        fetchAllDeveloper()
        fetchAllTester()
        getData()
    }, [])

    // ✅ Fixed: syncing selectedDevs into react-hook-form on every change
    const handleDevToggle = (updater) => {
        setSelectedDevs(prev => {
        const next = typeof updater === 'function' ? updater(prev) : updater
        setValue('assignedMembers', next)
        return next
        })
    }

    // ✅ Fixed: syncing selectedTesters into react-hook-form on every change
    const handleTesterToggle = (updater) => {
        setSelectedTesters(prev => {
        const next = typeof updater === 'function' ? updater(prev) : updater
        setValue('assignedTester', next)
        return next
        })
    }

    const filteredDevs = developer.filter(d =>
        d.name.toLowerCase().includes(devSearch.toLowerCase())
    )
    const filteredTesters = tester.filter(t =>
        t.name.toLowerCase().includes(testerSearch.toLowerCase())
    )

    return (
        <div className="min-h-screen p-6" style={{ background: '#f8f7ff' }}>
        <div className="max-w-5xl mx-auto">

            {/* Header */}
            <div className="mb-7">
            <p className="text-xs font-bold tracking-widest text-indigo-400 uppercase mb-1">
                Project Management
            </p>
            <h1 className="text-2xl font-bold text-indigo-950">Assign Project</h1>
            </div>

            <form onSubmit={handleSubmit(submitHandle)} className="space-y-5">

            {/* Project Banner */}
            <div className="flex items-center gap-4 bg-white border-[1.5px]
                            border-gray-200 rounded-2xl p-4">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center
                                justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586
                        a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                </div>
                <div className="flex-1">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">
                    Project
                </p>
                <p className="text-sm font-bold text-gray-800">
                    {project?.projectName ?? (
                    <span className="text-gray-300 animate-pulse">Loading...</span>
                    )}
                </p>
                </div>
                <div className="flex gap-2">
                {selectedDevs.length > 0 && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full
                                    bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {selectedDevs.length} dev{selectedDevs.length > 1 ? 's' : ''}
                    </span>
                )}
                {selectedTesters.length > 0 && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full
                                    bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {selectedTesters.length} tester{selectedTesters.length > 1 ? 's' : ''}
                    </span>
                )}
                </div>
            </div>

            {/* Two Panel Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* ── Developers Panel ── */}
                <div className="bg-white border-[1.5px] border-gray-200 rounded-2xl overflow-hidden">
                <div className="px-4 pt-4 pb-3 border-b border-violet-100"
                    style={{ background: '#f5f3ff' }}>
                    <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24"
                            stroke="#fff" strokeWidth={2.5}>
                            <polyline points="16 18 22 12 16 6" />
                            <polyline points="8 6 2 12 8 18" />
                        </svg>
                        </div>
                        <span className="text-sm font-bold text-indigo-900">Developers</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full
                                        bg-indigo-200 text-indigo-800">
                        {filteredDevs.length}
                        </span>
                    </div>
                    {selectedDevs.length > 0 && (
                        <button
                        type="button"
                        onClick={() => {
                            setSelectedDevs([])
                            setValue('assignedMembers', [])
                        }}
                        className="text-xs font-semibold text-indigo-300
                                    hover:text-red-400 transition-colors"
                        >
                        Clear all
                        </button>
                    )}
                    </div>
                    <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5
                                    text-indigo-300" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" strokeWidth={2}>
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search developers..."
                        value={devSearch}
                        onChange={e => setDevSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm bg-white border-[1.5px]
                                border-violet-200 rounded-xl focus:outline-none
                                focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300
                                placeholder:text-indigo-200 text-gray-700"
                    />
                    </div>
                </div>
                <div className="p-3 overflow-y-auto max-h-80">
                    {filteredDevs.length === 0
                    ? <p className="text-center text-gray-400 text-sm py-8">
                        No developers found
                        </p>
                    : filteredDevs.map((dev, i) => (
                        <MemberCard
                        key={dev._id}
                        person={dev}
                        palette={devPalette}
                        index={i}
                        selectedList={selectedDevs}
                        setSelectedList={handleDevToggle}
                        />
                    ))
                    }
                </div>
                </div>

                {/* ── Testers Panel ── */}
                <div className="bg-white border-[1.5px] border-gray-200 rounded-2xl overflow-hidden">
                <div className="px-4 pt-4 pb-3 border-b border-emerald-100"
                    style={{ background: '#ecfdf5' }}>
                    <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24"
                            stroke="#fff" strokeWidth={2.5}>
                            <path d="M9 3h6m-6 0v7l-4 8a1 1 0 0 0 .9 1.45h12.2
                                    A1 1 0 0 0 19 18l-4-8V3" />
                        </svg>
                        </div>
                        <span className="text-sm font-bold text-emerald-900">Testers</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full
                                        bg-emerald-200 text-emerald-800">
                        {filteredTesters.length}
                        </span>
                    </div>
                    {selectedTesters.length > 0 && (
                        <button
                        type="button"
                        onClick={() => {
                            setSelectedTesters([])
                            setValue('assignedTester', [])
                        }}
                        className="text-xs font-semibold text-emerald-300
                                    hover:text-red-400 transition-colors"
                        >
                        Clear all
                        </button>
                    )}
                    </div>
                    <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5
                                    text-emerald-300" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" strokeWidth={2}>
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search testers..."
                        value={testerSearch}
                        onChange={e => setTesterSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm bg-white border-[1.5px]
                                border-emerald-200 rounded-xl focus:outline-none
                                focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300
                                placeholder:text-emerald-200 text-gray-700"
                    />
                    </div>
                </div>
                <div className="p-3 overflow-y-auto max-h-80">
                    {filteredTesters.length === 0
                    ? <p className="text-center text-gray-400 text-sm py-8">
                        No testers found
                        </p>
                    : filteredTesters.map((test, i) => (
                        <MemberCard
                        key={test._id}
                        person={test}
                        palette={testPalette}
                        index={i}
                        selectedList={selectedTesters}
                        setSelectedList={handleTesterToggle}
                        />
                    ))
                    }
                </div>
                </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-1">
                <button
                type="submit"
                disabled={selectedDevs.length === 0 && selectedTesters.length === 0}
                className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold
                            text-white disabled:opacity-40 disabled:cursor-not-allowed
                            active:scale-95 transition-all"
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
                >
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24"
                    stroke="#fff" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Save Assignments
                </button>
            </div>

            </form>
        </div>
        </div>
    )
    }
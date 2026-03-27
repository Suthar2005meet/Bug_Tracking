    import axios from 'axios'
    import { useEffect, useState } from 'react'
    import { useForm } from 'react-hook-form'
    import { useParams } from 'react-router-dom'

    export const AssignProject = () => {
    const [developer, setDeveloper] = useState([])
    const [tester, setTester] = useState([])
    const [project, setProject] = useState(null)
    const [devSearch, setDevSearch] = useState('')
    const [testerSearch, setTesterSearch] = useState('')
    const [selectedDevs, setSelectedDevs] = useState([])
    const [selectedTesters, setSelectedTesters] = useState([])
    const { register, handleSubmit, watch } = useForm()
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
        const res = await axios.put(`/project/update/${id}`, data)
        console.log(res)
        } catch (err) { console.log(err) }
    }

    useEffect(() => {
        fetchAllDeveloper()
        fetchAllTester()
        getData()
    }, [])

    const filteredDevs = developer.filter(d =>
        d.name.toLowerCase().includes(devSearch.toLowerCase())
    )
    const filteredTesters = tester.filter(t =>
        t.name.toLowerCase().includes(testerSearch.toLowerCase())
    )

    const getInitials = (name = '') =>
        name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

    // Avatar background colors cycling through soft hues
    const avatarColors = [
        'bg-violet-100 text-violet-700',
        'bg-sky-100 text-sky-700',
        'bg-emerald-100 text-emerald-700',
        'bg-rose-100 text-rose-700',
        'bg-amber-100 text-amber-700',
        'bg-cyan-100 text-cyan-700',
        'bg-pink-100 text-pink-700',
        'bg-teal-100 text-teal-700',
    ]

    const MemberCard = ({ person, fieldName, selectedList, setSelectedList, colorIndex }) => {
        const isChecked = selectedList.includes(person._id)
        const color = avatarColors[colorIndex % avatarColors.length]

        const toggle = () => {
        setSelectedList(prev =>
            prev.includes(person._id)
            ? prev.filter(id => id !== person._id)
            : [...prev, person._id]
        )
        }

        return (
        <label
            onClick={toggle}
            className={`relative flex items-center gap-3 p-3 rounded-xl border cursor-pointer
            transition-all duration-150 select-none
            ${isChecked
                ? 'border-indigo-300 bg-indigo-50 shadow-sm shadow-indigo-100'
                : 'border-gray-200 bg-white hover:border-indigo-200 hover:bg-gray-50'
            }`}
        >
            {/* Avatar */}
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${color}`}>
            {getInitials(person.name)}
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${isChecked ? 'text-indigo-800' : 'text-gray-700'}`}>
                {person.name}
            </p>
            {person.email && (
                <p className="text-xs text-gray-400 truncate">{person.email}</p>
            )}
            </div>

            {/* Tick */}
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
            ${isChecked ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300 bg-white'}`}>
            {isChecked && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            )}
            </div>

            {/* Hidden input for react-hook-form */}
            <input
            type="checkbox"
            value={person._id}
            checked={isChecked}
            onChange={() => {}}
            {...register(fieldName)}
            className="sr-only"
            />
        </label>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 p-6">
        <div className="max-w-5xl mx-auto">

            {/* Page Header */}
            <div className="mb-8">
            <p className="text-xs font-semibold tracking-widest text-indigo-500 uppercase mb-1">
                Project Management
            </p>
            <h1 className="text-2xl font-bold text-gray-900">Assign Project</h1>
            </div>

            <form onSubmit={handleSubmit(submitHandle)} className="space-y-6">

            {/* Project Info Banner */}
            <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                </div>
                <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-0.5">Project Name</p>
                <p className="text-base font-semibold text-gray-800">
                    {project?.projectName ?? (
                    <span className="text-gray-300 animate-pulse">Loading project...</span>
                    )}
                </p>
                </div>
                <div className="ml-auto flex gap-2 text-sm text-gray-500">
                {selectedDevs.length > 0 && (
                    <span className="bg-indigo-50 text-indigo-600 font-medium px-3 py-1 rounded-full text-xs border border-indigo-100">
                    {selectedDevs.length} dev{selectedDevs.length > 1 ? 's' : ''}
                    </span>
                )}
                {selectedTesters.length > 0 && (
                    <span className="bg-emerald-50 text-emerald-600 font-medium px-3 py-1 rounded-full text-xs border border-emerald-100">
                    {selectedTesters.length} tester{selectedTesters.length > 1 ? 's' : ''}
                    </span>
                )}
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Developers Panel */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                {/* Panel Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                        </svg>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Developers</span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {filteredDevs.length}
                    </span>
                    </div>
                    {selectedDevs.length > 0 && (
                    <button
                        type="button"
                        onClick={() => setSelectedDevs([])}
                        className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                    >
                        Clear
                    </button>
                    )}
                </div>

                {/* Search */}
                <div className="px-4 py-3 border-b border-gray-100">
                    <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search developers..."
                        value={devSearch}
                        onChange={e => setDevSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg
                                focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent
                                placeholder:text-gray-300 text-gray-700"
                    />
                    </div>
                </div>

                {/* Scrollable Cards Grid */}
                <div className="p-4 overflow-y-auto max-h-[420px] space-y-2
                                scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                    {filteredDevs.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 text-sm">No developers found</div>
                    ) : (
                    filteredDevs.map((dev, i) => (
                        <MemberCard
                        key={dev._id}
                        person={dev}
                        fieldName="assignedMembers"
                        selectedList={selectedDevs}
                        setSelectedList={setSelectedDevs}
                        colorIndex={i}
                        />
                    ))
                    )}
                </div>
                </div>

                {/* Testers Panel */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M9 3h6m-6 0v7l-4 8a1 1 0 0 0 .9 1.45h12.2A1 1 0 0 0 19 18l-4-8V3" />
                        </svg>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Testers</span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {filteredTesters.length}
                    </span>
                    </div>
                    {selectedTesters.length > 0 && (
                    <button
                        type="button"
                        onClick={() => setSelectedTesters([])}
                        className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                    >
                        Clear
                    </button>
                    )}
                </div>

                <div className="px-4 py-3 border-b border-gray-100">
                    <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search testers..."
                        value={testerSearch}
                        onChange={e => setTesterSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg
                                focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent
                                placeholder:text-gray-300 text-gray-700"
                    />
                    </div>
                </div>

                <div className="p-4 overflow-y-auto max-h-[420px] space-y-2">
                    {filteredTesters.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 text-sm">No testers found</div>
                    ) : (
                    filteredTesters.map((test, i) => (
                        <MemberCard
                        key={test._id}
                        person={test}
                        fieldName="assignedTester"
                        selectedList={selectedTesters}
                        setSelectedList={setSelectedTesters}
                        colorIndex={i + 3}
                        />
                    ))
                    )}
                </div>
                </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-2">
                <button
                type="submit"
                disabled={selectedDevs.length === 0 && selectedTesters.length === 0}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold
                            bg-indigo-600 hover:bg-indigo-700 text-white transition-colors
                            shadow-md shadow-indigo-200 disabled:opacity-40 disabled:cursor-not-allowed
                            active:scale-[0.98]"
                >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
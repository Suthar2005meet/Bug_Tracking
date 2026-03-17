import axios from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import bugimg from '../assets/bug.png'

/* ─── Floating particle component ─────────────────────────── */
const Particle = ({ style }) => (
  <span
    className="absolute rounded-full bg-white pointer-events-none animate-[rise_linear_infinite]"
    style={style}
  />
)

export const Login = () => {
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [particles, setParticles] = useState([])

  /* Generate particles once on mount */
  useEffect(() => {
    const list = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      width: `${2 + Math.random() * 3}px`,
      height: `${2 + Math.random() * 3}px`,
      opacity: 0.2 + Math.random() * 0.45,
      animationDuration: `${5 + Math.random() * 8}s`,
      animationDelay: `${Math.random() * 8}s`,
    }))
    setParticles(list)
  }, [])

  const submitHandle = async (data) => {
    setLoading(true)
    try {
      const res = await axios.post('/user/login', data)
      if (res.status === 201) {
        toast.success('Login Successfully 🎉')
        switch (res.data.role) {
          case 'admin':          navigate('/admin');          break
          case 'ProjectManager': navigate('/projectmanager'); break
          case 'Developer':      navigate('/developer');      break
          case 'Tester':         navigate('/tester');         break
          default:
            toast.error('Invalid Role')
            navigate('/')
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* ── keyframes injected once ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .login-root { font-family: 'Plus Jakarta Sans', sans-serif; }

        @keyframes rise {
          0%   { transform: translateY(0)      scale(0); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(-220px) scale(1.4); opacity: 0; }
        }
        @keyframes card-in {
          from { opacity: 0; transform: translateY(36px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes bug-float {
          0%,100% { transform: translateY(0)   rotate(-3deg); }
          50%      { transform: translateY(-16px) rotate(3deg);  }
        }
        @keyframes orb-drift {
          0%,100% { transform: translateY(0)   scale(1);    }
          50%      { transform: translateY(-28px) scale(1.08); }
        }
        @keyframes shimmer {
          0%   { left: -100%; }
          100% { left: 200%;  }
        }
        @keyframes fade-right {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
        @keyframes fade-left {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0);     }
        }

        .card-in        { animation: card-in   0.7s cubic-bezier(.22,1,.36,1) both; }
        .bug-float      { animation: bug-float 4s ease-in-out infinite; }
        .orb-drift      { animation: orb-drift 8s ease-in-out infinite; }
        .fade-right-1   { animation: fade-right 0.7s 0.20s both; }
        .fade-right-2   { animation: fade-right 0.7s 0.35s both; }
        .fade-right-3   { animation: fade-right 0.7s 0.55s both; }
        .fade-right-4   { animation: fade-right 0.7s 0.70s both; }
        .fade-left-1    { animation: fade-left  0.8s 0.30s both; }
        .fade-left-2    { animation: fade-left  0.8s 0.48s both; }

        .shimmer-btn::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 55%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.18), transparent);
          transform: skewX(-20deg);
          animation: shimmer 2.5s 1.5s infinite;
        }

        .input-glow:focus {
          border-color: #7c3aed !important;
          box-shadow: 0 0 0 3px rgba(124,58,237,.22);
        }
      `}</style>

      <div className="login-root min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)' }}>

        {/* ── Orbs ── */}
        <div className="orb-drift absolute -top-20 -left-20 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: '#7c3aed', filter: 'blur(72px)', opacity: 0.3 }} />
        <div className="orb-drift absolute -bottom-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: '#2563eb', filter: 'blur(72px)', opacity: 0.28, animationDelay: '3s' }} />
        <div className="orb-drift absolute top-1/2 right-12 w-44 h-44 rounded-full pointer-events-none"
          style={{ background: '#ec4899', filter: 'blur(60px)', opacity: 0.25, animationDelay: '1.5s' }} />

        {/* ── Particles ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map(p => (
            <Particle key={p.id} style={{
              left: p.left, bottom: 0,
              width: p.width, height: p.height,
              opacity: p.opacity,
              animationName: 'rise',
              animationDuration: p.animationDuration,
              animationDelay: p.animationDelay,
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
            }} />
          ))}
        </div>

        {/* ── Card ── */}
        <div className="card-in relative z-10 flex w-full max-w-4xl rounded-3xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,.05)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,.12)' }}>

          {/* ── Left panel ── */}
          <div className="hidden md:flex flex-col items-center justify-center gap-6 w-1/2 p-12"
            style={{ background: 'rgba(255,255,255,.03)', borderRight: '1px solid rgba(255,255,255,.08)' }}>

            <img src={bugimg} alt="Bug Tracking"
              className="bug-float w-36 fade-left-1 drop-shadow-2xl" />

            <div className="fade-left-1 text-center">
              <h1 className="text-2xl font-bold text-white leading-tight">Bug Tracker Pro</h1>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,.45)' }}>
                Squash bugs before they squash you.
              </p>
            </div>

            {/* stat pills */}
            <div className="fade-left-2 flex gap-3">
              {[['99.9%', 'Uptime'], ['4 Roles', 'Access'], ['Live', 'Tracking']].map(([val, lbl]) => (
                <div key={lbl} className="flex flex-col items-center px-4 py-2 rounded-2xl"
                  style={{ background: 'rgba(124,58,237,.18)', border: '1px solid rgba(167,139,250,.2)' }}>
                  <span className="text-sm font-bold" style={{ color: '#c4b5fd' }}>{val}</span>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,.4)' }}>{lbl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right form ── */}
          <div className="flex flex-col justify-center w-full md:w-1/2 p-10 gap-7">

            {/* header */}
            <div className="fade-right-1">
              <p className="text-xs font-semibold tracking-widest uppercase mb-1"
                style={{ color: '#a78bfa' }}>Welcome back</p>
              <h2 className="text-3xl font-bold text-white">Sign in 👋</h2>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,.4)' }}>
                Enter your credentials to continue
              </p>
            </div>

            <form onSubmit={handleSubmit(submitHandle)} className="flex flex-col gap-5">

              {/* Email */}
              <div className="fade-right-2 flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wide"
                  style={{ color: 'rgba(255,255,255,.55)' }}>Email address</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-sm pointer-events-none select-none"
                    style={{ color: 'rgba(255,255,255,.35)' }}>✉</span>
                  <input
                    type="email"
                    {...register('email', { required: true })}
                    placeholder="you@company.com"
                    className="input-glow w-full pl-10 pr-4 py-3.5 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)' }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="fade-right-2 flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wide"
                  style={{ color: 'rgba(255,255,255,.55)' }}>Password</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-sm pointer-events-none select-none"
                    style={{ color: 'rgba(255,255,255,.35)' }}>🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', { required: true })}
                    placeholder="Enter your password"
                    className="input-glow w-full pl-10 pr-16 py-3.5 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)' }}
                  />
                  <button type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-xs font-semibold transition-colors duration-200 hover:text-purple-400"
                    style={{ color: 'rgba(255,255,255,.4)' }}>
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="fade-right-3 mt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="shimmer-btn relative w-full py-4 rounded-xl text-white text-sm font-bold tracking-wide overflow-hidden transition-all duration-200 hover:-translate-y-0.5 active:scale-[.98] disabled:opacity-60"
                  style={{
                    background: 'linear-gradient(135deg,#7c3aed 0%,#4f46e5 100%)',
                    boxShadow: '0 4px 24px rgba(124,58,237,.45)',
                  }}>
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.3)" strokeWidth="3"/>
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                      Signing in…
                    </span>
                  ) : 'Login →'}
                </button>
              </div>

            </form>

            {/* footer note */}
            <p className="fade-right-4 text-center text-xs" style={{ color: 'rgba(255,255,255,.22)' }}>
              Secured with end-to-end encryption
            </p>
          </div>

        </div>
      </div>
    </>
  )
}
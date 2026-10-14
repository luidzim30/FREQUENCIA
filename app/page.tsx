'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Heart,
  Moon,
  Play,
  Sparkles,
  Sun,
  Waves,
  Wind,
} from 'lucide-react'

const VSL_URL = process.env.NEXT_PUBLIC_VSL_URL || '/vsl'
const STORAGE_KEY = 'frecuencia-divina-quiz'

type Option = { label: string; icon: React.ElementType }
type Question = { title: string; subtitle?: string; options: Option[] }
type Phase = 'intro' | 'quiz' | 'analyzing' | 'result'

const questions: Question[] = [
  { title: '¿QUÉ ES LO QUE MÁS DESEAS ENCONTRAR EN TU VIDA HOY?', subtitle: 'Escucha tu interior y elige lo que más resuena contigo.', options: [{ label: 'Paz y tranquilidad interior', icon: Wind }, { label: 'Amor y armonía en mis relaciones', icon: Heart }, { label: 'Una conexión espiritual más profunda', icon: Sparkles }, { label: 'Claridad para comenzar una nueva etapa', icon: Sun }] },
  { title: '¿CÓMO TE HAS SENTIDO EN LOS ÚLTIMOS DÍAS?', subtitle: 'A veces, nuestro interior necesita un momento de atención.', options: [{ label: 'Mi mente no deja de pensar.', icon: Waves }, { label: 'Siento que algo falta en mi vida.', icon: Moon }, { label: 'Estoy atravesando cambios importantes.', icon: Sun }, { label: 'Me siento bien, pero deseo una conexión más profunda.', icon: Sparkles }] },
  { title: '¿QUÉ LUGAR OCUPA LA FE EN TU VIDA?', subtitle: 'No hay respuestas correctas. Cada camino espiritual es único.', options: [{ label: 'Mi fe es una parte fundamental de mi vida.', icon: Sparkles }, { label: 'Creo en Dios y deseo acercarme más a Él.', icon: Sun }, { label: 'Estoy buscando fortalecer mi espiritualidad.', icon: Waves }, { label: 'Prefiero vivir mi espiritualidad de forma personal.', icon: Heart }] },
  { title: '¿ALGUNA VEZ HAS SENTIDO PAZ AL ESCUCHAR UNA ORACIÓN, UN CÁNTICO O UNA MELODÍA?', options: [{ label: 'Sí, muchas veces.', icon: Waves }, { label: 'Sí, en algunos momentos especiales.', icon: Sparkles }, { label: 'No estoy seguro, pero me interesa.', icon: Wind }, { label: 'Nunca lo he experimentado.', icon: Moon }] },
  { title: 'SI PUDIERAS DEDICAR UN MOMENTO SOLO PARA TU ALMA, ¿QUÉ TE GUSTARÍA SENTIR?', options: [{ label: 'Liberarme de las preocupaciones.', icon: Wind }, { label: 'Sentirme acompañado espiritualmente.', icon: Heart }, { label: 'Recuperar la esperanza y la confianza.', icon: Sun }, { label: 'Encontrar claridad y equilibrio interior.', icon: Sparkles }] },
  { title: '¿EN QUÉ MOMENTO DEL DÍA SIENTES QUE MÁS NECESITAS UN INSTANTE DE PAZ?', options: [{ label: 'Al despertar, antes de comenzar el día.', icon: Sun }, { label: 'Durante el día, cuando todo parece acelerarse.', icon: Waves }, { label: 'Por la noche, antes de dormir.', icon: Moon }, { label: 'En cualquier momento en que necesito reflexionar.', icon: Sparkles }] },
  { title: '¿ESTARÍAS DISPUESTO A DEDICAR UNOS MINUTOS A UNA EXPERIENCIA DE ESCUCHA Y REFLEXIÓN?', subtitle: 'Un pequeño momento de pausa puede ser el comienzo de un nuevo hábito.', options: [{ label: 'Sí, quiero vivir esta experiencia.', icon: Sparkles }, { label: 'Sí, deseo fortalecer mi conexión espiritual.', icon: Heart }, { label: 'Tengo curiosidad por descubrir cómo funciona.', icon: Waves }] },
]

function Brand() {
  return <div className="brand"><span>✦</span> FRECUENCIA DIVINA <span>✦</span></div>
}

function SoundOrb() {
  return <div className="sound-orb" aria-hidden="true"><div className="orb-ring ring-one" /><div className="orb-ring ring-two" /><div className="orb-core"><Waves /></div></div>
}

export default function Page() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [analysisStep, setAnalysisStep] = useState(0)

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (saved) {
        const data = JSON.parse(saved) as { phase?: Phase; step?: number; answers?: string[] }
        if (data.phase && data.phase !== 'intro' && data.answers) { setPhase(data.phase === 'analyzing' ? 'quiz' : data.phase); setStep(data.step || 0); setAnswers(data.answers) }
      }
    } catch { /* sessionStorage may be unavailable */ }
  }, [])

  useEffect(() => {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ phase, step, answers })) } catch { /* sessionStorage may be unavailable */ }
  }, [phase, step, answers])

  useEffect(() => {
    if (phase !== 'analyzing') return
    const timers = [900, 1900, 2900].map((delay, index) => window.setTimeout(() => setAnalysisStep(index + 1), delay))
    const finish = window.setTimeout(() => setPhase('result'), 3600)
    return () => { timers.forEach(clearTimeout); clearTimeout(finish) }
  }, [phase])

  const goal = answers[0] || 'paz y tranquilidad interior'
  const analysisMessages = ['Reconociendo tus respuestas...', 'Identificando tus preferencias de reflexión...', 'Preparando una experiencia para tu momento actual...']
  const progress = useMemo(() => ((step + (selected !== null ? 1 : 0)) / questions.length) * 100, [step, selected])

  const start = () => { setPhase('quiz'); setStep(0); setAnswers([]) }
  const choose = (index: number) => {
    if (selected !== null) return
    setSelected(index)
    window.setTimeout(() => {
      const next = [...answers, questions[step].options[index].label]
      setAnswers(next); setSelected(null)
      if (step === questions.length - 1) setPhase('analyzing')
      else setStep(step + 1)
    }, 350)
  }
  const back = () => { if (step === 0) setPhase('intro'); else { setAnswers(answers.slice(0, -1)); setStep(step - 1) } }

  return <main className="experience-shell">
    <div className="ambient ambient-left" /><div className="ambient ambient-right" /><div className="particle-field" aria-hidden="true" />
    {phase === 'intro' && <section className="screen intro-screen"><Brand /><div className="gold-line" /><div className="intro-content"><span className="eyebrow">EXPERIENCIA DE CONEXIÓN INTERIOR</span><SoundOrb /><h1>¿Y SI EXISTIERA UNA FORMA DIFERENTE DE ENCONTRAR LA <strong>PAZ</strong> QUE TANTO HAS BUSCADO?</h1><p>Durante siglos, diferentes tradiciones han utilizado sonidos, cánticos y momentos de silencio para cultivar la serenidad y la conexión espiritual.</p><p className="curiosity">Responde unas breves preguntas y descubre qué tipo de experiencia de frecuencia guiada puede conectar mejor con tu momento actual.</p><button className="gold-button" onClick={start}>✦ COMENZAR MI EXPERIENCIA <ChevronRight data-icon="inline-end" /></button><small>Una experiencia personal de reflexión y conexión interior.</small></div></section>}
    {phase === 'quiz' && <section className="screen quiz-screen"><header className="quiz-header"><Brand /><div className="progress-meta"><span>PASO {step + 1} DE {questions.length}</span><span>{Math.round(progress)}%</span></div><div className="progress-track"><div className="progress-value" style={{ width: `${progress}%` }} /></div></header><div className="question-content"><div className="question-mark">0{step + 1}</div><h2>{questions[step].title}</h2>{questions[step].subtitle && <p>{questions[step].subtitle}</p>}<div className="answers" role="listbox" aria-label="Opciones de respuesta">{questions[step].options.map((option, index) => { const Icon = option.icon; return <button key={option.label} className={`answer-card ${selected === index ? 'is-selected' : ''}`} onClick={() => choose(index)} aria-selected={selected === index}><span className="answer-icon"><Icon /></span><span>{option.label}</span><span className="answer-check"><Check /></span></button> })}</div></div><button className="back-button" onClick={back}><ArrowLeft data-icon="inline-start" /> Volver</button></section>}
    {phase === 'analyzing' && <section className="screen analysis-screen"><Brand /><SoundOrb /><span className="eyebrow">TU EXPERIENCIA PERSONAL</span><h1>PREPARANDO TU EXPERIENCIA DE <strong>FRECUENCIA DIVINA</strong>...</h1><div className="analysis-list">{analysisMessages.map((message, index) => <div className={analysisStep > index ? 'done' : ''} key={message}><span>{analysisStep > index ? '✓' : '•'}</span>{message}</div>)}</div><div className="analysis-progress"><div style={{ width: `${Math.min(100, analysisStep * 34)}%` }} /></div><span className="analysis-percent">{Math.min(100, analysisStep * 34)}%</span></section>}
    {phase === 'result' && <section className="screen result-screen"><Brand /><div className="gold-line" /><div className="result-content"><span className="eyebrow">TU EXPERIENCIA ESTÁ LISTA</span><div className="result-symbol"><Sparkles /></div><h1>HAY MOMENTOS EN LOS QUE EL ALMA SOLO NECESITA SER <strong>ESCUCHADA.</strong></h1><p>Según lo que compartiste, hoy buscas <strong className="inline-gold">{goal.toLowerCase()}</strong>. Hemos preparado una introducción a una experiencia de escucha y reflexión que puede acompañarte en ese propósito.</p><div className="curiosity-block"><p>Durante generaciones, la oración, los cánticos y las frecuencias sonoras han formado parte de prácticas de contemplación y búsqueda de serenidad.</p><strong>Ahora puedes descubrir una forma de explorar esta tradición desde tu propia experiencia.</strong></div><div className="benefits"><span><Sparkles /> Sonidos y contemplación</span><span><Wind /> Un momento para tu paz interior</span><span><Heart /> Una experiencia de conexión espiritual</span></div><a className="gold-button result-cta" href={VSL_URL}><Play data-icon="inline-start" /> DESCUBRIR LA FRECUENCIA DIVINA</a><small>El siguiente video te explicará esta experiencia.</small></div></section>}
  </main>
}

// Configure the VSL destination with NEXT_PUBLIC_VSL_URL when deploying.
export { VSL_URL }

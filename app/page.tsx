'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Heart,
  Landmark,
  Play,
  Sparkles,
  Wallet,
  Waves,
} from 'lucide-react'

const VSL_URL = process.env.NEXT_PUBLIC_VSL_URL || '/vsl'
const STORAGE_KEY = 'frecuencia-divina-quiz'

type Option = { label: string; icon: React.ElementType }
type Question = { title: string; subtitle?: string; options: Option[] }
type Phase = 'intro' | 'quiz' | 'analyzing' | 'result'

const questions: Question[] = [
  {
    title: 'SI PUDIERAS TRANSFORMAR UN ÁREA DE TU VIDA HOY, ¿CUÁL SERÍA?',
    options: [
      { label: 'Mi prosperidad y abundancia financiera.', icon: Wallet },
      { label: 'Mi vida amorosa y mis relaciones.', icon: Heart },
      { label: 'Mi paz y felicidad.', icon: Sparkles },
      { label: 'Mi fe y mi conexión con Dios.', icon: Landmark },
    ],
  },
  {
    title: '¿QUÉ ES LO QUE MÁS TE HA QUITADO LA TRANQUILIDAD ÚLTIMAMENTE?',
    options: [
      { label: 'Las preocupaciones por el dinero y el futuro.', icon: Wallet },
      { label: 'Las dificultades en el amor y las relaciones.', icon: Heart },
      { label: 'Los pensamientos negativos y el cansancio emocional.', icon: Waves },
      { label: 'La sensación de estar lejos de mi propósito.', icon: Landmark },
    ],
  },
  {
    title: '¿ALGUNA VEZ HAS SENTIDO QUE TE ESFUERZAS MUCHO, PERO ALGUNAS COSAS EN TU VIDA PARECEN NO AVANZAR?',
    options: [
      { label: 'Sí, lo siento con frecuencia.', icon: Waves },
      { label: 'Sí, principalmente en mi vida financiera.', icon: Wallet },
      { label: 'A veces, especialmente en el amor.', icon: Heart },
      { label: 'No exactamente, pero quiero seguir creciendo.', icon: Sparkles },
    ],
  },
  {
    title: 'IMAGINA TU VIDA DENTRO DE ALGUNOS MESES. ¿QUÉ TE GUSTARÍA ESTAR EXPERIMENTANDO?',
    options: [
      { label: 'Más estabilidad, oportunidades y prosperidad.', icon: Wallet },
      { label: 'Una relación llena de amor y armonía.', icon: Heart },
      { label: 'Una mente tranquila y un corazón en paz.', icon: Sparkles },
      { label: 'Una conexión espiritual más fuerte y significativa.', icon: Landmark },
    ],
  },
  {
    title: '¿CREES QUE LA FE, LA ORACIÓN Y LOS MOMENTOS DE REFLEXIÓN PUEDEN AYUDARTE A ENFRENTAR LOS DESAFÍOS DE LA VIDA?',
    options: [
      { label: 'Sí, creo profundamente en ello.', icon: Landmark },
      { label: 'Sí, pero me gustaría fortalecer mi fe.', icon: Sparkles },
      { label: 'Tengo curiosidad por estas prácticas.', icon: Waves },
      { label: 'Estoy descubriendo mi propio camino espiritual.', icon: Heart },
    ],
  },
  {
    title: '¿SABÍAS QUE DURANTE SIGLOS SE HAN UTILIZADO SONIDOS Y CÁNTICOS EN PRÁCTICAS DE CONTEMPLACIÓN ESPIRITUAL?',
    subtitle: 'Durante generaciones, estas prácticas han formado parte de la búsqueda de serenidad, fe y conexión interior.',
    options: [
      { label: 'Sí, y siempre he tenido curiosidad.', icon: Waves },
      { label: 'He escuchado sobre ello, pero nunca lo he probado.', icon: Sparkles },
      { label: 'No lo sabía, quiero descubrir más.', icon: Landmark },
      { label: 'Me gustaría entender cómo funciona.', icon: Heart },
    ],
  },
  {
    title: 'SI PUDIERAS CONOCER UNA EXPERIENCIA DE ESCUCHA GUIADA INSPIRADA EN ESTAS TRADICIONES, ¿TE GUSTARÍA DESCUBRIR CÓMO FUNCIONA?',
    options: [
      { label: 'Sí, quiero conocerla ahora.', icon: Sparkles },
      { label: 'Sí, busco más paz y abundancia.', icon: Wallet },
      { label: 'Sí, quiero fortalecer mi espiritualidad.', icon: Landmark },
      { label: 'Tengo curiosidad y quiero entender mejor.', icon: Waves },
    ],
  },
]

function Brand() {
  return <div className="brand"><span>✦</span> FRECUENCIA DIVINA <span>✦</span></div>
}

function SoundOrb() {
  return <div className="sound-orb" aria-hidden="true"><div className="orb-ring ring-one" /><div className="orb-ring ring-two" /><div className="orb-core"><Waves /></div></div>
}

function getResult(answer: string) {
  if (answer.includes('prosperidad') || answer.includes('abundancia') || answer.includes('financier')) {
    return { text: 'Deseas vivir con más abundancia, seguridad financiera y tranquilidad.', keyword: 'prosperidad y abundancia' }
  }
  if (answer.includes('amor') || answer.includes('relaciones')) {
    return { text: 'Deseas encontrar más amor, armonía y felicidad en tus relaciones.', keyword: 'amor y armonía' }
  }
  if (answer.includes('paz') || answer.includes('felicidad')) {
    return { text: 'Deseas dejar atrás las preocupaciones y cultivar más serenidad.', keyword: 'paz y felicidad' }
  }
  return { text: 'Deseas fortalecer tu conexión con Dios y encontrar un significado espiritual más profundo.', keyword: 'fe y conexión espiritual' }
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
      if (!saved) return
      const data = JSON.parse(saved) as { phase?: Phase; step?: number; answers?: string[] }
      if (data.phase && data.phase !== 'intro' && data.answers) {
        setPhase(data.phase === 'analyzing' ? 'quiz' : data.phase)
        setStep(Math.min(data.step || 0, questions.length - 1))
        setAnswers(data.answers)
      }
    } catch { /* sessionStorage pode não estar disponível */ }
  }, [])

  useEffect(() => {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ phase, step, answers })) } catch { /* sessionStorage pode não estar disponível */ }
  }, [phase, step, answers])

  useEffect(() => {
    if (phase !== 'analyzing') return
    const timers = [900, 1800, 2700].map((delay, index) => window.setTimeout(() => setAnalysisStep(index + 1), delay))
    const finish = window.setTimeout(() => setPhase('result'), 3500)
    return () => { timers.forEach(clearTimeout); clearTimeout(finish) }
  }, [phase])

  const result = getResult(answers[0] || '')
  const analysisMessages = ['Organizando tus respuestas...', 'Identificando lo que más deseas transformar...', 'Preparando tu presentación personalizada...']
  const progress = useMemo(() => ((step + (selected !== null ? 1 : 0)) / questions.length) * 100, [step, selected])

  const start = () => { setPhase('quiz'); setStep(0); setAnswers([]); setSelected(null) }
  const choose = (index: number) => {
    if (selected !== null) return
    setSelected(index)
    window.setTimeout(() => {
      const next = [...answers, questions[step].options[index].label]
      setAnswers(next)
      setSelected(null)
      if (step === questions.length - 1) setPhase('analyzing')
      else setStep(step + 1)
    }, 350)
  }
  const back = () => {
    if (step === 0) setPhase('intro')
    else { setAnswers(answers.slice(0, -1)); setStep(step - 1) }
  }

  return <main className="experience-shell">
    <div className="ambient ambient-left" /><div className="ambient ambient-right" /><div className="particle-field" aria-hidden="true" />
    {phase === 'intro' && <section className="screen intro-screen"><Brand /><div className="gold-line" /><div className="intro-content"><span className="eyebrow">UNA EXPERIENCIA DE CONEXIÓN ESPIRITUAL</span><SoundOrb /><h1>¿Y SI EXISTIERA UNA EXPERIENCIA QUE PUDIERA AYUDARTE A CULTIVAR MÁS <strong>PAZ, AMOR Y ABUNDANCIA</strong> EN TU VIDA?</h1><p>Durante siglos, diferentes tradiciones espirituales han utilizado sonidos, cánticos y momentos de contemplación para fortalecer la fe y cultivar la serenidad.</p><button className="gold-button" onClick={start}>QUIERO DESCUBRIRLO <ChevronRight data-icon="inline-end" /></button></div></section>}
    {phase === 'quiz' && <section className="screen quiz-screen"><header className="quiz-header"><Brand /><div className="progress-meta"><span>PREGUNTA {step + 1} DE {questions.length}</span><span>{Math.round(progress)}%</span></div><div className="progress-track"><div className="progress-value" style={{ width: `${progress}%` }} /></div></header><div className="question-content"><div className="question-mark">0{step + 1}</div><h2>{questions[step].title}</h2>{questions[step].subtitle && <p>{questions[step].subtitle}</p>}<div className="answers" role="listbox" aria-label="Opciones de respuesta">{questions[step].options.map((option, index) => { const Icon = option.icon; return <button key={option.label} className={`answer-card ${selected === index ? 'is-selected' : ''}`} onClick={() => choose(index)} aria-selected={selected === index}><span className="answer-icon"><Icon /></span><span>{option.label}</span><span className="answer-check"><Check /></span></button> })}</div></div><button className="back-button" onClick={back}><ArrowLeft data-icon="inline-start" /> Volver</button></section>}
    {phase === 'analyzing' && <section className="screen analysis-screen"><Brand /><SoundOrb /><span className="eyebrow">TU EXPERIENCIA ESTÁ TOMANDO FORMA</span><h1>PREPARANDO TU EXPERIENCIA <strong>FRECUENCIA DIVINA</strong>...</h1><div className="analysis-list">{analysisMessages.map((message, index) => <div className={analysisStep > index ? 'done' : ''} key={message}><span>{analysisStep > index ? '✓' : '•'}</span>{message}</div>)}</div><div className="analysis-progress"><div style={{ width: `${Math.min(100, analysisStep * 34)}%` }} /></div><span className="analysis-percent">{Math.min(100, analysisStep * 34)}%</span></section>}
    {phase === 'result' && <section className="screen result-screen"><Brand /><div className="gold-line" /><div className="result-content"><span className="eyebrow">✦ TU EXPERIENCIA ESTÁ LISTA ✦</span><div className="result-symbol"><Sparkles /></div><h1>LO QUE ESTÁS BUSCANDO PODRÍA COMENZAR CON UN NUEVO MOMENTO DE <strong>CONEXIÓN.</strong></h1><p>{result.text}</p><p>Tal vez ya has intentado diferentes maneras de mejorar esta área de tu vida. Pero, entre tantas preocupaciones, no siempre dedicamos tiempo a cuidar nuestro mundo interior.</p><div className="curiosity-block"><p>Durante siglos, los sonidos, los cánticos y los momentos de oración han formado parte de tradiciones espirituales orientadas a la contemplación y la serenidad.</p><strong>AHORA QUEREMOS PRESENTARTE UNA EXPERIENCIA INSPIRADA EN ESTAS TRADICIONES.</strong></div><a className="gold-button result-cta" href={VSL_URL}><Play data-icon="inline-start" /> QUIERO DESCUBRIR FRECUENCIA DIVINA</a><small>Mira la presentación y conoce esta experiencia.</small><span className="sr-only">Tu enfoque principal es {result.keyword}.</span></div></section>}
  </main>
}

export { VSL_URL }

// VSL_URL se configura mediante NEXT_PUBLIC_VSL_URL al publicar.
// Todo el flujo está diseñado mobile-first para pantallas pequeñas.

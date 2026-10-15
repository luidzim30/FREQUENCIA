'use client'

import { useEffect } from 'react'

declare namespace JSX { interface IntrinsicElements { 'vturb-smartplayer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> } }

export default function VslPage() {
  useEffect(() => {
    const scriptId = 'vturb-player-script'
    if (document.getElementById(scriptId)) return
    const script = document.createElement('script')
    script.id = scriptId
    script.src = 'https://scripts.converteai.net/e0b6b027-7861-4f15-8697-a6b42cfa2c3e/players/6acfd83eb54e0be259826862/v4/player.js'
    script.async = true
    document.head.appendChild(script)
  }, [])

  return <main className="vsl-page"><section className="vsl-shell" aria-label="Presentación en video"><header className="vsl-intro"><p className="vsl-kicker">SE BURLARON CUANDO LES DIJE QUE<br />ESTA FRECUENCIA SANADORA DE<br />7 MINUTOS REPARARÍA SU ABUNDANCIA</p><h1>ILIMITADA EN SUS VIDAS</h1><p className="vsl-note">(quizá que no lo experimentaron<br />por ellos mismos).</p><p className="vsl-instruction">Mira el video a continuación y aprieta<br />hoy mismo.</p></header><div className="video-frame" aria-label="Video de la presentación"><vturb-smartplayer id="vid-6acfd83eb54e0be259826862" style={{ display: 'block', margin: '0 auto', width: '100%', maxWidth: '400px' }}><div className="vturb-player-placeholder" style={{ position: 'relative', width: '100%', padding: '178.21782178217822% 0 0', zIndex: 0, backgroundColor: 'black' }} /></vturb-smartplayer></div><p className="vsl-legal">© 2025 · Todos los derechos reservados.<br />Este sitio no es parte de Facebook ni de Meta Platforms, Inc.<br />Los resultados pueden variar según cada persona.</p></section></main>
}

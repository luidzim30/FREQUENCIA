'use client'

import { useEffect } from 'react'

export default function Page() {
  useEffect(() => {
    const scriptId = 'vturb-player-script'
    if (document.getElementById(scriptId)) return

    const script = document.createElement('script')
    script.id = scriptId
    script.src = 'https://scripts.converteai.net/e0b6b027-7861-4f15-8697-a6b42cfa2c3e/players/6ac989948c841663bd8b4711/v4/player.js'
    script.async = true
    document.head.appendChild(script)
  }, [])

  return (
    <main className="vsl-page">
      <section className="vsl-shell" aria-label="Apresentação em vídeo">
        <header className="vsl-intro">
          <p className="vsl-kicker">
            SE BURLARON CUANDO LES DIJE QUE<br />
            ESTA FRECUENCIA SANADORA DE<br />
            7 MINUTOS REPARARÍA SU ABUNDANCIA
          </p>
          <h1>ILIMITADA EN SUS VIDAS</h1>
          <p className="vsl-note">(quizá que no lo experimentaron<br />por ellos mismos).</p>
          <p className="vsl-instruction">Mira el video a continuación y aprieta<br />hoy mismo.</p>
        </header>

        <div className="video-frame" aria-label="Vídeo da apresentação">
          <vturb-smartplayer
            id="vid-6ac989948c841663bd8b4711"
            style={{ display: 'block', margin: '0 auto', width: '100%', maxWidth: '400px' }}
          >
            <div
              className="vturb-player-placeholder"
              style={{ position: 'relative', width: '100%', padding: '178.21782178217822% 0 0', zIndex: 0, backgroundColor: 'black' }}
            />
          </vturb-smartplayer>
        </div>

        <p className="vsl-legal">
          © 2025 · Todos los derechos reservados.<br />
          Este sitio no es parte de Facebook ni de Meta Platforms, Inc.<br />
          Los resultados pueden variar según cada persona.
        </p>
      </section>
    </main>
  )
}

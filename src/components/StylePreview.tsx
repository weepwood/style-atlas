import { ExtraStylePreview } from './ExtraStylePreview'

interface StylePreviewProps {
  styleId: string
}

export function StylePreview({ styleId }: StylePreviewProps) {
  switch (styleId) {
    case 'glass':
      return (
        <div className="mini-window glass-ui">
          <div className="mini-nav"><span>STUDIO / 04</span><span className="dots"><i /><i /><i /></span></div>
          <h4>Shape the atmosphere.</h4>
          <span className="glass-cta">EXPLORE ↗</span>
        </div>
      )
    case 'bento':
      return (
        <div className="mini-window bento-ui">
          <div className="bento-main"><span>PRODUCT SYSTEM</span><strong>Build.<br />Ship.<br />Learn.</strong></div>
          <div className="bento-accent" />
          <div className="bento-chart"><i /><i /><i /><i /><i /></div>
        </div>
      )
    case 'brutal':
      return (
        <div className="mini-window brutal-ui">
          <div className="mini-nav"><span>LOUD®</span><span>MENU +</span></div>
          <h4>MAKE<br />NOISE.</h4>
          <span className="brutal-sticker">NEW DROP!</span>
          <div className="brutal-footer"><span>CREATIVE STUDIO</span><span>2026 ↗</span></div>
        </div>
      )
    case 'aurora':
      return (
        <div className="mini-window aurora-ui">
          <div className="mini-nav"><span>ORBIT.AI</span><span>ENTER APP</span></div>
          <h4>Ideas move<br />at light speed.</h4>
          <p>One intelligent workspace for research, creation and deployment.</p>
          <div className="aurora-ring" />
        </div>
      )
    case 'clay':
      return (
        <div className="mini-window clay-ui">
          <div className="mini-nav"><span>MOCHI</span><span>LEVEL 04</span></div>
          <div className="clay-object"><i className="clay-eye a" /><i className="clay-eye b" /><i className="clay-mouth" /></div>
          <span className="clay-chip a">+ 120 XP</span>
          <span className="clay-chip b">STREAK 7</span>
        </div>
      )
    case 'editorial':
      return (
        <div className="mini-window editorial-ui">
          <div className="mini-nav"><span>THE NEW ARCHIVE</span><span>ISSUE 08 — 2026</span></div>
          <div className="editorial-grid">
            <div className="editorial-aside">Culture / Form / Process</div>
            <div className="editorial-main">
              <h4>Objects<br />with memory.</h4>
              <div className="editorial-image" />
              <div className="editorial-caption"><span>Photography: A. Mori</span><span>READ 08 MIN</span></div>
            </div>
          </div>
        </div>
      )
    case 'swiss':
      return (
        <div className="mini-window swiss-ui">
          <div className="swiss-index">SYSTEM / 1957—2026</div>
          <div className="swiss-main">
            <div className="mini-nav"><span>FORM</span><span>INDEX / MENU</span></div>
            <h4>Clarity<br />is a system.</h4>
            <p>STRUCTURE CREATES FREEDOM. INFORMATION BECOMES VISIBLE.</p>
            <div className="swiss-dot" />
          </div>
        </div>
      )
    case 'cyber':
      return (
        <div className="mini-window cyber-ui">
          <div className="mini-nav"><span>NODE_07 ONLINE</span><span>22:08:41 JST</span></div>
          <h4>BREAK<br />THE GRID</h4>
          <p>&gt; encrypted creative network<br />&gt; signal integrity 98.7%</p>
          <div className="cyber-meter"><i /><i /><i /><i /><i /><i /><i /><i /></div>
        </div>
      )
    case 'y2k':
      return (
        <div className="mini-window y2k-ui">
          <div className="y2k-bar"><span className="y2k-logo">NEO☆NET</span><span>HOME / CLUB / MAIL</span></div>
          <div className="y2k-content"><h4>FUTURE<br />IS CUTE!</h4><p>connecting dreamers since 2000_</p></div>
          <div className="y2k-orb a" />
          <div className="y2k-orb b" />
        </div>
      )
    case 'organic':
      return (
        <div className="mini-window organic-ui">
          <div className="mini-nav"><span>slow / living</span><span>menu</span></div>
          <h4>Return to a gentler rhythm.</h4>
          <p>Objects, rituals and places designed for a more considered everyday life.</p>
          <div className="organic-seal">MADE WITH<br />CARE</div>
          <div className="organic-blob" />
        </div>
      )
    case 'terminal':
      return (
        <div className="mini-window terminal-ui">
          <div className="terminal-bar"><i /><i /><i /><span>~/studio/atlas</span></div>
          <div className="terminal-content">
            <span className="prompt">guest@atlas:~$</span> init portfolio<br />
            <span className="dim">[ok] components loaded<br />[ok] motion reduced</span>
            <h4>DESIGN_SYSTEM<br />READY.</h4>
            <span className="prompt">guest@atlas:~$</span> <span className="terminal-cursor" />
          </div>
        </div>
      )
    case 'luxury':
      return (
        <div className="mini-window luxury-ui">
          <div className="mini-nav"><span>ATELIER N°07</span><span>COLLECTION / CONTACT</span></div>
          <div className="luxury-monogram">A</div>
          <h4>The art of restraint</h4>
          <div className="luxury-rule" />
        </div>
      )
    default:
      return <ExtraStylePreview styleId={styleId} />
  }
}

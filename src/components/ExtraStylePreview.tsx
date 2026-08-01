interface ExtraStylePreviewProps {
  styleId: string
}

export function ExtraStylePreview({ styleId }: ExtraStylePreviewProps) {
  switch (styleId) {
    case 'neumorphism':
      return (
        <div className="mini-window neumorphism-ui">
          <div className="mini-nav"><span>FOCUS</span><span>09:41</span></div>
          <div className="neumo-dial"><strong>72</strong><small>MIN</small></div>
          <div className="neumo-controls"><i>−</i><b>▶</b><i>＋</i></div>
        </div>
      )
    case 'bauhaus':
      return (
        <div className="mini-window bauhaus-ui">
          <div className="bauhaus-circle" />
          <div className="bauhaus-square" />
          <div className="bauhaus-line" />
          <div className="mini-nav"><span>BAU / 20</span><span>FORM FOLLOWS FUNCTION</span></div>
          <h4>GEOMETRY<br />IN MOTION</h4>
        </div>
      )
    case 'material':
      return (
        <div className="mini-window material-ui">
          <div className="material-top"><span>Today</span><i>●</i></div>
          <h4>Good morning,<br />build something useful.</h4>
          <div className="material-cards"><div><small>FOCUS</small><strong>4h 20m</strong></div><div><small>TASKS</small><strong>08</strong></div></div>
          <button type="button" tabIndex={-1}>＋</button>
        </div>
      )
    case 'vaporwave':
      return (
        <div className="mini-window vaporwave-ui">
          <div className="vapor-sun" />
          <div className="vapor-grid" />
          <div className="mini-nav"><span>夢 NETWORK</span><span>199X / ONLINE</span></div>
          <h4>FOREVER<br />ONLINE</h4>
          <p>lost memories from a perfect internet</p>
        </div>
      )
    case 'pixel':
      return (
        <div className="mini-window pixel-ui">
          <div className="pixel-bar"><span>PLAYER_01</span><span>♥♥♥</span></div>
          <div className="pixel-world"><i className="pixel-cloud" /><i className="pixel-hero" /><i className="pixel-coin" /></div>
          <h4>NEW QUEST!</h4>
          <p>Collect 20 design tokens</p>
        </div>
      )
    case 'zen':
      return (
        <div className="mini-window zen-ui">
          <div className="mini-nav"><span>余白</span><span>静かなもの</span></div>
          <div className="zen-sun" />
          <div className="zen-stroke" />
          <h4>不完全の<br />中にある美。</h4>
          <p>objects shaped by time, touch and quiet attention</p>
        </div>
      )
    case 'academia':
      return (
        <div className="mini-window academia-ui">
          <div className="mini-nav"><span>THE ARCHIVE</span><span>VOL. XIX</span></div>
          <div className="academia-rule" />
          <h4>Notes on<br />forgotten rooms</h4>
          <p>AN INDEX OF MEMORY, MATERIAL &amp; SHADOW</p>
          <div className="academia-seal">A</div>
        </div>
      )
    case 'memphis':
      return (
        <div className="mini-window memphis-ui">
          <div className="memphis-shape circle" />
          <div className="memphis-shape triangle" />
          <div className="memphis-shape squiggle">≈</div>
          <div className="mini-nav"><span>PLAY / WORK</span><span>MENU</span></div>
          <h4>MAKE<br />IT FUN.</h4>
          <span className="memphis-pill">START A PROJECT ↗</span>
        </div>
      )
    default:
      return <div className="mini-window" />
  }
}

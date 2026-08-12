/* ============================================================================
   Artham — the sketches
   Drawings of the work itself: a thumbprint pressed into a clay tag, a tile
   worked in three kinds of stitch, a lino block mid-cut beside its print, a
   beading tray, a shelf of pots that didn't come out the same. They sit
   between the chapters like margin drawings.

   Each is drawn in a 200 x 160 box and coloured by class, not by hardcoded
   values, so they follow the page into dark mode:

       sk-ink    the maroon line          sk-warm       the ochre line
       sk-leaf   the green line           sk-soft       the faint table line
       sk-thin   finer detail line        sk-hair       faintest texture line
       sk-tint   a soft ochre wash        sk-tint-leaf  a soft green wash
       sk-dot    a solid maroon dot       sk-stitch     a dashed stitch line

   To add one of your own: draw it in a 200 x 160 box, drop it in the list
   below with a name, and add that name to SEQUENCE.
   ========================================================================== */

window.ArthamSketches = (function () {
  "use strict";

  function svg(title, body) {
    return '<svg viewBox="0 0 200 160" fill="none" stroke-width="2" ' +
           'stroke-linecap="round" stroke-linejoin="round" role="img" ' +
           'aria-label="' + title + '">' + body + '</svg>';
  }

  /* ── helpers for the repetitive geometry ──────────────────────────────── */

  function dotGrid(xs, ys, r) {
    var out = "";
    xs.forEach(function (x) {
      ys.forEach(function (y) {
        out += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '"/>';
      });
    });
    return '<g class="sk-dot">' + out + '</g>';
  }

  /* A weft thread crossing the warp, dipping under every other one. Drawn as
     a run of segments with a gap wherever the thread passes behind a warp —
     which is what makes it read as weaving rather than a grid. */
  function weftRow(y, x0, x1, warps, phase, gap) {
    var segments = [];
    var cursor = x0;
    warps.forEach(function (x, i) {
      if ((i + phase) % 2 !== 1) return;          // passes over: no break
      segments.push([cursor, x - gap / 2]);
      cursor = x + gap / 2;
    });
    segments.push([cursor, x1]);

    return segments.map(function (s) {
      return '<path d="M' + s[0].toFixed(1) + ' ' + y + ' L' + s[1].toFixed(1) + ' ' + y + '"/>';
    }).join("");
  }

  function weaveBody() {
    var warps = [46, 60, 74, 88, 102, 116, 130, 144, 158];
    var wefts = [58, 72, 86, 100, 114];

    var warpLines = warps.map(function (x, i) {
      var lean = (i % 3) - 1;                     // nothing hangs quite straight
      return '<path d="M' + x + ' 44 C' + (x + lean) + ' 76 ' + (x - lean) + ' 104 ' + x + ' 128"/>';
    }).join("");

    /* the ends that haven't been woven in yet, fanning out below */
    var fringe = warps.map(function (x, i) {
      var drift = (i - 4) * 2.4;
      return '<path d="M' + x + ' 128 C' + (x + drift * 0.4) + ' 138 ' +
             (x + drift * 0.8) + ' 144 ' + (x + drift) + ' 152"/>';
    }).join("");

    var weft = wefts.map(function (y, r) {
      return weftRow(y, 38, 166, warps, r, 9);
    }).join("");

    return '<path class="sk-tint" d="M40 46 C80 41 128 42 164 47 C167 76 166 104 163 122' +
             ' C124 128 78 127 41 121 C37 98 37 68 40 46 Z"/>' +
           '<g class="sk-ink">' + warpLines + '</g>' +
           '<g class="sk-warm">' + weft + '</g>' +
           '<g class="sk-ink sk-thin">' + fringe + '</g>' +
           /* the stick shuttle, set down mid-row with its strand still wound on */
           '<g class="sk-ink sk-thin">' +
             '<path d="M172 88 C184 86 196 89 198 96 C196 103 184 106 172 104' +
               ' C167 100 167 92 172 88 Z"/>' +
             '<path d="M176 89 C178 94 178 99 176 104"/>' +
           '</g>' +
           '<g class="sk-warm sk-thin">' +
             '<path d="M182 88 C186 92 186 100 182 105"/>' +
             '<path d="M190 90 C194 94 194 100 190 104"/>' +
             '<path d="M172 97 C166 98 162 98 159 99"/>' +
           '</g>' +
           '<path class="sk-soft" d="M24 152 C70 147 140 157 184 150"/>';
  }

  /* ── the drawings ─────────────────────────────────────────────────────── */

  var LIBRARY = {

    /* a clay tag on a twine loop, a thumbprint pressed into it, grog showing
       in the body, a modelling tool set down beside it */
    thumbprint: svg("A sketch of a clay tag with a thumbprint pressed into it",
      '<g class="sk-warm sk-thin">' +
        '<path d="M100 12 C86 16 82 26 93 32"/>' +
        '<path d="M100 12 C114 16 118 26 107 32"/>' +
        '<path d="M95 12 C97 8 103 8 105 12 C103 16 97 16 95 12 Z"/>' +
      '</g>' +
      '<path class="sk-tint" d="M60 36 C86 29 120 31 140 38 C147 62 147 102 140 124' +
        ' C118 132 80 132 58 123 C51 100 52 58 60 36 Z"/>' +
      '<path class="sk-ink" d="M60 36 C86 29 120 31 140 38 C147 62 147 102 140 124' +
        ' C118 132 80 132 58 123 C51 100 52 58 60 36 Z"/>' +
      '<path class="sk-thin sk-ink" d="M66 43 C88 37 116 39 134 45"/>' +
      '<circle class="sk-ink sk-thin" cx="100" cy="49" r="5"/>' +
      /* the ridges, each stopping where a ridge really stops */
      '<g class="sk-thin sk-ink">' +
        '<path d="M72 106 C64 90 70 68 86 59 C102 50 124 55 133 70"/>' +
        '<path d="M78 110 C70 94 75 75 89 67 C103 59 121 63 129 75"/>' +
        '<path d="M85 112 C77 98 81 82 93 75 C105 68 119 72 125 82"/>' +
        '<path d="M92 112 C86 101 89 89 98 84 C107 79 117 82 121 90"/>' +
        '<path d="M99 110 C95 102 97 94 103 91 C110 88 115 92 116 97"/>' +
        '<path d="M105 106 C103 101 105 98 108 98"/>' +
      '</g>' +
      '<g class="sk-hair sk-ink">' +
        '<path d="M66 94 C64 86 65 78 68 72"/>' +
        '<path d="M138 86 C139 94 138 102 135 108"/>' +
      '</g>' +
      '<g class="sk-dot">' +
        '<circle cx="72" cy="60" r="1.2"/><circle cx="126" cy="104" r="1.2"/>' +
        '<circle cx="118" cy="48" r="1"/><circle cx="80" cy="118" r="1"/>' +
        '<circle cx="108" cy="120" r="1.2"/><circle cx="64" cy="78" r="1"/>' +
      '</g>' +
      /* the wooden rib it was smoothed with */
      '<g class="sk-ink sk-thin">' +
        '<path d="M148 140 C158 132 172 119 183 103 C187 97 194 101 190 108' +
          ' C181 124 167 138 155 146 C149 150 144 145 148 140 Z"/>' +
        '<path class="sk-hair" d="M156 136 C166 128 178 115 186 105"/>' +
      '</g>' +
      '<path class="sk-soft" d="M40 142 C80 136 140 146 178 140"/>'),

    /* one tile worked three ways — running stitch through drilled holes,
       a row of crosses, a line of French knots — and the spool it came from */
    stitchedclay: svg("A sketch of a clay tile worked in running stitch, cross stitch and French knots",
      '<path class="sk-tint" d="M34 32 C68 26 116 28 140 34 C147 62 146 106 140 126' +
        ' C110 134 62 133 36 125 C29 98 28 56 34 32 Z"/>' +
      '<path class="sk-ink" d="M34 32 C68 26 116 28 140 34 C147 62 146 106 140 126' +
        ' C110 134 62 133 36 125 C29 98 28 56 34 32 Z"/>' +
      '<path class="sk-thin sk-ink" d="M41 39 C70 33 112 35 133 40"/>' +
      '<path class="sk-warm sk-stitch" d="M46 64 C70 57 106 68 134 59"/>' +
      '<g class="sk-dot">' +
        '<circle cx="46" cy="64" r="1.7"/><circle cx="68" cy="59.5" r="1.7"/>' +
        '<circle cx="90" cy="62" r="1.7"/><circle cx="112" cy="64.5" r="1.7"/>' +
        '<circle cx="134" cy="59" r="1.7"/>' +
      '</g>' +
      '<g class="sk-leaf sk-thin">' +
        '<path d="M52 90 L62 100"/><path d="M62 90 L52 100"/>' +
        '<path d="M72 92 L82 102"/><path d="M82 92 L72 102"/>' +
        '<path d="M92 91 L102 101"/><path d="M102 91 L92 101"/>' +
        '<path d="M112 89 L122 99"/><path d="M122 89 L112 99"/>' +
      '</g>' +
      '<g class="sk-warm sk-thin">' +
        '<path d="M56 114 C60 110 65 113 62 117 C60 119 56 118 56 114 Z"/>' +
        '<path d="M84 118 C88 114 93 117 90 121 C88 123 84 122 84 118 Z"/>' +
        '<path d="M114 113 C118 109 123 112 120 116 C118 118 114 117 114 113 Z"/>' +
      '</g>' +
      '<path class="sk-warm" d="M134 59 C148 54 158 44 164 32"/>' +
      '<g class="sk-ink">' +
        '<path d="M164 32 L184 8"/>' +
        '<ellipse cx="165.5" cy="30" rx="1.7" ry="3.4" transform="rotate(-40 165.5 30)"/>' +
      '</g>' +
      '<g class="sk-ink sk-thin">' +
        '<path d="M156 106 L156 136"/><path d="M176 106 L176 136"/>' +
        '<path d="M154 105 C160 101 172 101 178 105 C172 109 160 109 154 105 Z"/>' +
        '<path d="M154 136 C160 132 172 132 178 136 C172 140 160 140 154 136 Z"/>' +
      '</g>' +
      '<g class="sk-warm sk-thin">' +
        '<path d="M157 114 C162 116 170 116 175 114"/>' +
        '<path d="M157 121 C162 123 170 123 175 121"/>' +
        '<path d="M157 128 C162 130 170 130 175 128"/>' +
        '<path d="M177 124 C186 126 189 134 184 140"/>' +
      '</g>'),

    /* the print pinned up behind, the block still being cut in front */
    lino: svg("A sketch of a lino block being carved, with its finished print behind it",
      '<g transform="rotate(-4 58 66)">' +
        '<path class="sk-tint" d="M16 22 C40 18 74 19 94 23 C97 48 96 84 93 104' +
          ' C68 109 38 108 18 103 C14 78 13 44 16 22 Z"/>' +
        '<path class="sk-thin sk-ink" d="M16 22 C40 18 74 19 94 23 C97 48 96 84 93 104' +
          ' C68 109 38 108 18 103 C14 78 13 44 16 22 Z"/>' +
        '<g class="sk-leaf">' +
          '<path d="M30 74 C30 60 42 50 56 52 C66 53 72 60 72 66 C72 76 62 84 48 83' +
            ' C37 82 30 80 30 74 Z"/>' +
          '<path d="M72 60 L84 56 L74 66"/>' +
          '<path class="sk-thin" d="M42 68 C48 64 58 64 64 68 C58 74 48 75 42 68 Z"/>' +
          '<path class="sk-thin" d="M30 74 C25 78 20 82 16 84"/>' +
          '<path class="sk-thin" d="M46 83 L44 92"/><path class="sk-thin" d="M56 83 L56 92"/>' +
        '</g>' +
        '<circle class="sk-dot" cx="66" cy="59" r="1.5"/>' +
      '</g>' +
      '<path class="sk-tint" d="M84 76 C112 70 152 72 170 78 C174 98 173 124 168 138' +
        ' C142 145 106 144 86 137 C81 120 80 92 84 76 Z"/>' +
      '<path class="sk-ink" d="M84 76 C112 70 152 72 170 78 C174 98 173 124 168 138' +
        ' C142 145 106 144 86 137 C81 120 80 92 84 76 Z"/>' +
      /* the same bird, cut into the block as a trough: two lines, not one */
      '<g class="sk-ink sk-thin">' +
        '<path d="M98 118 C98 106 110 97 123 99 C132 100 138 106 138 112' +
          ' C138 121 128 128 116 127 C105 126 98 124 98 118 Z"/>' +
        '<path d="M101 117 C102 107 112 100 122 101"/>' +
        '<path d="M138 107 L148 103 L140 112"/>' +
        '<path d="M110 112 C115 109 123 109 128 112 C123 117 115 118 110 112 Z"/>' +
      '</g>' +
      '<g class="sk-ink">' +
        '<path d="M148 26 C148 14 156 8 164 8 C172 8 180 14 180 26' +
          ' C180 33 173 36 164 36 C155 36 148 33 148 26 Z"/>' +
        '<path class="sk-thin" d="M152 30 C158 33 170 33 176 30"/>' +
        '<path d="M158 36 L158 60"/><path d="M170 36 L170 60"/>' +
        '<path d="M158 60 L164 72 L170 60"/>' +
      '</g>' +
      /* the curl of lino lifting away from the blade */
      '<g class="sk-warm">' +
        '<path d="M166 78 C178 78 184 88 177 94 C171 99 163 92 168 88"/>' +
        '<path class="sk-thin" d="M144 70 C154 68 159 76 153 80 C148 83 143 77 147 75"/>' +
      '</g>'),

    /* the beading tray: what's waiting in the dish, and what's on the thread */
    beads: svg("A sketch of a beading tray, with a strand being threaded from it",
      '<path class="sk-tint" d="M28 102 C28 86 52 76 82 76 C112 76 136 86 136 102' +
        ' C136 118 112 128 82 128 C52 128 28 118 28 102 Z"/>' +
      '<path class="sk-ink" d="M28 102 C28 86 52 76 82 76 C112 76 136 86 136 102' +
        ' C136 118 112 128 82 128 C52 128 28 118 28 102 Z"/>' +
      '<path class="sk-thin sk-ink" d="M36 102 C36 90 56 82 82 82 C108 82 128 90 128 102"/>' +
      '<g class="sk-ink sk-thin">' +
        '<circle cx="52" cy="104" r="5"/><circle cx="66" cy="112" r="4"/>' +
        '<circle cx="80" cy="102" r="6"/><circle cx="96" cy="110" r="4.5"/>' +
        '<circle cx="112" cy="101" r="5"/><circle cx="64" cy="96" r="3.5"/>' +
        '<rect x="88" y="88" width="9" height="9" rx="2" transform="rotate(-16 92.5 92.5)"/>' +
        '<ellipse cx="120" cy="110" rx="6" ry="4" transform="rotate(-20 120 110)"/>' +
      '</g>' +
      '<g class="sk-dot">' +
        '<circle cx="52" cy="104" r="1.3"/><circle cx="80" cy="102" r="1.4"/>' +
        '<circle cx="112" cy="101" r="1.3"/>' +
      '</g>' +
      '<path class="sk-warm" d="M108 86 C124 74 132 56 150 46 C162 39 172 32 180 22"/>' +
      '<g class="sk-ink sk-thin">' +
        '<circle cx="118" cy="78" r="5"/>' +
        '<ellipse cx="132" cy="64" rx="6.5" ry="4.5" transform="rotate(-45 132 64)"/>' +
        '<rect x="142" y="48" width="9" height="9" rx="2" transform="rotate(-30 146.5 52.5)"/>' +
        '<circle cx="160" cy="40" r="4.5"/>' +
        '<circle cx="171" cy="32" r="3"/>' +
      '</g>' +
      '<g class="sk-ink">' +
        '<path d="M180 22 L194 6"/>' +
        '<ellipse cx="181" cy="20" rx="1.6" ry="3.2" transform="rotate(-45 181 20)"/>' +
      '</g>' +
      '<path class="sk-warm sk-thin" d="M108 86 C101 90 99 96 103 99"/>' +
      '<g class="sk-ink sk-thin">' +
        '<circle cx="44" cy="140" r="5"/><circle cx="60" cy="144" r="3.5"/>' +
      '</g>' +
      '<g class="sk-dot"><circle cx="44" cy="140" r="1.5"/></g>' +
      '<path class="sk-soft" d="M20 150 C60 145 130 154 176 148"/>'),

    /* a shelf of pots that were meant to match */
    three: svg("A sketch of three pots on a shelf, no two the same shape",
      '<path class="sk-tint" d="M44 48 C52 44 68 44 76 48 C72 56 68 62 74 72' +
        ' C82 86 80 114 62 128 C44 120 36 94 42 74 C46 62 46 54 44 48 Z"/>' +
      '<path class="sk-ink" d="M44 48 C52 44 68 44 76 48 C72 56 68 62 74 72' +
        ' C82 86 80 114 62 128 C44 120 36 94 42 74 C46 62 46 54 44 48 Z"/>' +
      '<g class="sk-warm sk-thin">' +
        '<path d="M44 62 C52 65 68 65 75 62"/>' +
        '<path d="M40 82 C50 86 74 86 79 81"/>' +
        '<path d="M38 98 C50 102 72 102 79 97"/>' +
      '</g>' +
      '<path class="sk-tint" d="M92 68 C100 62 122 62 130 69 C134 80 132 108 122 124' +
        ' C106 132 94 126 91 114 C87 98 89 78 92 68 Z"/>' +
      '<path class="sk-ink" d="M92 68 C100 62 122 62 130 69 C134 80 132 108 122 124' +
        ' C106 132 94 126 91 114 C87 98 89 78 92 68 Z"/>' +
      '<path class="sk-ink sk-thin" d="M106 64 L110 69 L115 63"/>' +
      '<g class="sk-warm sk-thin">' +
        '<path d="M90 84 C100 88 124 88 132 83"/>' +
        '<path d="M91 100 C101 104 123 104 131 99"/>' +
      '</g>' +
      '<path class="sk-tint" d="M142 86 C150 81 178 82 184 88 C180 106 170 122 163 122' +
        ' C154 122 142 102 142 86 Z"/>' +
      '<path class="sk-ink" d="M142 86 C150 81 178 82 184 88 C180 106 170 122 163 122' +
        ' C154 122 142 102 142 86 Z"/>' +
      '<g class="sk-ink sk-thin">' +
        '<path d="M156 121 L156 128"/><path d="M172 118 L172 126"/>' +
      '</g>' +
      '<path class="sk-warm sk-thin" d="M144 96 C154 100 174 99 181 95"/>' +
      /* the shelf they're standing on */
      '<path class="sk-ink" d="M14 128 C60 123 140 131 188 125 L188 138' +
        ' C140 144 60 136 14 141 Z"/>' +
      '<g class="sk-hair sk-ink"><path d="M20 134 C70 130 140 137 182 132"/></g>'),

    /* the table everything happens on */
    table: svg("A sketch of a craft table: brushes in a jar, a palette, scissors and a spool of thread",
      '<path class="sk-tint" d="M20 80 C20 112 24 126 38 126 C52 126 56 112 56 80' +
        ' C44 76 32 76 20 80 Z"/>' +
      '<g class="sk-ink">' +
        '<path d="M20 80 C20 112 24 126 38 126 C52 126 56 112 56 80 C44 76 32 76 20 80 Z"/>' +
        '<path class="sk-thin" d="M20 80 C32 85 44 85 56 80"/>' +
        '<path class="sk-thin" d="M28 78 L17 34"/>' +
        '<path class="sk-thin" d="M17 34 L15.5 28"/>' +
        '<path d="M15.5 28 C11 21 15 11 20 15 C24 19 22 26 19 30 Z"/>' +
        '<path class="sk-thin" d="M38 78 L38 30"/>' +
        '<path class="sk-thin" d="M34 30 H42"/>' +
        '<path d="M35 30 L34 12 H42 L41 30 Z"/>' +
        '<path class="sk-thin" d="M48 78 L59 36"/>' +
        '<path class="sk-thin" d="M59 36 L61 30"/>' +
        '<path d="M61 30 C66 23 72 25 69 31 C67 36 63 37 61 34 Z"/>' +
      '</g>' +
      /* the palette, still wet */
      '<path class="sk-ink sk-thin" d="M64 106 C64 95 79 88 95 90 C112 92 120 101 118 112' +
        ' C116 122 101 128 85 126 C70 124 64 116 64 106 Z"/>' +
      '<circle class="sk-ink sk-thin" cx="76" cy="112" r="5"/>' +
      '<g class="sk-tint">' +
        '<circle cx="88" cy="97" r="5"/><circle cx="105" cy="107" r="4.5"/>' +
      '</g>' +
      '<g class="sk-tint-leaf">' +
        '<circle cx="99" cy="99" r="4"/><circle cx="90" cy="118" r="4.5"/>' +
      '</g>' +
      '<g class="sk-dot"><circle cx="103" cy="117" r="3.4"/></g>' +
      /* scissors */
      '<g class="sk-ink sk-thin">' +
        '<path d="M128 44 C132 54 140 72 145 84 C140 87 135 83 133 78 C128 66 125 50 125 45 Z"/>' +
        '<path d="M152 44 C148 54 140 72 135 84 C140 87 145 83 147 78 C152 66 155 50 155 45 Z"/>' +
        '<path d="M137 90 C135 96 133 100 132 103"/>' +
        '<path d="M143 90 C145 96 147 100 148 103"/>' +
        '<ellipse cx="130" cy="111" rx="8" ry="7"/>' +
        '<ellipse cx="150" cy="111" rx="8" ry="7"/>' +
      '</g>' +
      '<g class="sk-dot"><circle cx="140" cy="86" r="2"/></g>' +
      /* the spool, unwinding across the table */
      '<g class="sk-ink sk-thin">' +
        '<path d="M166 96 L166 126"/><path d="M186 96 L186 126"/>' +
        '<path d="M164 95 C170 91 182 91 188 95 C182 99 170 99 164 95 Z"/>' +
        '<path d="M164 126 C170 122 182 122 188 126 C182 130 170 130 164 126 Z"/>' +
      '</g>' +
      '<g class="sk-warm sk-thin">' +
        '<path d="M167 104 C172 106 180 106 185 104"/>' +
        '<path d="M167 111 C172 113 180 113 185 111"/>' +
        '<path d="M167 118 C172 120 180 120 185 118"/>' +
      '</g>' +
      '<path class="sk-warm" d="M186 114 C195 119 194 132 182 137 C166 143 132 141 112 136"/>' +
      '<g class="sk-ink sk-thin">' +
        '<circle cx="104" cy="138" r="4"/><circle cx="92" cy="142" r="3"/>' +
      '</g>' +
      '<path class="sk-soft" d="M12 148 C60 142 130 152 190 145"/>'),

    /* rolling a slab out, and the coil wound from it */
    coil: svg("A sketch of a rolling pin, a rolled clay slab and a coil wound from it",
      '<path class="sk-tint" d="M46 30 C76 26 124 26 152 30 C156 36 156 52 152 58' +
        ' C124 62 76 62 46 58 C42 52 42 36 46 30 Z"/>' +
      '<path class="sk-ink" d="M46 30 C76 26 124 26 152 30 C156 36 156 52 152 58' +
        ' C124 62 76 62 46 58 C42 52 42 36 46 30 Z"/>' +
      '<g class="sk-hair sk-ink">' +
        '<path d="M62 29 C60 40 60 50 63 59"/>' +
        '<path d="M86 28 C84 40 84 50 87 60"/>' +
        '<path d="M112 28 C110 40 110 50 113 60"/>' +
        '<path d="M136 29 C134 40 134 50 137 59"/>' +
      '</g>' +
      '<g class="sk-ink sk-thin">' +
        '<path d="M46 44 L28 44"/><path d="M28 39 L28 49"/>' +
        '<path d="M152 44 L170 44"/><path d="M170 39 L170 49"/>' +
      '</g>' +
      '<path class="sk-tint" d="M22 88 C56 80 96 82 118 90 C114 108 106 118 94 122' +
        ' C64 130 32 120 22 108 Z"/>' +
      '<path class="sk-ink" d="M22 88 C56 80 96 82 118 90 C114 108 106 118 94 122' +
        ' C64 130 32 120 22 108 Z"/>' +
      '<g class="sk-hair sk-ink">' +
        '<path d="M32 96 C56 91 84 92 106 98"/>' +
        '<path d="M30 106 C54 101 84 103 104 109"/>' +
        '<path d="M34 116 C56 112 80 114 96 118"/>' +
      '</g>' +
      '<g class="sk-warm">' +
        '<path d="M150 114 C136 116 128 106 136 97 C145 87 166 90 171 102' +
          ' C176 116 162 132 144 130 C124 128 112 113 118 98"/>' +
        '<path class="sk-thin" d="M152 108 C144 109 140 104 144 99 C150 93 162 95 165 103"/>' +
      '</g>' +
      '<path class="sk-warm" d="M30 142 C56 136 84 145 112 139"/>' +
      '<path class="sk-hair sk-warm" d="M32 146 C58 140 86 149 112 143"/>'),

    /* work in the hoop, needle still in the cloth */
    bloom: svg("A sketch of a flower being embroidered in a hoop, the needle still in the cloth",
      '<circle class="sk-tint" cx="92" cy="90" r="48"/>' +
      '<g class="sk-hair sk-ink">' +
        '<path d="M66 106 L66 126"/><path d="M78 104 L78 128"/>' +
        '<path d="M90 106 L90 130"/><path d="M102 104 L102 128"/>' +
        '<path d="M114 108 L114 124"/>' +
        '<path d="M58 110 L126 110"/><path d="M56 118 L128 118"/>' +
        '<path d="M60 126 L124 126"/>' +
      '</g>' +
      '<g class="sk-ink">' +
        '<circle cx="92" cy="90" r="54"/>' +
        '<circle cx="92" cy="90" r="48"/>' +
        '<path d="M80 38 L80 22 C80 16 85 13 92 13 C99 13 104 16 104 22 L104 38"/>' +
        '<path class="sk-thin" d="M92 13 L92 5"/>' +
        '<path d="M83 5 C83 0 101 0 101 5 C101 10 83 10 83 5 Z"/>' +
      '</g>' +
      '<g class="sk-warm">' +
        '<path d="M92 76 C80 64 80 48 92 45 C104 48 104 64 92 76 Z"/>' +
        '<path d="M92 76 C80 64 80 48 92 45 C104 48 104 64 92 76 Z" transform="rotate(72 92 76)"/>' +
        '<path d="M92 76 C80 64 80 48 92 45 C104 48 104 64 92 76 Z" transform="rotate(144 92 76)"/>' +
        '<path d="M92 76 C80 64 80 48 92 45 C104 48 104 64 92 76 Z" transform="rotate(216 92 76)"/>' +
        '<path d="M92 76 C80 64 80 48 92 45 C104 48 104 64 92 76 Z" transform="rotate(288 92 76)"/>' +
      '</g>' +
      '<g class="sk-ink sk-thin">' +
        '<circle cx="88" cy="73" r="3"/><circle cx="95" cy="72" r="2.6"/>' +
        '<circle cx="92" cy="79" r="2.6"/>' +
      '</g>' +
      '<g class="sk-leaf">' +
        '<path d="M92 82 C95 96 92 110 87 122"/>' +
        '<path class="sk-thin" d="M93 98 C104 93 116 96 120 103 C110 109 98 105 93 98 Z"/>' +
      '</g>' +
      '<path class="sk-warm sk-thin" d="M112 112 C104 104 100 94 100 84"/>' +
      '<g class="sk-ink">' +
        '<path d="M112 112 L128 126"/>' +
        '<ellipse cx="126.5" cy="124.5" rx="1.6" ry="3.2" transform="rotate(45 126.5 124.5)"/>' +
      '</g>' +
      /* the cloth spilling out under the hoop, and a thread end hanging */
      '<path class="sk-thin sk-ink" d="M48 128 C56 148 76 156 96 154 C118 152 134 144 142 126"/>' +
      '<path class="sk-warm sk-thin" d="M96 154 C94 158 98 160 102 158"/>'),

    /* a mat on the loom, half woven, the shuttle set down mid-row */
    weave: svg("A sketch of a mat half woven on a loom, with the shuttle set down",
      weaveBody()),

    /* a kolam laid out round its dots, the flour bowl still to hand */
    kolam: svg("A sketch of a kolam drawn around a grid of dots, beside a bowl of rice flour",
      dotGrid([54, 70, 86, 102, 118], [48, 64, 80, 96, 112], 1.8) +
      '<g class="sk-ink">' +
        '<path d="M86 34 C104 52 114 62 132 80 C114 98 104 108 86 126' +
          ' C68 108 58 98 40 80 C58 62 68 52 86 34 Z"/>' +
        '<path class="sk-thin" d="M86 56 C96 66 100 70 110 80 C100 90 96 94 86 104' +
          ' C76 94 72 90 62 80 C72 70 76 66 86 56 Z"/>' +
      '</g>' +
      /* the curl at each of the four points, where the line turns back on itself */
      '<g class="sk-warm sk-thin">' +
        '<path d="M86 34 C79 26 87 18 93 23 C98 27 93 35 87 34"/>' +
        '<path d="M132 80 C140 73 148 81 143 87 C139 92 131 87 132 81"/>' +
        '<path d="M86 126 C79 134 87 142 93 137 C98 133 93 125 87 126"/>' +
        '<path d="M40 80 C32 73 24 81 29 87 C33 92 41 87 40 81"/>' +
      '</g>' +
      /* the bowl of rice flour, and what missed the line */
      '<path class="sk-tint" d="M148 116 C148 108 159 103 170 103 C181 103 192 108 192 116' +
        ' C192 126 181 132 170 132 C159 132 148 126 148 116 Z"/>' +
      '<path class="sk-ink sk-thin" d="M148 116 C148 108 159 103 170 103 C181 103 192 108 192 116' +
        ' C192 126 181 132 170 132 C159 132 148 126 148 116 Z"/>' +
      '<path class="sk-ink sk-thin" d="M152 113 C158 104 182 104 188 113"/>' +
      '<g class="sk-hair sk-ink">' +
        '<path d="M158 111 C162 107 166 106 170 106"/>' +
        '<path d="M170 106 C175 106 179 108 182 111"/>' +
        '<path d="M162 116 C168 113 176 114 180 117"/>' +
      '</g>' +
      '<g class="sk-dot">' +
        '<circle cx="142" cy="128" r="1.4"/><circle cx="136" cy="136" r="1.2"/>' +
        '<circle cx="150" cy="138" r="1.2"/><circle cx="128" cy="128" r="1"/>' +
      '</g>' +
      '<path class="sk-soft" d="M24 146 C70 141 140 150 186 144"/>')
  };

  /* the order the sketches appear in as you scroll down the chapters */
  var SEQUENCE = ["thumbprint", "stitchedclay", "beads", "lino", "weave",
                  "coil", "bloom", "kolam", "three", "table"];

  function get(name) { return LIBRARY[name] || null; }
  function nth(index) { return LIBRARY[SEQUENCE[index % SEQUENCE.length]]; }
  function names() { return Object.keys(LIBRARY); }

  return { get: get, nth: nth, names: names };
})();

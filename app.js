(function () {
'use strict';

var progress = (function () { try { return JSON.parse(localStorage.getItem('connect.progress.v1')) || {}; } catch (e) { return {}; } })();
function saveProgress() { try { localStorage.setItem('connect.progress.v1', JSON.stringify(progress)); } catch (e) {} }
function markSolved(id) { if (!progress[id]) { progress[id] = true; saveProgress(); } }

function h(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
}
function btn(label, cls, onClick) {
    var b = h('button', 'btn' + (cls ? ' ' + cls : ''), label);
    b.type = 'button';
    b.addEventListener('click', onClick);
    return b;
}
function verdict(ok, text) { return h('p', 'verdict ' + (ok ? 'ok' : 'no'), text); }

var view = document.getElementById('view');

function connectCards(trio) {
    var wrap = h('div', 'connect');
    [['At home', trio.home], ['At school', trio.school], ['At work', trio.industry]].forEach(function (pair) {
        var c = h('div', 'ccard');
        c.appendChild(h('h3', null, pair[0]));
        c.appendChild(h('p', null, pair[1]));
        wrap.appendChild(c);
    });
    return wrap;
}

function solvedBlock(level, id) {
    var frag = document.createDocumentFragment();
    var co = h('div', 'callout');
    co.appendChild(h('h3', null, 'The principle'));
    co.appendChild(h('p', null, level.principle));
    frag.appendChild(co);
    var sec = h('section');
    sec.appendChild(h('p', 'kicker', 'Connect'));
    sec.appendChild(h('h2', null, 'Where the same idea shows up'));
    sec.appendChild(connectCards(level.connect));
    frag.appendChild(sec);
    frag.appendChild(btn('Back to the map', '', function () { location.hash = '#/'; }));
    return frag;
}

/* ---------------- Exercises ---------------- */

function envTest(level, container, onSolve) {
    var tested = {}, picked = {}, done = false;
    var opts = h('div', 'opts');
    var hint = h('p', 'hint', 'Test every idea before you choose. Deciding without testing is just guessing.');
    container.appendChild(opts);
    container.appendChild(hint);
    level.data.options.forEach(function (o, i) {
        var card = h('div', 'opt');
        card.appendChild(h('p', 'opt-label', o.label));
        var testBtn = btn('Test it for a week', 'ghost', function () {
            tested[i] = true;
            testBtn.remove();
            card.appendChild(h('p', 'outcome', o.outcome));
            var install = btn('Install this fix', '', function () {
                if (done) return;
                if (o.works) {
                    picked[i] = 'good'; card.classList.add('good'); done = true;
                    card.appendChild(verdict(true, "Installed. It works with the morning rush instead of against it: the habit lives where the leaving happens."));
                    opts.querySelectorAll('button').forEach(function (b) { b.disabled = true; });
                    hint.textContent = '';
                    onSolve();
                } else {
                    picked[i] = 'bad'; card.classList.add('bad');
                    install.remove();
                    card.appendChild(verdict(false, 'Your own test says this one still depends on remembering. Pick the fix that worked without it.'));
                }
            });
            card.appendChild(install);
        });
        card.appendChild(testBtn);
        opts.appendChild(card);
    });
}

function sortFixes(level, container, onSolve) {
    var pick = {}, done = false, correctCount = 0;
    container.appendChild(h('p', 'hint', 'For each fix, decide: does it ask people to be careful, or does it make the mistake harmless?'));
    var opts = h('div', 'opts');
    var count = h('p', 'hint', '0 of ' + level.data.items.length + ' sorted correctly');
    container.appendChild(opts);
    container.appendChild(count);
    level.data.items.forEach(function (it, i) {
        var card = h('div', 'opt');
        card.appendChild(h('p', 'opt-label', it.label));
        var row = h('div', 'binrow');
        row.appendChild((function () { var b = btn('Asks for care', 'sm', function () { choose('careful', b); }); return b; })());
        row.appendChild((function () { var b = btn('Designs it out', 'sm', function () { choose('design', b); }); return b; })());
        function choose(binName, b) {
            if (done) return;
            pick[i] = binName;
            row.querySelectorAll('button').forEach(function (x) { x.classList.remove('sel'); });
            b.classList.add('sel');
            card.querySelectorAll('.verdict').forEach(function (v) { v.remove(); });
            var right = binName === it.bin;
            card.classList.toggle('good', right);
            card.classList.toggle('bad', !right);
            card.appendChild(right ? verdict(true, it.why) : verdict(false, 'Look again: does this fix still work when nobody is paying attention?'));
            correctCount = level.data.items.filter(function (x, j) { return pick[j] === x.bin; }).length;
            count.textContent = correctCount + ' of ' + level.data.items.length + ' sorted correctly' + (correctCount === level.data.items.length ? '. All six!' : '');
            if (correctCount === level.data.items.length) { done = true; onSolve(); }
        }
        card.appendChild(row);
        opts.appendChild(card);
    });
}

function ladderOrder(level, container, onSolve) {
    var ORDER = [2, 4, 1, 5, 3];
    var placed = [], done = false;
    var pool = h('div', 'ladder-pool');
    var msg = h('div');
    var ladder = h('div', 'ladder');
    container.appendChild(pool);
    container.appendChild(msg);
    container.appendChild(ladder);
    function drawLadder() {
        ladder.innerHTML = '';
        [5, 4, 3, 2, 1].forEach(function (r) {
            var d = h('div', 'rung' + (placed.indexOf(r) >= 0 ? ' filled' : ''));
            d.appendChild(h('span', 'rung-n', placed.indexOf(r) >= 0 ? 'Rung ' + r : ''));
            d.appendChild(h('span', 'rung-name', placed.indexOf(r) >= 0 ? RUNGS[r - 1].name : (r === placed.length + 1 ? 'Next rung up' : '')));
            ladder.appendChild(d);
        });
    }
    drawLadder();
    ORDER.forEach(function (r) {
        var b = h('button', 'btn ghost wide');
        b.type = 'button';
        var st = document.createElement('strong'); st.textContent = RUNGS[r - 1].name;
        var sp = h('span', null, RUNGS[r - 1].desc);
        b.appendChild(st); b.appendChild(sp);
        b.addEventListener('click', function () {
            if (done) return;
            if (r === placed.length + 1) {
                placed.push(r); b.remove(); msg.innerHTML = ''; drawLadder();
                if (placed.length === RUNGS.length) {
                    done = true;
                    var rev = h('div', 'reveal');
                    rev.appendChild(h('p', null, level.data.reveal));
                    container.appendChild(rev);
                    onSolve();
                }
            } else {
                msg.innerHTML = '';
                msg.appendChild(verdict(false, 'Not yet. Of the fixes still on the table, which one leans hardest on memory and goodwill? That one sits lowest.'));
            }
        });
        pool.appendChild(b);
    });
}

function evidencePick(level, container, onSolve) {
    var sel = {}, phase = 'pick', done = false;
    var opts = h('div', 'opts');
    var action = h('div');
    container.appendChild(opts);
    container.appendChild(action);
    var cards = [];
    level.data.statements.forEach(function (s, i) {
        var card = h('div', 'opt toggle');
        var b = h('button', 'toggle-btn');
        b.type = 'button';
        var chk = h('span', 'check');
        var lbl = h('span', 'opt-label', s.text);
        b.appendChild(chk); b.appendChild(lbl);
        b.addEventListener('click', function () {
            if (phase !== 'pick') return;
            sel[i] = !sel[i];
            chk.textContent = sel[i] ? '✓' : '';
            card.classList.toggle('on', !!sel[i]);
        });
        card.appendChild(b);
        opts.appendChild(card);
        cards.push(card);
    });
    function renderAction() {
        action.innerHTML = '';
        if (phase === 'pick') {
            action.appendChild(btn('Check my picks', '', function () {
                phase = 'result';
                var allRight = level.data.statements.every(function (s, i) { return !!sel[i] === s.evidence; });
                level.data.statements.forEach(function (s, i) {
                    var picked = !!sel[i], right = picked === s.evidence;
                    cards[i].classList.add(right ? 'good' : 'bad');
                    cards[i].appendChild(verdict(right, (right
                        ? (s.evidence ? 'Evidence. ' : 'Not evidence. ')
                        : (s.evidence ? 'This one is evidence: ' : 'This one is not evidence: ')) + s.why));
                });
                if (allRight) {
                    done = true;
                    action.appendChild(verdict(true, 'Exactly. Three claims, three kinds of proof.'));
                    onSolve();
                } else {
                    var again = btn('Adjust my picks and check again', 'ghost', function () {
                        phase = 'pick';
                        cards.forEach(function (c) {
                            c.classList.remove('good', 'bad');
                            c.querySelectorAll('.verdict').forEach(function (v) { v.remove(); });
                        });
                        renderAction();
                    });
                    action.appendChild(again);
                }
            }));
        }
    }
    renderAction();
}

function familyFix(level, container, onSolve) {
    var day = 1, stage = 'days', done = false;
    var days = h('div', 'days');
    var next = h('div');
    var qa = h('div');
    container.appendChild(days);
    container.appendChild(next);
    container.appendChild(qa);
    function drawDays() {
        days.innerHTML = '';
        level.data.incidents.slice(0, day).forEach(function (t) { days.appendChild(h('p', 'day', t)); });
    }
    drawDays();
    function drawNext() {
        next.innerHTML = '';
        if (stage !== 'days') return;
        next.appendChild(day < level.data.incidents.length
            ? btn('Next day', '', function () { day++; drawDays(); drawNext(); })
            : btn('Enough. What is going on?', '', function () { stage = 'pattern'; drawNext(); drawPattern(); }));
    }
    drawNext();
    function mcq(options, onCorrect) {
        var wrap = h('div', 'opts');
        options.forEach(function (o) {
            var card = h('div', 'opt');
            var b = btn(o.text, 'ghost wide left', function () {
                if (card.dataset.locked) return;
                card.classList.add(o.correct ? 'good' : 'bad');
                card.appendChild(verdict(o.correct, o.why));
                if (o.correct) {
                    card.dataset.locked = '1';
                    onCorrect();
                }
            });
            card.appendChild(b);
            wrap.appendChild(card);
        });
        return wrap;
    }
    function drawPattern() {
        qa.innerHTML = '';
        qa.appendChild(h('p', 'q', level.data.patternQuestion));
        qa.appendChild(mcq(level.data.patternOptions, function () { setTimeout(drawFix, 350); }));
    }
    function drawFix() {
        qa.appendChild(h('p', 'q', level.data.fixQuestion));
        qa.appendChild(mcq(level.data.fixOptions, function () {
            if (!done) { done = true; setTimeout(onSolve, 350); }
        }));
    }
}

function stallSim(level, container, onSolve) {
    var q = 2, s = 3, runs = [], done = false;
    var QW = ['', 'Chaotic', 'Careless', 'Okay', 'Careful', 'Rock solid'];
    var SW = ['', 'Crawl', 'Slow', 'Steady', 'Brisk', 'Flat out'];
    var dials = h('div', 'dials');
    function dial(name, words, get, set) {
        var lab = h('label', 'dial');
        var nm = h('span', 'dial-name');
        nm.innerHTML = '';
        var input = document.createElement('input');
        input.type = 'range'; input.min = 1; input.max = 5; input.value = get();
        input.setAttribute('aria-label', name);
        function sync() { nm.textContent = name + ': '; var st = document.createElement('strong'); st.textContent = words[input.value]; nm.appendChild(st); }
        input.addEventListener('input', function () { set(Number(input.value)); sync(); });
        sync();
        lab.appendChild(nm); lab.appendChild(input);
        return { lab: lab, input: input };
    }
    var dq = dial('Process quality', QW, function () { return q; }, function (v) { q = v; });
    var ds = dial('Speed', SW, function () { return s; }, function (v) { s = v; });
    dials.appendChild(dq.lab); dials.appendChild(ds.lab);
    container.appendChild(dials);
    var stall = h('div', 'stall');
    var hist = h('div', 'history');
    var runBtn = btn('Serve 20 cups', '', function () {
        var rate = 0.03 * (6 - q) + 0.06 * Math.max(0, s - q);
        var mistakes = Math.round(20 * rate);
        runs.push({ q: q, s: s, mistakes: mistakes });
        stall.innerHTML = '';
        var cups = h('div', 'cups');
        for (var i = 0; i < 20; i++) cups.appendChild(h('span', 'cup' + (i < mistakes ? ' spill' : '')));
        stall.appendChild(cups);
        stall.appendChild(h('p', 'outcome', mistakes === 0 ? 'Perfect run: 20 cups, zero spills.'
            : mistakes + ' of 20 cups spilled. ' + (mistakes >= 4 ? 'The queue loved the speed, right up until the spills.' : 'So close.')));
        if (mistakes <= 1 && s < 4) stall.appendChild(h('p', 'hint', 'Clean, but the goal also wants the speed dial at 4 or higher. Can a solid process handle more speed?'));
        if (mistakes > 1 && s > q) stall.appendChild(h('p', 'hint', 'Speed is outpacing quality. Try turning quality up before speed.'));
        hist.innerHTML = '';
        var start = Math.max(0, runs.length - 4);
        runs.slice(start).forEach(function (r, i) {
            hist.appendChild(h('p', 'history-line', 'Run ' + (start + i + 1) + ': quality ' + r.q + ', speed ' + r.s + ' → ' + r.mistakes + ' spilled'));
        });
        if (mistakes <= 1 && s >= 4 && !done) {
            done = true;
            stall.appendChild(verdict(true, 'Goal met. Notice the order that got you here: quality first, then speed.'));
            onSolve();
        }
    });
    container.appendChild(runBtn);
    container.appendChild(stall);
    container.appendChild(hist);
}

function planBuilder(container, onSolve) {
    var annoy = null, mistake = null, rung = null, upgrade = null, evidence = null, done = false;
    function choiceList(items, pick, setPick) {
        var wrap = h('div', 'opts');
        items.forEach(function (t, i) {
            var b = btn(t, 'ghost wide left' + (pick === i ? ' sel' : ''), function () { setPick(i); draw(); });
            wrap.appendChild(b);
        });
        return wrap;
    }
    function draw() {
        container.innerHTML = '';
        container.appendChild(h('p', 'q', '1. Pick a problem that keeps coming back'));
        container.appendChild(choiceList(CAPSTONE.annoyances.map(function (x) { return x.label; }), annoy, function (i) { annoy = i; mistake = null; rung = null; upgrade = null; evidence = null; }));
        if (annoy === null) return;
        var a = CAPSTONE.annoyances[annoy];
        container.appendChild(h('p', 'q', '2. What actually goes wrong?'));
        container.appendChild(choiceList(a.mistakes, mistake, function (i) { mistake = i; }));
        if (mistake === null) return;
        container.appendChild(h('p', 'q', "3. Honestly: where is today's fix on the ladder?"));
        container.appendChild(choiceList(RUNGS.map(function (r, i) { return 'Rung ' + (i + 1) + ': ' + r.name + ' — ' + r.desc; }), rung !== null ? rung - 1 : null, function (i) { rung = i + 1; upgrade = null; }));
        if (rung === null) return;
        var upgradeOptions = rung < 5 ? CAPSTONE.upgrades.filter(function (u) { return u.rung > rung; }) : [CAPSTONE.upgrades[2]];
        container.appendChild(h('p', 'q', '4. Climb exactly one rung. Pick your upgrade'));
        if (rung === 5) container.appendChild(h('p', 'hint', "You placed today's fix on rung 5, the top. Your upgrade then is a guard that keeps the design strong:"));
        container.appendChild(choiceList(upgradeOptions.map(function (u) { return u.text; }), upgrade, function (i) { upgrade = i; }));
        if (upgrade === null) return;
        container.appendChild(h('p', 'q', '5. What evidence will show it worked?'));
        container.appendChild(choiceList(CAPSTONE.evidence, evidence, function (i) { evidence = i; }));
        if (evidence === null) return;
        var plan = h('div', 'plan');
        plan.appendChild(h('h3', null, 'My ladder plan'));
        plan.appendChild(h('p', null, ''));
        var rows = [['Problem', a.label], ['What goes wrong', a.mistakes[mistake]],
            ["Today's fix", 'rung ' + rung + ', ' + RUNGS[rung - 1].name],
            ['One rung higher', upgradeOptions[upgrade].text],
            ['Evidence', CAPSTONE.evidence[evidence]]];
        plan.innerHTML = '<h3>My ladder plan</h3>';
        rows.forEach(function (r) {
            var p = h('p');
            var st = document.createElement('strong'); st.textContent = r[0] + ': ';
            p.appendChild(st);
            p.appendChild(document.createTextNode(r[1]));
            plan.appendChild(p);
        });
        var copy = btn('Copy my plan', '', function () {
            var text = 'My ladder plan\n' + rows.map(function (r) { return r[0] + ': ' + r[1]; }).join('\n');
            function fallback() {
                var ta = document.createElement('textarea');
                ta.value = text; document.body.appendChild(ta); ta.select();
                try { document.execCommand('copy'); copy.textContent = 'Copied'; } catch (e) { copy.textContent = 'Copy not available — select the text above'; }
                ta.remove();
            }
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(function () { copy.textContent = 'Copied'; }, fallback);
            } else fallback();
        });
        plan.appendChild(copy);
        container.appendChild(plan);
        if (!done) { done = true; onSolve(); }
    }
    draw();
}

/* ---------------- Views ---------------- */

function renderHome() {
    var doneCount = LEVELS.filter(function (l) { return progress[l.id]; }).length + (progress[CAPSTONE.id] ? 1 : 0);
    var total = LEVELS.length + 1;

    var hero = h('div', 'hero');
    var himg = document.createElement('img');
    himg.src = HERO_IMG; himg.alt = 'A path linking a home doorway, a school desk and a small factory';
    hero.appendChild(himg);
    var ht = h('div', 'hero-text');
    ht.appendChild(h('p', null, 'Every exercise starts with a problem you already know. By the end, you\'ve been thinking the way engineers, scientists and designers think at work.'));
    hero.appendChild(ht);
    view.appendChild(hero);

    var s1 = h('section');
    s1.appendChild(h('p', 'kicker', 'The big idea'));
    s1.appendChild(h('h2', null, 'When trying harder isn\u2019t enough'));
    s1.appendChild(h('p', 'lede', 'Each level opens with an everyday problem. You try out the fixes, watch what happens, and find the school idea sitting inside it. Then you see where working people use the same idea.'));
    var ol = h('ol', 'rungs');
    RUNGS.forEach(function (r) {
        var li = document.createElement('li');
        var st = document.createElement('strong'); st.textContent = r.name + ': ';
        li.appendChild(st);
        li.appendChild(document.createTextNode(r.desc));
        ol.appendChild(li);
    });
    s1.appendChild(ol);
    s1.appendChild(h('span', 'cap', 'This is the trust ladder, weakest fix to strongest. You get to climb it yourself in level 3.'));
    view.appendChild(s1);

    var s2 = h('section');
    s2.appendChild(h('p', 'kicker', 'Your path'));
    s2.appendChild(h('h2', null, doneCount ? 'The levels · ' + doneCount + ' of ' + total + ' done' : 'The levels'));
    var pr = h('div', 'progress');
    var bar = h('div', 'progress-bar');
    bar.style.width = (100 * doneCount / total) + '%';
    pr.appendChild(bar);
    s2.appendChild(pr);
    var grid = h('div', 'grid');
    function card(n, title, tagline, img, alt, done, hash) {
        var c = h('button', 'card' + (done ? ' done' : ''));
        c.type = 'button';
        var im = document.createElement('img');
        im.src = img; im.alt = alt; im.loading = 'lazy';
        c.appendChild(im);
        var body = h('span', 'card-body');
        body.appendChild(h('span', 'card-n', n + (done ? ' · done ✓' : '')));
        body.appendChild(h('span', 'card-t', title));
        body.appendChild(h('span', 'card-tag', tagline));
        c.appendChild(body);
        c.addEventListener('click', function () { location.hash = hash; });
        return c;
    }
    LEVELS.forEach(function (l, i) {
        grid.appendChild(card('Level ' + (i + 1), l.title, l.tagline, l.img, l.imgAlt, !!progress[l.id], '#/' + l.id));
    });
    grid.appendChild(card('Capstone', CAPSTONE.title, CAPSTONE.tagline, CAPSTONE_IMG, 'A student pinning a hand-drawn plan on a wall', !!progress[CAPSTONE.id], '#/capstone'));
    s2.appendChild(grid);
    view.appendChild(s2);

    var s3 = h('section');
    s3.appendChild(h('h2', null, 'About this series'));
    s3.appendChild(h('p', 'lede', 'Made for self-directed learners from roughly upper primary onwards, and for teachers to adapt to their own classes. No coding, no accounts. Answers are checked on your device and progress stays on it.'));
    var p2 = h('p', 'lede');
    p2.appendChild(document.createTextNode("The series was inspired by engineer Lauren Tan's conference talk "));
    var a1 = document.createElement('a'); a1.href = 'https://ai.engineer/code/2026/talks/lauren-tan'; a1.textContent = 'All Code Is Slop (Except Mine)';
    p2.appendChild(a1);
    p2.appendChild(document.createTextNode(' at AI Engineer CODE 2026 ('));
    var a2 = document.createElement('a'); a2.href = 'https://www.youtube.com/watch?v=O_zcc6Xl12g'; a2.textContent = 'watch the talk';
    p2.appendChild(a2);
    p2.appendChild(document.createTextNode('). Her talk is aimed at software teams; the exercises here are original designs for learners, and the industry examples are simplified illustrations, not claims from the talk.'));
    s3.appendChild(p2);
    s3.appendChild(h('span', 'cap', 'Illustrations are AI-generated for this series.'));
    view.appendChild(s3);
}

function renderLevel(level, n) {
    var bb = h('button', 'back', '‹ All levels'); bb.type = 'button'; bb.addEventListener('click', function () { location.hash = '#/'; }); view.appendChild(bb);
    var sec = h('section');
    sec.appendChild(h('p', 'kicker', 'Level ' + n + ' of ' + LEVELS.length));
    sec.appendChild(h('h2', null, level.title));
    var img = document.createElement('img');
    img.src = level.img; img.alt = level.imgAlt; img.className = 'level-img';
    sec.appendChild(img);
    sec.appendChild(h('span', 'cap', 'Illustration generated for this level.'));
    sec.appendChild(h('p', 'lede', level.story));
    var ex = h('div', 'ex');
    sec.appendChild(ex);
    var solvedArea = h('div');
    sec.appendChild(solvedArea);
    var solved = false;
    function onSolve() {
        if (solved) return;
        solved = true;
        markSolved(level.id);
        solvedArea.appendChild(solvedBlock(level, level.id));
    }
    if (level.kind === 'environment') envTest(level, ex, onSolve);
    else if (level.kind === 'sort') sortFixes(level, ex, onSolve);
    else if (level.kind === 'ladder') ladderOrder(level, ex, onSolve);
    else if (level.kind === 'evidence') evidencePick(level, ex, onSolve);
    else if (level.kind === 'family') familyFix(level, ex, onSolve);
    else if (level.kind === 'sim') stallSim(level, ex, onSolve);
    view.appendChild(sec);
}

function renderCapstone() {
    var bb = h('button', 'back', '‹ All levels'); bb.type = 'button'; bb.addEventListener('click', function () { location.hash = '#/'; }); view.appendChild(bb);
    var sec = h('section');
    sec.appendChild(h('p', 'kicker', 'Capstone'));
    sec.appendChild(h('h2', null, CAPSTONE.title));
    var img = document.createElement('img');
    img.src = CAPSTONE_IMG; img.alt = 'A student pinning a hand-drawn plan on a wall'; img.className = 'level-img';
    sec.appendChild(img);
    sec.appendChild(h('span', 'cap', 'Illustration generated for this level.'));
    sec.appendChild(h('p', 'lede', CAPSTONE.story));
    var ex = h('div', 'ex');
    sec.appendChild(ex);
    var solvedArea = h('div');
    sec.appendChild(solvedArea);
    var solved = false;
    planBuilder(ex, function () {
        if (solved) return;
        solved = true;
        markSolved(CAPSTONE.id);
        var co = h('div', 'callout');
        co.appendChild(h('h3', null, 'What you just did'));
        co.appendChild(h('p', null, "Engineers, scientists and designers climb this ladder for a living. You named a real problem, were honest about today's fix, moved it one rung up, and said how you'd know it worked."));
        solvedArea.appendChild(co);
        var s2 = h('section');
        s2.appendChild(h('p', 'kicker', 'Where this can take you'));
        s2.appendChild(connectCards({
            home: 'Any repeated annoyance at home is a ladder waiting to be climbed: keys, laundry, the mystery of missing socks.',
            school: 'Study systems work the same way. A timetable is rung two; a self-quiz that catches what you forget is rung four.',
            industry: 'Quality engineers, safety officers and software teams all do what you just did: find the family, move one rung up, demand evidence.',
        }));
        solvedArea.appendChild(s2);
        solvedArea.appendChild(btn('Back to the map', '', function () { location.hash = '#/'; }));
    });
    view.appendChild(sec);
}

function route() {
    view.innerHTML = '';
    window.scrollTo(0, 0);
    var hash = location.hash.replace('#/', '');
    var idx = LEVELS.findIndex(function (l) { return l.id === hash; });
    if (idx >= 0) renderLevel(LEVELS[idx], idx + 1);
    else if (hash === 'capstone') renderCapstone();
    else renderHome();
}
window.addEventListener('hashchange', route);
route();
})();

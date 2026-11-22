
const HERO_IMG = 'images/hero.png';
const CAPSTONE_IMG = 'images/capstone.png';

const RUNGS = [
    { name: 'Reminder', desc: "a note, an alarm, someone saying don't forget" },
    { name: 'Written rule', desc: 'an instruction people must read and choose to follow' },
    { name: 'Checklist routine', desc: 'a short ritual practised until it becomes habit' },
    { name: 'Automatic check', desc: 'a test or alarm that catches this kind of mistake whenever it runs' },
    { name: 'Design', desc: 'the thing is built so this particular mistake cannot happen' },
];

const LEVELS = [
    {
        id: 'l1',
        title: 'The hook by the door',
        tagline: 'What works better than a reminder',
        story: "Maya is late for school again. This morning she left her water bottle on the kitchen table, the third time this week. Her family has three ideas. Test each one for a week and see what actually happens.",
        kind: 'environment',
        data: {
            options: [
                { label: "Stick a note on the door: Water bottle!", outcome: "Monday and Tuesday go well. On Wednesday Maya is thinking about a maths quiz and walks straight past the note. By Friday the note is just part of the door.", works: false },
                { label: 'Ask Mum to call out a reminder each morning', outcome: "It works while Mum is home. On Thursday she leaves early for work. No reminder, no bottle.", works: false },
                { label: 'Hang the bottle on a hook by the door, and refill it there every evening', outcome: "The bottle now lives where Maya leaves, so grabbing it is part of leaving rather than an extra thing to remember. It still takes an evening habit of hanging it up — but that is one habit, in the right place.", works: true },
            ],
            question: 'Which fix would you install?',
        },
        principle: 'A reminder asks memory to work at the exact moment memory is busiest. Moving the thing into the path of the routine helps on bad days too, once the new habit itself has stuck.',
        connect: {
            home: 'Hooks by the door for keys. One socket where chargers live. Shoes placed with your bag the night before.',
            school: 'In science, a fair test checks what actually happens, not what we hope will happen. Design and technology is exactly this skill: shaping things so the right action is easy.',
            industry: 'Factories call this error-proofing, or poka-yoke: shape the workspace so a specific mistake cannot happen. It is why many cash machines return your card before your cash.',
        },
        img: 'images/level1.png',
        imgAlt: 'A student taking her water bottle from a hook beside the front door',
    },
    {
        id: 'l2',
        title: 'Signs and fences',
        tagline: 'Warnings, or real protection?',
        story: "Six real fixes, from the riverside path to the apps on your phone. Sort each one: does it just ask people to be careful, or does it actually stop the mistake?",
        kind: 'sort',
        data: {
            items: [
                { label: 'A sign that reads: Path slippery when wet', bin: 'careful', why: 'It only works if someone reads it, believes it and changes how they walk.' },
                { label: 'A guardrail along the river edge', bin: 'design', why: 'A distracted walker is stopped by something solid, not by their own attention.' },
                { label: 'A Caution: hot sticker on a kettle', bin: 'careful', why: 'The warning helps only if you notice it before touching.' },
                { label: 'A kettle with a cool-touch outer wall', bin: 'design', why: 'Touching it is no longer dangerous, so nothing depends on attention.' },
                { label: 'A poster in class: Save your work often!', bin: 'careful', why: 'It depends on you remembering every time, even when you are absorbed.' },
                { label: 'Autosave built into the app', bin: 'design', why: 'Work is saved whether or not anyone remembers.' },
            ],
            bins: { careful: 'Asks people to be careful', design: 'Makes the mistake harmless' },
        },
        principle: 'Warnings are the weakest protection because they borrow attention. Design is strongest exactly where it removes the specific mistake it was built for.',
        connect: {
            home: 'Speed bumps slow cars even when drivers ignore the speed limit sign. A microwave will not run with its door open.',
            school: 'The science lab has rules, but the real protection is equipment: goggles, fume cupboards, low-voltage supplies. Rules are the last line, not the first.',
            industry: 'Safety engineers rank their controls: remove the hazard, build a barrier, and only then warn. Warnings sit at the bottom of the list.',
        },
        img: 'images/level2.png',
        imgAlt: 'A warning sign on one side of a riverside path and a guardrail on the other',
    },
    {
        id: 'l3',
        title: 'The trust ladder',
        tagline: 'Five kinds of fix, from weakest to strongest',
        story: "Every fix for a repeated mistake sits somewhere on a ladder. The higher the rung, the less it depends on people remembering or trying hard. Tap the five kinds of fix in order, weakest first, strongest last.",
        kind: 'ladder',
        data: {
            reveal: "Software teams climb this same ladder. A document full of warnings sits near the bottom. Automatic tests sit near the top. The strongest teams reshape their tools so a known wrong move is rejected automatically. Engineer Lauren Tan describes this as putting trust in the code, not in prose. One thing to keep in mind: the ladder is a rule of thumb, not a law. Higher rungs cost more to build, and they are worth that cost for mistakes that keep coming back, not for one-off mistakes.",
        },
        principle: "Each rung up moves trust out of people's memory and into the system.",
        connect: {
            home: 'A note on the fridge is rung one. A smoke alarm is rung four. A plug that only fits one way is rung five.',
            school: "In maths, 'be careful' is rung one. Substituting your answer back into the equation to check it is rung four: a test that catches a wrong answer whenever you run it.",
            industry: 'Programmers rely on automatic checks that reject a mistake the moment it is written, and on code shaped so invalid moves will not even run. That is why they trust those checks more than review meetings.',
        },
        img: 'images/level3.png',
        imgAlt: 'A five-rung ladder with a sticky note, rulebook, checklist, gauge and gear on its rungs',
    },
    {
        id: 'l4',
        title: 'Show me',
        tagline: 'What would convince you?',
        story: "Aisha has built a model bridge for the science fair. It is really strong, she says. Trust me, I tested it. Which of these would actually convince you? Choose every one that counts as real evidence, then check your picks.",
        kind: 'evidence',
        data: {
            statements: [
                { text: 'A photo of the finished bridge', evidence: false, why: 'It shows the bridge exists. It says nothing about strength.' },
                { text: 'A video of the bridge holding 5 kg', evidence: true, why: 'You can watch it happen, and the bridge could have failed on camera.' },
                { text: "Aisha saying: I promise it works", evidence: false, why: 'Confidence is not a test.' },
                { text: 'Her test log: three trials, the load each time, and the load that finally broke it', evidence: true, why: 'Numbers you could re-check, including the failure. Knowing where it breaks is real knowledge.' },
                { text: "A friend saying: it looks sturdy", evidence: false, why: 'Looks are a guess, not a measurement.' },
                { text: 'A weighing scale left next to the bridge so you can test it yourself', evidence: true, why: 'Evidence you can produce yourself is the strongest kind.' },
            ],
        },
        principle: 'Evidence is a test that could have gone wrong and did not. The easier it is for others to check, the stronger it is.',
        connect: {
            home: "'Dinner is nearly ready' is a claim. The oven timer and a food thermometer are things you can check.",
            school: 'This is the whole idea of a science experiment: a claim plus a test that could prove it wrong. In maths, checking a solution is evidence; thinking it is right is not.',
            industry: 'Good engineers do not just read new code. They run it, watch it behave, and keep the recordings, logs and test results as evidence before anyone trusts it.',
        },
        img: 'images/level4.png',
        imgAlt: 'Two children testing a paper bridge with toy weights',
    },
    {
        id: 'l5',
        title: 'Fix the family, not the spill',
        tagline: 'One fix for a whole family of mistakes',
        story: "Something odd is happening at Jin's study desk. Tap through his week, day by day.",
        kind: 'family',
        data: {
            incidents: [
                'Monday: coffee spills onto his notebook.',
                'Tuesday: a water bottle leaks inside his bag.',
                'Wednesday: a drink carton tips over next to his laptop.',
                "Thursday: his sister's cup knocks over while she reaches for a pen.",
            ],
            patternQuestion: 'What do these accidents have in common?',
            patternOptions: [
                { text: 'Jin is clumsy and should be more careful', correct: false, why: 'Four different drinks and two different people. Blaming clumsiness will not stop the fifth spill.' },
                { text: 'Open drinks live too close to things that hate water', correct: true, why: 'Every accident has the same shape: liquid near paper or electronics. That is a system, not bad luck.' },
                { text: 'The desk is unlucky and should be moved', correct: false, why: 'The same week would happen at the new desk. The pattern follows the drinks, not the furniture.' },
            ],
            fixQuestion: 'Which fix stops the whole family of spills at once?',
            fixOptions: [
                { text: 'Keep cloths nearby and clean spills faster', correct: false, why: 'This accepts the spills and gets better at mopping. The family keeps growing.' },
                { text: 'Make a rule: be careful with drinks', correct: false, why: 'A rule borrows attention at the exact moment everyone is distracted.' },
                { text: 'Drinks live on the low side shelf, in bottles with lids', correct: true, why: 'Now a knock-over spills on the floor, not the laptop, and lids make even that unlikely. One change, and these everyday spills have nowhere to happen.' },
            ],
        },
        principle: 'Before adding another rule, ask whether a check could catch the mistake. Before adding a check, ask whether a design could remove it. Fixing the family beats chasing every mistake one by one.',
        connect: {
            home: 'One cable box near the door ends the daily hunt for chargers in every room.',
            school: 'In maths, memorising one answer fixes one question; learning the method fixes the whole family of questions. Grammar patterns work the same way.',
            industry: 'When software teams see the same bug twice, the best ones do not add another warning. They change their tools so that kind of bug cannot be written at all, and they get their review time back.',
        },
        img: 'images/level5.png',
        imgAlt: 'A boy moving drinks off a cluttered desk onto a low shelf',
    },
    {
        id: 'l6',
        title: 'Good, then fast',
        tagline: 'Fix the process before you speed it up',
        story: "Jia runs a bubble tea stall at the school fun fair. You control two dials: how careful the process is, and how fast it runs. Your goal: serve 20 cups with at most 1 mistake, with the speed dial at 4 or higher. Try speed first and watch what happens.",
        kind: 'sim',
        data: {},
        principle: 'Speeding up a good process makes more good things. Speeding up a messy one just makes mess, faster. Fix the inside first, then add speed.',
        connect: {
            home: 'Packing your bag with a checklist feels slow, until you compare it with unpacking a mess.',
            school: 'Musicians and athletes practise slowly until the movement is right, then add speed. Timed exam practice only helps after the method is solid.',
            industry: 'Factories automate a line only after it runs well by hand. Software teams do the same: strong checks first, then machines writing and merging code at high speed. A factory cannot rescue a bad process by running it faster.',
        },
        img: 'images/level6.png',
        imgAlt: 'A bubble tea stall with two large dials and rows of cups',
    },
];

const CAPSTONE = {
    id: 'capstone',
    title: 'Your turn: climb one rung',
    tagline: 'Use the ladder on a problem from your own life',
    story: 'Pick a small problem from your own life that keeps coming back. Then take it one rung higher than whatever you are doing about it now.',
    annoyances: [
        {
            id: 'deadlines',
            label: 'Keeping track of homework deadlines',
            mistakes: ['I forget a deadline until the night before', 'I write tasks down but never look at the list', 'Two pieces of work collide on the same night'],
        },
        {
            id: 'fridge',
            label: 'The shared fridge at home',
            mistakes: ['Food expires before anyone eats it', 'Nobody knows whose food is whose', 'Leftovers get pushed to the back and forgotten'],
        },
        {
            id: 'bag',
            label: 'Finding things in my bag',
            mistakes: ['Small things sink to the bottom', 'I carry things I never use', 'I cannot find what I need quickly'],
        },
        {
            id: 'files',
            label: 'Group project files getting lost',
            mistakes: ['Nobody knows which version is latest', 'Files sit in five different chats', "Someone overwrites someone else's work"],
        },
    ],
    upgrades: [
        { rung: 2, text: 'Write one clear, visible rule everyone involved has actually seen' },
        { rung: 3, text: 'Build a tiny routine: a checklist run at the same moment every day' },
        { rung: 4, text: 'Set up an automatic check that catches the problem without anyone having to remember: an alarm, a shared calendar, a weekly audit' },
        { rung: 5, text: 'Redesign the setup so this problem has no room to happen: move things, rename them, change the default' },
    ],
    evidence: [
        'A week passes with zero repeats of the problem',
        'Someone else uses my system without me explaining it, and it works',
        'I can show before-and-after proof: photos, a log, a count',
    ],
};

const db = require('./db');

const initialPrompts = [
  // --- PROGRAMMING & COMPUTER SCIENCE ---
  {
    id: 'p1',
    text: "The speed of light in vacuum, commonly denoted c, is a universal physical constant. Its exact value is defined as 299,792,458 meters per second.",
    author: "Physics Trivia",
    category: "Science",
    difficulty: "medium"
  },
  {
    id: 'p2',
    text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    author: "Martin Fowler",
    category: "Programming",
    difficulty: "easy"
  },
  {
    id: 'p3',
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts. Never yield to the apparent limits of your speed.",
    author: "Winston Churchill",
    category: "Motivation",
    difficulty: "medium"
  },
  {
    id: 'p4',
    text: "In computer science, recursion is a method of solving a computational problem where the solution depends on solutions to smaller instances of the same problem.",
    author: "Computer Science",
    category: "Tech",
    difficulty: "hard"
  },
  {
    id: 'p5',
    text: "The quick brown fox jumps over the lazy dog. Swift fingertips dance across mechanical keys with unmatched rhythmic precision.",
    author: "Typing Classic",
    category: "Practice",
    difficulty: "easy"
  },
  {
    id: 'p6',
    text: "Simplicity is prerequisite for reliability. Complex systems tend to fail in complex ways, whereas clean architecture endures under pressure.",
    author: "Edsger W. Dijkstra",
    category: "Programming",
    difficulty: "medium"
  },
  {
    id: 'p7',
    text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
    author: "Ralph Waldo Emerson",
    category: "Philosophy",
    difficulty: "medium"
  },
  {
    id: 'p8',
    text: "Real-time WebSockets allow full-duplex bi-directional communication channels over a single TCP connection, powering sub-millisecond online gaming experiences.",
    author: "Web Engineering",
    category: "Tech",
    difficulty: "hard"
  },
  {
    id: 'p9',
    text: "Talk is cheap. Show me the code. Software development is not about building software, it is about learning and sharing knowledge.",
    author: "Linus Torvalds",
    category: "Programming",
    difficulty: "easy"
  },
  {
    id: 'p10',
    text: "The most dangerous phrase in the language is: We have always done it this way. Innovation requires challenging established paradigms.",
    author: "Grace Hopper",
    category: "Technology",
    difficulty: "medium"
  },
  {
    id: 'p11',
    text: "Premature optimization is the root of all evil in programming. Write clean, readable code first, then measure performance bottlenecks accurately.",
    author: "Donald Knuth",
    category: "Programming",
    difficulty: "medium"
  },
  {
    id: 'p12',
    text: "We can only see a short distance ahead, but we can see plenty there that needs to be done. Computers will conquer the future through logic.",
    author: "Alan Turing",
    category: "Computer Science",
    difficulty: "medium"
  },
  {
    id: 'p13',
    text: "Design is not just what it looks like and feels like. Design is how it works. Stay hungry, stay foolish.",
    author: "Steve Jobs",
    category: "Design",
    difficulty: "easy"
  },
  {
    id: 'p14',
    text: "Python is executable pseudocode. C is memory management made manifest. Rust promises memory safety without garbage collection overhead.",
    author: "Software Architecture",
    category: "Programming",
    difficulty: "hard"
  },
  {
    id: 'p15',
    text: "Object-oriented programming makes code understandable by hiding complexity. Functional programming makes code understandable by minimizing state mutation.",
    author: "Michael Feathers",
    category: "Programming",
    difficulty: "hard"
  },
  {
    id: 'p16',
    text: "UNIX is simple. It just takes a genius to understand its simplicity. Elegance in software comes from small, composable tools.",
    author: "Dennis Ritchie",
    category: "Systems",
    difficulty: "medium"
  },
  {
    id: 'p17',
    text: "The analytical engine weaves algebraic patterns just as the Jacquard loom weaves flowers and leaves.",
    author: "Ada Lovelace",
    category: "History",
    difficulty: "medium"
  },
  {
    id: 'p18',
    text: "Artificial intelligence is the science of making machines do things that would require intelligence if done by men.",
    author: "Marvin Minsky",
    category: "AI & Data",
    difficulty: "medium"
  },

  // --- MOTIVATION & PHILOSOPHY ---
  {
    id: 'p19',
    text: "You have power over your mind, not outside events. Realize this, and you will find strength in every keystroke.",
    author: "Marcus Aurelius",
    category: "Philosophy",
    difficulty: "easy"
  },
  {
    id: 'p20',
    text: "Do not pray for an easy life, pray for the strength to endure a difficult one. Be like water, fluid and adaptable.",
    author: "Bruce Lee",
    category: "Motivation",
    difficulty: "easy"
  },
  {
    id: 'p21',
    text: "We suffer more often in imagination than in reality. True mastery comes from focusing on the present moment.",
    author: "Seneca",
    category: "Philosophy",
    difficulty: "medium"
  },
  {
    id: 'p22',
    text: "It is not the critic who counts; not the man who points out how the strong man stumbles. The credit belongs to the man in the arena.",
    author: "Theodore Roosevelt",
    category: "Motivation",
    difficulty: "hard"
  },
  {
    id: 'p23',
    text: "I have missed more than nine thousand shots in my career. I have failed over and over again in my life. And that is why I succeed.",
    author: "Michael Jordan",
    category: "Sports",
    difficulty: "medium"
  },
  {
    id: 'p24',
    text: "Mamba mentality means focusing on the process and trusting the hard work when nobody is watching.",
    author: "Kobe Bryant",
    category: "Motivation",
    difficulty: "easy"
  },
  {
    id: 'p25',
    text: "The supreme art of war is to subdue the enemy without fighting. Speed, timing, and positioning dictate victory on the battlefield.",
    author: "Sun Tzu",
    category: "Strategy",
    difficulty: "medium"
  },
  {
    id: 'p26',
    text: "Wealth consists not in having great possessions, but in having few wants. Freedom is the only worthy goal in life.",
    author: "Epictetus",
    category: "Philosophy",
    difficulty: "easy"
  },

  // --- SCI-FI & CYBERPUNK ---
  {
    id: 'p27',
    text: "The sky above the port was the color of television, tuned to a dead channel. Cyberspace is a consensual hallucination experienced daily.",
    author: "William Gibson",
    category: "Cyberpunk",
    difficulty: "hard"
  },
  {
    id: 'p28',
    text: "I have seen things you people wouldn't believe. Attack ships on fire off the shoulder of Orion. All those moments will be lost in time, like tears in rain.",
    author: "Blade Runner",
    category: "Sci-Fi",
    difficulty: "medium"
  },
  {
    id: 'p29',
    text: "There is a difference between knowing the path and walking the path. Free your mind from self-imposed limitations.",
    author: "The Matrix",
    category: "Sci-Fi",
    difficulty: "easy"
  },
  {
    id: 'p30',
    text: "I must not fear. Fear is the mind-killer. Fear is the little-death that brings total obliteration. I will face my fear.",
    author: "Frank Herbert",
    category: "Sci-Fi",
    difficulty: "medium"
  },
  {
    id: 'p31',
    text: "Mankind was born on Earth. It was never meant to die here. We used to look up at the sky and wonder at our place in the stars.",
    author: "Interstellar",
    category: "Sci-Fi",
    difficulty: "medium"
  },
  {
    id: 'p32',
    text: "The Grid. A digital frontier. I tried to picture clusters of information as they moved through the computer. What do they look like?",
    author: "TRON: Legacy",
    category: "Cyberpunk",
    difficulty: "medium"
  },
  {
    id: 'p33',
    text: "In Night City, reputation is everything. Every keystroke sends shocks through the net, carving your legacy into optical fiber.",
    author: "Cyberpunk 2077",
    category: "Cyberpunk",
    difficulty: "easy"
  },

  // --- SCIENCE & ASTRONOMY ---
  {
    id: 'p34',
    text: "Somewhere, something incredible is waiting to be known. We are a way for the cosmos to know itself.",
    author: "Carl Sagan",
    category: "Astronomy",
    difficulty: "easy"
  },
  {
    id: 'p35',
    text: "Imagination is more important than knowledge. For knowledge is limited, whereas imagination embraces the entire world.",
    author: "Albert Einstein",
    category: "Science",
    difficulty: "medium"
  },
  {
    id: 'p36',
    text: "Nature uses only the longest threads to weave her patterns, so that each small piece of her fabric reveals the organization of the entire tapestry.",
    author: "Richard Feynman",
    category: "Physics",
    difficulty: "hard"
  },
  {
    id: 'p37',
    text: "Quantum mechanics dictates that particles can exist in multiple superposed states simultaneously until an observation collapses the wave function.",
    author: "Quantum Physics",
    category: "Science",
    difficulty: "hard"
  },
  {
    id: 'p38',
    text: "The James Webb Space Telescope captures infrared light emitted by the earliest galaxies formed shortly after the Big Bang over thirteen billion years ago.",
    author: "NASA Science",
    category: "Astronomy",
    difficulty: "hard"
  },
  {
    id: 'p39',
    text: "Equipped with five sensing organs, man explores the universe around him and calls the adventure Science.",
    author: "Edwin Hubble",
    category: "Science",
    difficulty: "medium"
  },
  {
    id: 'p40',
    text: "Earth is the cradle of humanity, but one cannot live in the cradle forever. Exploration drives civilization forward.",
    author: "Konstantin Tsiolkovsky",
    category: "Space",
    difficulty: "medium"
  },

  // --- LITERATURE & CLASSICS ---
  {
    id: 'p41',
    text: "All the world's a stage, and all the men and women merely players. They have their exits and their entrances.",
    author: "William Shakespeare",
    category: "Literature",
    difficulty: "medium"
  },
  {
    id: 'p42',
    text: "Who controls the past controls the future. Who controls the present controls the past. Freedom is the freedom to say that two plus two make four.",
    author: "George Orwell",
    category: "Literature",
    difficulty: "hard"
  },
  {
    id: 'p43',
    text: "Be yourself; everyone else is already taken. To live is the rarest thing in the world. Most people exist, that is all.",
    author: "Oscar Wilde",
    category: "Literature",
    difficulty: "easy"
  },
  {
    id: 'p44',
    text: "Twenty years from now you will be more disappointed by the things that you didn't do than by the ones you did do. Sail away from the safe harbor.",
    author: "Mark Twain",
    category: "Literature",
    difficulty: "medium"
  },
  {
    id: 'p45',
    text: "Once upon a midnight dreary, while I pondered, weak and weary, over many a quaint and curious volume of forgotten lore.",
    author: "Edgar Allan Poe",
    category: "Poetry",
    difficulty: "hard"
  },
  {
    id: 'p46',
    text: "Not all those who wander are lost. The old that is strong does not wither, deep roots are not reached by the frost.",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
    difficulty: "medium"
  },

  // --- SPEED TYPING DRILLS & RHYTHM ---
  {
    id: 'p47',
    text: "Pack my box with five dozen liquor jugs. Sphynx of black quartz, judge my vow. How vexingly quick daft zebras jump!",
    author: "Pangram Drill",
    category: "Practice",
    difficulty: "hard"
  },
  {
    id: 'p48',
    text: "Rhythmic keypresses build muscle memory. Keep your wrists elevated, fingers relaxed, and eyes focused strictly on incoming words.",
    author: "Typing Ergonomics",
    category: "Practice",
    difficulty: "easy"
  },
  {
    id: 'p49',
    text: "Linear mechanical switches provide a smooth, consistent keystroke actuation without tactile bumps, preferred by competitive typists.",
    author: "Keyboard Hardware",
    category: "Tech",
    difficulty: "medium"
  },
  {
    id: 'p50',
    text: "Accuracy precedes speed. Aiming for one hundred percent accuracy builds subconscious dexterity that naturally accelerates your words per minute.",
    author: "Mastery Coach",
    category: "Practice",
    difficulty: "easy"
  },
  {
    id: 'p51',
    text: "Zero latency feedback loops and high refresh rate monitors reduce visual input delay, empowering typists to react instantly.",
    author: "Gaming Tech",
    category: "Tech",
    difficulty: "medium"
  },
  {
    id: 'p52',
    text: "The secret to rapid typing is fluid momentum. Seamlessly transition between words without pausing on spacebar actuation.",
    author: "Typing Speed",
    category: "Practice",
    difficulty: "easy"
  },
  {
    id: 'p53',
    text: "Distributed cloud databases replicate transactional state across global availability zones to maintain low latency read replicas.",
    author: "Cloud Systems",
    category: "Tech",
    difficulty: "hard"
  },
  {
    id: 'p54',
    text: "Every keystroke is a lap. Push past your personal records, conquer global duels, and claim victory on the cyber track.",
    author: "TypeRace Motto",
    category: "Motivation",
    difficulty: "easy"
  },
  {
    id: 'p55',
    text: "Focus, precision, and relentless practice turn amateur typists into grandmasters of the digital keyboard arena.",
    author: "TypeRace Arena",
    category: "Motivation",
    difficulty: "medium"
  }
];

async function seed() {
  console.log('[Seed] Seeding 55 initial race prompts...');
  
  // Seed Prompts ONLY
  for (const p of initialPrompts) {
    await db.query(
      `INSERT OR REPLACE INTO prompts (id, text, author, category, difficulty) VALUES (?, ?, ?, ?, ?)`,
      [p.id, p.text, p.author, p.category, p.difficulty]
    ).catch(err => {
      db.query(
        `INSERT INTO prompts (id, text, author, category, difficulty) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING`,
        [p.id, p.text, p.author, p.category, p.difficulty]
      ).catch(() => {});
    });
  }

  console.log(`[Seed] Successfully seeded ${initialPrompts.length} race prompts!`);
}

module.exports = seed;

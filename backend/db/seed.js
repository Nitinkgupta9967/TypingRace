const db = require('./db');

const initialPrompts = [
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
  }
];

async function seed() {
  console.log('[Seed] Seeding initial race prompts...');
  
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

  console.log('[Seed] Prompts seeded successfully!');
}

module.exports = seed;


import { Level, StageType } from './types';

export const CODE_SNIPPETS: string[] = [
  "function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[0];\n  const left = arr.filter(x => x < pivot);\n  const right = arr.filter(x => x > pivot);\n  return [...quickSort(left), pivot, ...quickSort(right)];\n}",
  "import React, { useState } from 'react';\n\nconst Counter = () => {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;\n};",
  "def fibonacci(n):\n    if n <= 1: return n\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a",
  "const server = http.createServer((req, res) => {\n  res.statusCode = 200;\n  res.setHeader('Content-Type', 'text/plain');\n  res.end('Hello World\\n');\n});",
  "fn main() {\n    let greetings = [\"Hello\", \"Hola\", \"Bonjour\"];\n    for greeting in greetings.iter() {\n        println!(\"{}, world!\", greeting);\n    }\n}",
  "SELECT users.name, COUNT(orders.id) as order_count\nFROM users\nLEFT JOIN orders ON users.id = orders.user_id\nGROUP BY users.name\nHAVING COUNT(orders.id) > 5;",
  "package main\n\nimport \"fmt\"\n\nfunc main() {\n    messages := make(chan string)\n    go func() { messages <- \"ping\" }()\n    msg := <-messages\n    fmt.Println(msg)\n}",
  "class Dog extends Animal {\n  bark() {\n    console.log('Woof! Woof!');\n  }\n}\nconst myDog = new Dog('Buddy');\nmyDog.bark();",
  "#include <iostream>\nusing namespace std;\n\nint main() {\n    int n = 5;\n    for (int i = 1; i <= n; ++i) {\n        cout << i << \" \";\n    }\n    return 0;\n}"
];

export const QUOTES: string[] = [
  "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. Winston Churchill famously said this during difficult times.",
  "In the end, it's not the years in your life that count. It's the life in your years. Abraham Lincoln's wisdom remains relevant even in the digital age.",
  "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. As with all matters of the heart, you'll know.",
  "It is during our darkest moments that we must focus to see the light. Aristotle's philosophy has guided humanity for centuries.",
  "Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world. Albert Einstein understood the power of the mind.",
  "Life is what happens when you're busy making other plans. John Lennon.",
  "The future belongs to those who believe in the beauty of their dreams. Eleanor Roosevelt.",
  "Tell me and I forget. Teach me and I remember. Involve me and I learn. Benjamin Franklin.",
  "The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart. Helen Keller.",
  "It is never too late to be what you might have been. George Eliot.",
  "Do not go where the path may lead, go instead where there is no path and leave a trail. Ralph Waldo Emerson.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. Martin Fowler.",
  "First, solve the problem. Then, write the code. John Johnson.",
  "Experience is the name everyone gives to their mistakes. Oscar Wilde.",
  "Java is to JavaScript what car is to Carpet. Chris Heilmann.",
  "Knowledge is power. Francis Bacon.",
  "Code is like humor. When you have to explain it, it’s bad. Cory House.",
  "Fix the cause, not the symptom. Steve Maguire.",
  "Optimism is an occupational hazard of programming: feedback is the treatment. Kent Beck.",
  "Simplicity is the soul of efficiency. Austin Freeman.",
  "Before software can be reusable it first has to be usable. Ralph Johnson.",
  "Make it work, make it right, make it fast. Kent Beck.",
  "Talk is cheap. Show me the code. Linus Torvalds."
];

import { Achievement } from './types';
import { Target, Zap, Clock, Ghost, Shield, Award, Terminal, EyeOff, Skull } from 'lucide-react'; // Mock imports for icons

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Reach 100 WPM in any mode',
    icon: 'Zap',
    condition: (stats, last) => last.netWpm >= 100
  },
  {
    id: 'accuracy_master',
    title: 'Sharpshooter',
    description: 'Complete a session with 100% accuracy',
    icon: 'Target',
    condition: (stats, last) => last.accuracy === 100 && last.netWpm > 30
  },
  {
    id: 'marathon',
    title: 'Marathon Runner',
    description: 'Complete 50 sessions',
    icon: 'Clock',
    condition: (stats, last) => stats.totalLevelsCompleted >= 50
  },
  {
    id: 'ghost_buster',
    title: 'Ghost Buster',
    description: 'Beat your own ghost replay',
    icon: 'Ghost',
    condition: (stats, last) => {
      const pb = stats.personalBests[last.levelId];
      return pb && last.netWpm > pb && stats.bestReplays[last.levelId] !== undefined;
    }
  },
  {
    id: 'sudden_death_survivor',
    title: 'Immortal',
    description: 'Survive Sudden Death mode for 1 minute',
    icon: 'Skull',
    condition: (stats, last) => last.levelTitle === 'Sudden Death' && last.timeSeconds >= 60
  },
  {
    id: 'blind_faith',
    title: 'Blind Faith',
    description: 'Complete a Blind Mode session with > 90% accuracy',
    icon: 'EyeOff',
    condition: (stats, last) => last.levelTitle === 'Blind Mode' && last.accuracy > 90
  }
];

export const LEVEL_CONTENT: Record<StageType, string[]> = {
  [StageType.LEFT_HAND]: ["qwert asdfg zxcvb qwert asdfg zxcvb"],
  [StageType.RIGHT_HAND]: ["yuiop hjkl nm yuiop hjkl nm"],
  [StageType.PINKY_DRILL]: ["qp az qp az qp az"],
  [StageType.SINGLE_LETTER]: [
    "aaaa ssss dddd ffff jjjj kkkk llll ;;;; aaaa ssss dddd ffff jjjj kkkk llll ;;;;",
    "asdf jkl; asdf jkl; a s d f j k l ; asdf jkl; asdf jkl; asdf jkl; asdf jkl;",
    "f d s a j k l ; f d s a j k l ; fdsa jkl; fdsa jkl; fdsa jkl; fdsa jkl;"
  ],
  [StageType.DIGRAPHS_TRIGRAPHS]: [
    "th th ing ing and and tion tion th ing and tion th ing and tion th ing and tion",
    "the and ing ion ent her for was hat she the and ing ion ent her for was hat",
    "ing the and ion ent for was hat she th ing and ion ent for was hat she th"
  ],
  [StageType.BASIC_WORDS]: [
    "the and for are but not you all any can had her was out day get has him his",
    "who how now did its see way may use new man our too boy did get set old low",
    "sun fly sky try cry red big small hot cold fast slow high low near far new old"
  ],
  [StageType.LOWERCASE_PRACTICE]: [
    "mountain stream valley breeze sunlight shadow silence morning evening window garden",
    "keyboard monitor mouse computer screen internet website software coding programming",
    "rhythm music dance song voice sound silence echo frequency melody harmony acoustic"
  ],
  [StageType.UPPERCASE_PRACTICE]: [
    "London Paris Tokyo NewYork Berlin Madrid Rome Vienna Sydney Tokyo London Paris",
    "Monday Tuesday Wednesday Thursday Friday Saturday Sunday January February March",
    "Alice Bob Charlie David Eve Frank Grace Heidi Ivan Judy Karl Linda Mallory Nina"
  ],
  [StageType.NUMBER_PROFICIENCY]: [
    "10 20 30 40 50 60 70 80 90 100 2024 1985 101 404 999 000 123 456 789",
    "2023 2024 2025 2026 2027 2028 2029 2030 987 654 321 111 222 333 444",
    "555 666 777 888 999 000 1234 5678 9012 3456 7890 1357 2468 0987 6543"
  ],
  [StageType.SENTENCE_CONSTRUCTION]: [
    "The quick brown fox jumps over the lazy dog. Programming is a creative endeavor.",
    "Practice makes perfect in every skill you learn. Speed comes with consistent focus.",
    "A journey of a thousand miles begins with a single step. Stay humble and keep typing."
  ],
  [StageType.PARAGRAPH_DEVELOPMENT]: [
    "Sustainable energy is transforming the way we power our world. From massive wind turbines to intricate solar arrays, the landscape of global infrastructure is evolving rapidly. Pursuing a greener future remains a core mission for architects and engineers navigating this modern era.",
    "The ocean covers more than seventy percent of our planet's surface, yet much of it remains unexplored. It is a vast ecosystem filled with mysterious creatures and hidden landscapes. Protecting these waters is essential for the future of all life on Earth.",
    "Deep in the heart of the forest, ancient trees stand as silent witnesses to the passage of time. Their roots reach deep into the earth while their branches touch the sky. This delicate balance of nature provides a home for countless species of plants and animals."
  ],
  [StageType.QUOTE_MODE]: QUOTES,
  [StageType.CODE_MODE]: CODE_SNIPPETS,
  [StageType.CUSTOM_MODE]: []
};

export const LEVELS: Level[] = [
  {
    id: 1,
    stage: StageType.SINGLE_LETTER,
    title: "Home Row Basics",
    description: "Master the fundamental position of your fingers.",
    objective: "Develop muscle memory for 'asdf' and 'jkl;' keys.",
    initialContent: LEVEL_CONTENT[StageType.SINGLE_LETTER][0]
  },
  {
    id: 2,
    stage: StageType.DIGRAPHS_TRIGRAPHS,
    title: "Common Combinations",
    description: "Learn pairs and triplets that appear frequently.",
    objective: "Transition smoothly between common letter groups like 'th' and 'ing'.",
    initialContent: LEVEL_CONTENT[StageType.DIGRAPHS_TRIGRAPHS][0]
  },
  {
    id: 3,
    stage: StageType.BASIC_WORDS,
    title: "The Essentials",
    description: "Your first full words in the flow.",
    objective: "Type common short words without looking at the keyboard.",
    initialContent: LEVEL_CONTENT[StageType.BASIC_WORDS][0]
  },
  {
    id: 4,
    stage: StageType.LOWERCASE_PRACTICE,
    title: "Flow State",
    description: "Everyday lowercase vocabulary.",
    objective: "Maintain a steady rhythm across a wider vocabulary of common terms.",
    initialContent: LEVEL_CONTENT[StageType.LOWERCASE_PRACTICE][0]
  },
  {
    id: 5,
    stage: StageType.UPPERCASE_PRACTICE,
    title: "The Shift Key",
    description: "Introducing capitalization.",
    objective: "Learn to use the Shift key efficiently without breaking your stride.",
    initialContent: LEVEL_CONTENT[StageType.UPPERCASE_PRACTICE][0]
  },
  {
    id: 6,
    stage: StageType.NUMBER_PROFICIENCY,
    title: "The Top Row",
    description: "Digits and simple sequences.",
    objective: "Accurately locate numbers on the top row without visual aid.",
    initialContent: LEVEL_CONTENT[StageType.NUMBER_PROFICIENCY][0]
  },
  {
    id: 7,
    stage: StageType.SENTENCE_CONSTRUCTION,
    title: "Complete Thoughts",
    description: "Grammar meets typing speed.",
    objective: "Coordinate letter shifts and punctuation to form fluid sentences.",
    initialContent: LEVEL_CONTENT[StageType.SENTENCE_CONSTRUCTION][0]
  },
  {
    id: 8,
    stage: StageType.PARAGRAPH_DEVELOPMENT,
    title: "Long Form Mastery",
    description: "Full context paragraph typing.",
    objective: "Maintain high accuracy and speed over extended blocks of text.",
    initialContent: LEVEL_CONTENT[StageType.PARAGRAPH_DEVELOPMENT][0]
  }
];

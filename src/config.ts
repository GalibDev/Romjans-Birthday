export const birthday = {
  name: "Romjan",
  letter: [
    "A very special day belongs to a very special person.",
    "Today is a reminder of how amazing, kind, and irreplaceable you are.",
    "This little universe was made just for you.",
  ],
  scenes: [
    "invitation",
    "letter",
    "portal",
    "constellation",
    "garden",
    "memories",
    "challenge",
    "gift",
    "farewell",
  ],
} as const;

export const wishes = [
  {
    id: "happiness",
    title: "Happiness",
    message:
      "May you always find happiness in every little thing you do. You deserve all the good things in this world, Romjan.",
  },
  {
    id: "success",
    title: "Success",
    message:
      "May every small step bring you closer to your biggest dreams. Keep believing in yourself, Romjan — wonderful things are ahead.",
  },
  {
    id: "health",
    title: "Good Health",
    message:
      "May your days be filled with strength, peaceful nights, and the energy to do everything you love.",
  },
  {
    id: "adventures",
    title: "Beautiful Adventures",
    message:
      "May life lead you to beautiful places, unexpected discoveries, and adventures that make your heart feel alive.",
  },
  {
    id: "memories",
    title: "Wonderful Memories",
    message:
      "May you collect moments worth keeping forever, surrounded by people who are happy to share them with you.",
  },
];
export const flowers = [
  "You make ordinary moments feel special.",
  "May your dreams grow bigger every year.",
  "Never lose that wonderful smile.",
  "Your best adventures are still ahead.",
  "Stay exactly the amazing person you are.",
];
export type Memory = {
  id: string;
  image?: string;
  caption: string;
  date?: string;
  description?: string;
};
// Add image: '/images/memories/your-photo.jpg' to any entry when photos are ready.
export const memories: Memory[] = [
  {
    id: "ordinary-days",
    caption: "The ordinary days that became our favourite memories.",
    description:
      "A place for a photo of one of our little everyday adventures.",
  },
  {
    id: "shared-laughter",
    caption: "The kind of laughter we will remember forever.",
    description: "A place for a photo of a moment that still makes us smile.",
  },
  {
    id: "next-adventure",
    caption: "Here is to all the memories we have yet to make.",
    description: "A place for a photo from our next beautiful adventure.",
  },
];
export const quiz = [
  {
    question: "What makes a birthday truly special?",
    answers: [
      "Expensive gifts",
      "People who care about you",
      "A perfect cake",
      "Social media likes",
    ],
    correct: 1,
    feedback: "Exactly. The people who care make every celebration brighter.",
  },
  {
    question: "What should Romjan collect in this magical universe?",
    answers: ["Stress", "Worries", "Happiness and memories", "Homework"],
    correct: 2,
    feedback: "Happiness and memories — the best treasures to keep.",
  },
  {
    question: "What is waiting at the end of this journey?",
    answers: [
      "An ordinary webpage",
      "A magical surprise",
      "A login screen",
      "An exam",
    ],
    correct: 1,
    feedback: "A little magic is waiting just for you!",
  },
];

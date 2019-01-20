import { Problem } from "src/models/problems.model";
import loremIpsum from "lorem-ipsum";

const difficulties: ("easy" | "medium" | "hard")[] = ["easy", "medium", "hard"];

// mock problems
export const MOCK_PROBLEMS = (count: number = 8) => {
  const problems = [];
  for (let i = 0; i < count; i++) {
    problems.push(
      new Problem(`problem${i + 1}`, {
        title: `Problem ${i + 1}`,
        slug: `problem-${i + 1}`,
        coverImg: `https://loremflickr.com/${300 + i}/300`,
        studentVersion: {
          content: loremIpsum(),
          images: []
        },
        facilitatorVersion: {
          extension: loremIpsum(),
          pedagogy: loremIpsum(),
          solution: loremIpsum()
        },
        difficulty: difficulties[Math.floor(Math.random() * 3)]
      })
    );
  }
  return problems;
};

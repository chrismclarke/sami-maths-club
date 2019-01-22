import { Problem, IProblem } from "src/models/problem.model";
import loremIpsum from "lorem-ipsum";
import { SVG_IMAGES } from "./images.mock";
import { DbService } from "src/services/db.service";

const difficulties: ("easy" | "medium" | "hard")[] = ["easy", "medium", "hard"];
// mock problems
export const MOCK_PROBLEMS = (count: number = 8, db: DbService) => {
  const problems = [];
  for (let i = 0; i < count; i++) {
    problems.push(
      new Problem(
        `problem${i + 1}`,
        {
          title: `Problem ${i + 1}`,
          slug: `problem-${i + 1}`,
          // coverImg: `https://loremflickr.com/${300 + i}/300`,
          coverSVG: SVG_IMAGES[1],
          studentVersion: {
            content: loremIpsum(),
            images: []
          },
          facilitatorVersion: {
            extension: loremIpsum(),
            pedagogy: loremIpsum(),
            solution: loremIpsum(),
            downloadUrl: null
          },
          difficulty: difficulties[Math.floor(Math.random() * 3)]
        },
        db
      )
    );
  }
  return problems as IProblem[];
};

import { random } from "my-labs-library";


export function* idGenerator(min, max, name) {
    let randomId = random(min,max);

  while (true) {
    yield `/${name}/${randomId}`;
    randomId = random(min,max);
  }
}
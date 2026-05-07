import { generateKey } from "my-labs-library";


export function* idGenerator(num) {
    let randomId = generateKey(num);

  while (true) {
    yield `${randomId}`;
    randomId = generateKey(num);
  }
}
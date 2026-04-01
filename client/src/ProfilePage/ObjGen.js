import { generateKey } from "my-labs-library";


export function* idGenerator(min, max, name) {
    let randomId = generateKey(20);

  while (true) {
    yield `/${name}/${randomId}`;
    randomId = generateKey(20);
  }
}
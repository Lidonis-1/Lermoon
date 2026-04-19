import { generateKey } from "my-labs-library";


export function* idGenerator(min, max, name) {
    let randomId = crypto.randomUUID();

  while (true) {
    yield `/${name}/${randomId}`;
    randomId = generateKey(20);
  }
}
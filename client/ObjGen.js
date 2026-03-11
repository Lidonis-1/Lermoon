export function* idGenerator(min, max, name) {
    let randomId = Math.round((Math.random()*(max-min)) + min);

  while (true) {
    yield `/${name}/${randomId}`;
    randomId = Math.round(Math.random()*1000 + 1);
  }
}
import { fetch } from 'undici';

async function test() {
  try {
    const res = await fetch('http://localhost:4321/ar');
    console.log(res.status);
    console.log(await res.text());
  } catch(e) {
    console.error(e);
  }
}
test();

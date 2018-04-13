export default function throwError(err) {
  console.log(JSON.stringify(err));

  throw err;
}

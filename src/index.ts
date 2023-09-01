import "reflect-metadata";

import app from "./app";

async function main() {
  try {
    app.listen(3000);
    console.log("Server printer is listening on port", 3000);
  } catch (e) {
    console.log(e);
  }
}

main();

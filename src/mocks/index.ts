import { server } from "./server";

// Start the MSW worker in the browser environment
async function initMocks() {
  if (typeof window === "undefined") {
    const { server } = await import("./server");
    server.listen();
  } else {
    const { worker } = await import("./browser");
    return worker.start();
  }
}

(async () => {
  await initMocks();
})();

export default initMocks;

// Export type router type signature, this is used by the client.

import {
  createTRPCClient,
  splitLink,
  unstable_httpBatchStreamLink,
  unstable_httpSubscriptionLink,
} from "@trpc/client";
/**
 * We only import the `AppRouter` type from the server - this is not available at runtime
 */

import type { AppRouter } from "../server/index.ts";

const trpc = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => op.type === "subscription",
      true: unstable_httpSubscriptionLink({
        url: "http://localhost:3000",
      }),
      false: unstable_httpBatchStreamLink({
        url: "http://localhost:3000",
      }),
    }),
  ],
});

const dinos = await trpc.dino.list.query();
console.log("Dinos:", dinos);

const createdDino = await trpc.dino.create.mutate({
  name: "Denosaur",
  description:
    "A dinosaur that lives in the deno ecosystem. Eats Nodes for breakfast.",
});
console.log("Created dino:", createdDino);

const dino = await trpc.dino.byName.query("Denosaur");
console.log("Denosaur:", dino);

const iterable = await trpc.examples.iterable.query();

for await (const i of iterable) {
  console.log("Iterable:", i);
}

import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { z } from "zod";
import { db } from "./db.ts";
import { publicProcedure, router } from "./trpc.ts";

const appRouter = router({
  dino: {
    list: publicProcedure.query(async () => {
      const dino = await db.dino.findMany();
      return dino;
    }),
    byName: publicProcedure.input(z.string()).query(async (opts) => {
      const { input } = opts;
      const dino = await db.dino.findByName(input);
      return dino;
    }),
    create: publicProcedure
      .input(z.object({ name: z.string(), description: z.string() }))
      .mutation(async (opts) => {
        const { input } = opts;

        return db.dino.create(input);
      }),
  },
  examples: {
    iterable: publicProcedure.query(async function* () {
      for (let i = 0; i < 3; i++) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        yield i;
      }
    }),
  },
});

// Export type router type signature, this is used by the client.

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter,
});

server.listen(3000);

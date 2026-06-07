import z from "zod";

export const appConfigSchema = z.object({
	storagePath: z.string().nullable(),
});

export type AppConfig = z.infer<typeof appConfigSchema>;

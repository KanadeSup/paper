import z from "zod";

export const storageDefinition = {
	appConfigs: defineStorage({
		schema: z.object({ storagePath: z.string().nullable() }),
		defaultData: {
			storagePath: null,
		},
	}),
	appStatus: defineStorage({
		schema: z.object({
			isRunning: z.boolean(),
		}),
		defaultData: {
			isRunning: false,
		},
	}),
};

export type StorageDefinition = typeof storageDefinition;
export type StorageData<T extends keyof StorageDefinition> = z.infer<
	StorageDefinition[T]["schema"]
>;

function defineStorage<TSchema extends z.ZodTypeAny>(config: {
	schema: TSchema;
	defaultData: z.infer<TSchema>;
}) {
	return config;
}

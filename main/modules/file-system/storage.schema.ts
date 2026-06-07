import z from "zod";

export const storageDefinition = {
	appConfigs: defineStorage({
		schema: z.object({ storagePath: z.string().nullable() }),
		defaultData: {
			storagePath: null,
		},
	}),
	documents: defineStorage({
		schema: z.object({
			records: z
				.object({
					id: z.string(),
					title: z.string().nullable(),
					author: z.string().nullable(),
					totalPages: z.number().nullable(),
					fileName: z.string(),
				})
				.array(),
		}),
		defaultData: {
			records: [],
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

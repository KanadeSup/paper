import z from "zod";

export const storageDefinition = {
	appConfigs: defineStorage({
		schema: z.object({ storagePath: z.string().nullable() }),
		defaultData: {
			storagePath: null,
		},
	}),
	documents: defineCollectionStorage({
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
	chatSessions: defineCollectionStorage({
		schema: z.object({
			records: z
				.object({
					id: z.string(),
					modelConfiguration: z.object({
						temperature: z.number().nullable(),
						maxTokens: z.number().nullable(),
						topP: z.number().nullable(),
						systemPromptWithPlaceholders: z.string().nullable(),
					}),
					messages: z
						.object({
							id: z.string(),
							content: z.string(),
							role: z.enum(["user", "assistant"]),
							model: z.string().optional(),
							createdAt: z.date(),
						})
						.array(),
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

type CollectionSchema = z.ZodObject<{
	records: z.ZodArray<z.ZodTypeAny>;
}>;

function defineCollectionStorage<TSchema extends CollectionSchema>(config: {
	schema: TSchema;
	defaultData: z.infer<TSchema>;
}) {
	return config;
}

function defineStorage<TSchema extends z.ZodTypeAny>(config: {
	schema: TSchema;
	defaultData: z.infer<TSchema>;
}) {
	return config;
}

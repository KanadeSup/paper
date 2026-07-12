import z from "zod";

export const storageDefinition = {
	appConfigs: defineStorage({
		schema: z.object({ storagePath: z.string().nullable() }),
		defaultData: {
			storagePath: null,
		},
	}),
	apiKeys: defineStorage({
		schema: z.object({
			grok: z.string().nullable(),
			gemini: z.string().nullable(),
			openai: z.string().nullable(),
		}),
		defaultData: {
			grok: null,
			gemini: null,
			openai: null,
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
					documentId: z.string(),
					modelConfiguration: z.object({
						temperature: z.number().nullable(),
						maxTokens: z.number().nullable(),
						topP: z.number().nullable(),
						systemPromptWithPlaceholders: z.string(),
					}),
					messages: z
						.object({
							id: z.string(),
							content: z.string(),
							role: z.enum(["user", "assistant"]),
							model: z.string().optional(),
							createdAt: z.coerce.date(),
						})
						.array(),
				})
				.array(),
		}),
		defaultData: {
			records: [],
		},
	}),
	selectionMenuActions: defineCollectionStorage({
		schema: z.object({
			records: z
				.object({
					id: z.string(),
					name: z.string(),
					description: z.string(),
					promptWithPlaceholder: z.string(),
					model: z.string(),
					order: z.number().int(),
					disabled: z.boolean().default(false),
				})
				.array(),
		}),
		defaultData: {
			records: [],
		},
	}),
	documentVectorStore: defineCollectionStorage({
		schema: z.object({
			records: z
				.object({
					id: z.string(),
					vectorStoreId: z.string(),
					lastUsedAt: z.coerce.date().optional(),
				})
				.array(),
		}),
		defaultData: {
			records: [],
		},
	}),
	documentStates: defineCollectionStorage({
		schema: z.object({
			records: z
				.object({
					id: z.string(),
					currentPage: z.number().int().min(1).default(1),
					zoomLevel: z
						.enum(["automatic", "fit-page", "fit-width"])
						.or(z.number())
						.default("automatic"),
					isPdfChatOpen: z.boolean().default(false),
					isSidebarOpen: z.boolean().default(false),
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

import { Button, ScrollArea } from "@renderer/modules/design-system";
import { Loader2, MousePointerClick, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
	SettingLayout,
	SettingTitle,
} from "../setting/components/setting-layout";
import { ActionForm } from "./components/action-form";
import { ActionItem } from "./components/action-item";
import { useMenuActions } from "./hooks/useMenuActions";
import type { MenuActionFormValues } from "./types/menu-action.type";

type View =
	| { type: "list" }
	| { type: "create" }
	| { type: "edit"; actionId: string };

export function SelectionSettingPage() {
	const {
		actions,
		isLoading,
		error,
		toggleAction,
		saveActionForm,
		createActionForm,
		removeAction,
	} = useMenuActions();
	const [view, setView] = useState<View>({ type: "list" });

	const handleToggle = async (id: string) => {
		await toggleAction(id);
	};

	const handleDelete = async (id: string) => {
		const isDeleted = await removeAction(id);
		if (isDeleted && view.type === "edit" && view.actionId === id) {
			setView({ type: "list" });
		}
	};

	const handleCreateSubmit = async (data: MenuActionFormValues) => {
		const isCreated = await createActionForm(data);
		if (isCreated) {
			setView({ type: "list" });
		}
	};

	const handleEditSubmit = async (data: MenuActionFormValues) => {
		if (view.type !== "edit") return;

		const isSaved = await saveActionForm(view.actionId, data);
		if (isSaved) {
			setView({ type: "list" });
		}
	};

	useEffect(() => {
		if (view.type !== "edit" || isLoading) return;

		const actionExists = actions.some((item) => item.id === view.actionId);
		if (!actionExists) {
			setView({ type: "list" });
		}
	}, [actions, isLoading, view]);

	if (view.type === "create") {
		return (
			<ActionForm
				mode="create"
				title="New Action"
				onSubmit={handleCreateSubmit}
				onCancel={() => setView({ type: "list" })}
			/>
		);
	}

	if (view.type === "edit") {
		const action = actions.find((item) => item.id === view.actionId);
		if (!action) return null;

		return (
			<ActionForm
				mode="edit"
				title={action.name}
				defaultValues={{
					name: action.name,
					description: action.description,
					prompt: action.prompt,
				}}
				onSubmit={handleEditSubmit}
				onCancel={() => setView({ type: "list" })}
			/>
		);
	}

	return (
		<SettingLayout>
			<div className="flex items-center justify-between">
				<div className="flex flex-col gap-1">
					<SettingTitle title="Menu Selection" />
					<p className="text-sm text-muted-foreground">
						Manage actions that appear when text is selected in a PDF. Disable
						or remove them as needed.
					</p>
				</div>
				<Button onClick={() => setView({ type: "create" })}>
					<PlusIcon className="size-4" />
					Add Action
				</Button>
			</div>

			{error && (
				<div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-destructive text-sm">
					{error}
				</div>
			)}

			<ScrollArea className="h-full">
				{isLoading ? (
					<div className="flex h-40 items-center justify-center text-muted-foreground">
						<Loader2 className="size-6 animate-spin" />
					</div>
				) : actions.length === 0 ? (
					<EmptyState />
				) : (
					<div className="flex flex-col gap-2 pr-1">
						{actions.map((action) => (
							<ActionItem
								key={action.id}
								action={action}
								onEdit={() => setView({ type: "edit", actionId: action.id })}
								onToggle={() => handleToggle(action.id)}
								onDelete={() => handleDelete(action.id)}
							/>
						))}
					</div>
				)}
			</ScrollArea>
		</SettingLayout>
	);
}

function EmptyState() {
	return (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<div className="size-12 rounded-full bg-muted flex items-center justify-center mb-3">
				<MousePointerClick className="size-5 text-muted-foreground" />
			</div>
			<h3 className="font-medium text-sm">No actions yet</h3>
			<p className="text-xs text-muted-foreground mt-1 max-w-48">
				Selection menu actions will appear here once configured.
			</p>
		</div>
	);
}

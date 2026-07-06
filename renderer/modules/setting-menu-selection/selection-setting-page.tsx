import { Button, ScrollArea } from "@renderer/modules/design-system";
import { MousePointerClick, PlusIcon, SparklesIcon } from "lucide-react";
import { useState } from "react";
import {
	SettingLayout,
	SettingTitle,
} from "../setting/components/setting-layout";
import { ActionForm } from "./components/action-form";
import { ActionItem } from "./components/action-item";
import {
	INITIAL_ACTIONS,
	type MenuAction,
	type MenuActionFormValues,
} from "./types/menu-action.type";

type View =
	| { type: "list" }
	| { type: "edit"; actionId: string }
	| { type: "create" };

export function SelectionSettingPage() {
	const [actions, setActions] = useState<MenuAction[]>(INITIAL_ACTIONS);
	const [view, setView] = useState<View>({ type: "list" });

	const handleToggle = (id: string) => {
		setActions((prev) =>
			prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)),
		);
	};

	const handleDelete = (id: string) => {
		setActions((prev) => prev.filter((a) => a.id !== id));
	};

	const handleEditSubmit = (data: MenuActionFormValues) => {
		if (view.type !== "edit") return;
		setActions((prev) =>
			prev.map((a) => (a.id === view.actionId ? { ...a, ...data } : a)),
		);
		setView({ type: "list" });
	};

	const handleCreateSubmit = (data: MenuActionFormValues) => {
		const newAction: MenuAction = {
			id: crypto.randomUUID(),
			icon: SparklesIcon,
			createdAt: new Date(),
			enabled: true,
			...data,
		};
		setActions((prev) => [...prev, newAction]);
		setView({ type: "list" });
	};

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
		const action = actions.find((a) => a.id === view.actionId);
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
			<div className="flex items-start justify-between gap-4">
				<div className="flex flex-col gap-1">
					<SettingTitle title="Menu Selection" />
					<p className="text-sm text-muted-foreground">
						Manage actions that appear when text is selected in a PDF. Disable
						or remove them as needed.
					</p>
				</div>
				<Button
					size="sm"
					className="shrink-0 gap-1.5"
					onClick={() => setView({ type: "create" })}
				>
					<PlusIcon className="size-3.5" />
					Add Action
				</Button>
			</div>

			<ScrollArea className="h-full">
				<div className="flex flex-col gap-2 pr-1">
					{actions.length === 0 ? (
						<EmptyState onAdd={() => setView({ type: "create" })} />
					) : (
						actions.map((action) => (
							<ActionItem
								key={action.id}
								action={action}
								onEdit={() => setView({ type: "edit", actionId: action.id })}
								onToggle={() => handleToggle(action.id)}
								onDelete={() => handleDelete(action.id)}
							/>
						))
					)}
				</div>
			</ScrollArea>
		</SettingLayout>
	);
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
	return (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<div className="size-12 rounded-full bg-muted flex items-center justify-center mb-3">
				<MousePointerClick className="size-5 text-muted-foreground" />
			</div>
			<h3 className="font-medium text-sm">No actions yet</h3>
			<p className="text-xs text-muted-foreground mt-1 max-w-48">
				Add actions to show in the selection menu when text is highlighted.
			</p>
			<Button size="sm" className="mt-4 gap-1.5" onClick={onAdd}>
				<PlusIcon className="size-3.5" />
				Add Action
			</Button>
		</div>
	);
}

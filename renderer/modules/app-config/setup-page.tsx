import { Button, Input } from "@renderer/modules/design-system";
import { useNavigate } from "@tanstack/react-router";
import { FolderOpen } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { selectStorageDirectory } from "./ipc/app-config.ipc";
import { useConfigStore } from "./stores/config-store";

export function SetupPage() {
	const updateConfig = useConfigStore((state) => state.actions.update);
	const [storagePath, setStoragePath] = useState("");

	const navigate = useNavigate();

	const handleBrowse = async () => {
		const response = await selectStorageDirectory();

		if (response.success && response.data?.path) {
			setStoragePath(response.data.path);
		}
	};

	const handleSubmit = async (event: React.SubmitEvent) => {
		event.preventDefault();

		if (!storagePath) {
			return;
		}

		const success = await updateConfig({ storagePath });
		if (!success) {
			toast.error("Failed to update configuration", {
				description: "Please try again.",
			});
			return;
		}

		navigate({ to: "/" });
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-6">
			<div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
				<div className="space-y-1">
					<h1 className="font-semibold text-card-foreground text-lg">
						Welcome to Fly Paper
					</h1>
					<p className="text-muted-foreground text-sm">
						Choose a directory to store your documents.
					</p>
				</div>

				<form className="mt-6 space-y-4" onSubmit={handleSubmit}>
					<div className="space-y-2">
						<label
							htmlFor="storage-path"
							className="font-medium text-foreground text-sm"
						>
							Storage directory
						</label>
						<div className="flex gap-2">
							<Input
								id="storage-path"
								readOnly
								value={storagePath}
								placeholder="Select a directory..."
								className="flex-1"
							/>
							<Button
								type="button"
								variant="outline"
								onClick={handleBrowse}
								aria-label="Browse for storage directory"
							>
								<FolderOpen />
							</Button>
						</div>
					</div>

					<Button type="submit" className="w-full" disabled={!storagePath}>
						Continue
					</Button>
				</form>
			</div>
		</div>
	);
}

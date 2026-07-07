import { cn } from "@renderer/modules/design-system";
import Logger from "electron-log/renderer.js";
import { Trash2Icon } from "lucide-react";
import {
	type MouseEvent,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { deleteChatSession, getChatSessions } from "../../ipc/chat.ipc";
import type { ChatSessionData } from "../../types/chat.type";

type ChatHistoryPanelProps = {
	documentId: string;
	currentSessionId: string | null;
	onSelectSession: (sessionId: string) => void;
	onDeleteSession: (sessionId: string) => void;
};

export function ChatHistoryPanel(props: ChatHistoryPanelProps) {
	const { documentId, currentSessionId, onSelectSession, onDeleteSession } =
		props;
	const [historySessions, setHistorySessions] = useState<ChatSessionData[]>([]);

	/* Sort history sessions by lastest message createdAt in descending order */
	const sortedHistorySessions = useMemo(() => {
		return [...historySessions].sort((leftSession, rightSession) => {
			const leftDate =
				leftSession.messages[leftSession.messages.length - 1]?.createdAt ?? 0;
			const rightDate =
				rightSession.messages[rightSession.messages.length - 1]?.createdAt ?? 0;
			return new Date(rightDate).getTime() - new Date(leftDate).getTime();
		});
	}, [historySessions]);

	/* Handle delete session */
	const handleDeleteSession = async (
		event: MouseEvent<HTMLButtonElement>,
		sessionId: string,
	) => {
		event.stopPropagation();
		const response = await deleteChatSession(sessionId);
		if (!response.success) {
			Logger.error(response.errorMessage || "Failed to delete chat session");
			return;
		}

		onDeleteSession(sessionId);

		setHistorySessions((previousSessions) =>
			previousSessions.filter((session) => session.id !== sessionId),
		);
	};

	/* Load history sessions */
	const loadHistorySessions = useCallback(async () => {
		const response = await getChatSessions(documentId);
		if (!response.success) {
			Logger.error(response.errorMessage || "Failed to load chat history");
			return [];
		}

		const sessions = response.data.sessions;
		setHistorySessions(sessions);
		return sessions;
	}, [documentId]);

	/* Load history sessions when documentId changes */
	useEffect(() => {
		loadHistorySessions();
	}, [loadHistorySessions]);

	return (
		<div className="p-2">
			<p className="text-xs font-semibold mb-2 text-muted-foreground">
				Chat history
			</p>
			<div className="flex flex-col gap-1">
				{sortedHistorySessions.length === 0 && (
					<p className="text-xs text-muted-foreground px-2 py-1">
						No history yet
					</p>
				)}
				{sortedHistorySessions.map((historySession) => (
					<div
						key={historySession.id}
						className={cn(
							"group/history-item relative w-full rounded-md transition-colors",
							currentSessionId === historySession.id && "bg-accent/60",
						)}
					>
						<button
							type="button"
							onClick={() => onSelectSession(historySession.id)}
							className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent/40 rounded-md cursor-pointer"
						>
							<span className="block truncate pr-7">
								{getSessionTitle(historySession)}
							</span>
						</button>
						<button
							type="button"
							className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/history-item:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
							onClick={(event) =>
								void handleDeleteSession(event, historySession.id)
							}
						>
							<Trash2Icon className="size-4" />
						</button>
					</div>
				))}
			</div>
		</div>
	);
}

function getSessionTitle(historySession: ChatSessionData) {
	const firstUserMessage = historySession.messages.find(
		(message) => message.role === "user",
	);
	if (!firstUserMessage) return "New chat";
	const normalizedContent = firstUserMessage.content
		.trim()
		.replace(/\s+/g, " ");
	return normalizedContent.length > 42
		? `${normalizedContent.slice(0, 42)}...`
		: normalizedContent;
}

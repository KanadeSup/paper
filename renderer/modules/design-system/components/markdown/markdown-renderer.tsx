import { marked } from "marked";

type MarkdownRendererProps = {
	content: string;
};

export function MarkdownRenderer(props: MarkdownRendererProps) {
	const { content } = props;
	marked.setOptions({
		breaks: true,
		gfm: true,
	});

	const html = marked.parse(content);

	// biome-ignore lint/security/noDangerouslySetInnerHtml: This is safe because the content is trusted
	return <div dangerouslySetInnerHTML={{ __html: html as string }} />;
}

import { Fragment, type ReactNode } from 'react';
import * as Icons from 'lucide-react';
import type { Lang } from '../i18n';
import { COPY } from '../i18n';
import ActionConfirmCard, { type PendingAction } from './ActionConfirmCard';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  pending_actions?: PendingAction[];
}

/** Lightweight Markdown subset — no npm deps (safe for AppStore rebuilds). */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      nodes.push(text.slice(last, m.index));
    }
    const token = m[0];
    const k = `${keyPrefix}-${i++}`;
    if (token.startsWith('**') && token.endsWith('**')) {
      nodes.push(<strong key={k}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('`') && token.endsWith('`')) {
      nodes.push(
        <code key={k} className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[12px] dark:bg-slate-900">
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      nodes.push(<em key={k}>{token.slice(1, -1)}</em>);
    } else if (token.startsWith('[')) {
      const lm = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (lm) {
        nodes.push(
          <a key={k} href={lm[2]} target="_blank" rel="noreferrer" className="text-violet-600 underline dark:text-violet-300">
            {lm[1]}
          </a>,
        );
      } else {
        nodes.push(token);
      }
    } else {
      nodes.push(token);
    }
    last = m.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function SimpleMarkdown({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let i = 0;
  let bi = 0;

  while (i < lines.length) {
    const line = lines[i];

    // fenced code block
    if (line.trimStart().startsWith('```')) {
      const fence = line.trimStart();
      const lang = fence.slice(3).trim();
      i += 1;
      const codeLines: string[] = [];
      while (i < lines.length && !lines[i].trimStart().startsWith('```')) {
        codeLines.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) i += 1; // closing ```
      blocks.push(
        <pre
          key={`b${bi++}`}
          className="my-2 overflow-x-auto rounded-lg bg-slate-900 p-3 text-[12px] text-slate-100"
          data-lang={lang || undefined}
        >
          <code>{codeLines.join('\n')}</code>
        </pre>,
      );
      continue;
    }

    // blank line
    if (!line.trim()) {
      i += 1;
      continue;
    }

    // headings
    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      const body = renderInline(heading[2], `h${bi}`);
      if (level === 1) {
        blocks.push(
          <h1 key={`b${bi++}`} className="mb-2 mt-3 text-base font-bold">
            {body}
          </h1>,
        );
      } else if (level === 2) {
        blocks.push(
          <h2 key={`b${bi++}`} className="mb-2 mt-3 text-sm font-bold">
            {body}
          </h2>,
        );
      } else {
        blocks.push(
          <h3 key={`b${bi++}`} className="mb-1 mt-2 text-sm font-semibold">
            {body}
          </h3>,
        );
      }
      i += 1;
      continue;
    }

    // unordered list
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ''));
        i += 1;
      }
      blocks.push(
        <ul key={`b${bi++}`} className="my-2 list-disc space-y-0.5 pl-5">
          {items.map((it, idx) => (
            <li key={idx}>{renderInline(it, `ul${bi}-${idx}`)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    // ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ''));
        i += 1;
      }
      blocks.push(
        <ol key={`b${bi++}`} className="my-2 list-decimal space-y-0.5 pl-5">
          {items.map((it, idx) => (
            <li key={idx}>{renderInline(it, `ol${bi}-${idx}`)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    // paragraph (consume consecutive non-blank non-special lines)
    const para: string[] = [line];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trimStart().startsWith('```') &&
      !/^(#{1,3})\s+/.test(lines[i]) &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i])
    ) {
      para.push(lines[i]);
      i += 1;
    }
    blocks.push(
      <p key={`b${bi++}`} className="my-2 whitespace-pre-wrap">
        {para.map((pl, idx) => (
          <Fragment key={idx}>
            {idx > 0 ? '\n' : null}
            {renderInline(pl, `p${bi}-${idx}`)}
          </Fragment>
        ))}
      </p>,
    );
  }

  return <div className="coagent-md text-[13px] leading-relaxed">{blocks}</div>;
}

export default function MessageBubble({
  message,
  language,
  onApprove,
  onCancel,
}: {
  message: ChatMessage;
  language: Lang;
  onApprove: (id: string) => void;
  onCancel: (id: string) => void;
}) {
  const t = COPY[language];
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600/15 text-violet-600 dark:text-violet-300">
          <Icons.Bot className="h-4 w-4" />
        </div>
      )}
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
          isUser
            ? 'bg-violet-600 text-white'
            : 'border border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100'
        }`}
      >
        <div className={`mb-1 text-[10px] font-semibold uppercase tracking-wide ${isUser ? 'text-violet-100' : 'text-slate-400'}`}>
          {isUser ? t.you : t.agent}
        </div>
        {isUser ? (
          <div className="whitespace-pre-wrap">{message.content}</div>
        ) : (
          <SimpleMarkdown content={message.content} />
        )}
        {!isUser &&
          (message.pending_actions || []).map((a) => (
            <ActionConfirmCard
              key={a.action_id}
              action={a}
              language={language}
              onApprove={onApprove}
              onCancel={onCancel}
            />
          ))}
      </div>
    </div>
  );
}

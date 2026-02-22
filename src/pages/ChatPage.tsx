import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { groupsApi } from '@/api/groups';
import { messagesApi } from '@/api/messages';
import { useGroupSocket } from '@/hooks/useSocket';
import type { Group, Message } from '@/types';
import Button from '@/components/Button';

// ─── Sidebar ────────────────────────────────────────────────────────────────

function Sidebar({
  groups,
  activeGroupId,
  onSelect,
  onJoin,
  onLeave,
  onLogout,
  username,
}: {
  groups: Group[];
  activeGroupId: string | null;
  onSelect: (id: string) => void;
  onJoin: (id: string) => void;
  onLeave: (id: string) => void;
  onLogout: () => void;
  username: string;
}) {
  const [joinInput, setJoinInput] = useState('');
  const [joining, setJoining] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = joinInput.trim();
    if (!id) return;
    setJoining(true);
    try {
      await onJoin(id);
      setJoinInput('');
    } finally {
      setJoining(false);
    }
  };

  return (
    <aside style={{
      width: sidebarOpen ? 260 : 64,
      minWidth: sidebarOpen ? 260 : 64,
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 250ms ease, min-width 250ms ease',
      overflow: 'hidden',
      height: '100%',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 14px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexShrink: 0,
      }}>
        <div style={{
          width: 32,
          height: 32,
          flexShrink: 0,
          background: 'linear-gradient(135deg, var(--accent), var(--accent-pink))',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          cursor: 'pointer',
        }}
          onClick={() => setSidebarOpen(v => !v)}
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          ◈
        </div>
        {sidebarOpen && (
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 16,
            letterSpacing: '-0.3px',
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
          }}>
            GroupChat
          </span>
        )}
      </div>

      {sidebarOpen && (
        <>
          {/* Join group form */}
          <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
            <p style={{
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}>
              Join a Group
            </p>
            <form onSubmit={handleJoin} style={{ display: 'flex', gap: 6 }}>
              <input
                value={joinInput}
                onChange={e => setJoinInput(e.target.value)}
                placeholder="group-id"
                style={{
                  flex: 1,
                  padding: '7px 10px',
                  background: 'var(--bg-base)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  outline: 'none',
                  minWidth: 0,
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
              />
              <button
                type="submit"
                disabled={joining || !joinInput.trim()}
                style={{
                  padding: '7px 10px',
                  background: 'var(--accent)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: joining ? 'not-allowed' : 'pointer',
                  fontSize: 13,
                  opacity: joining ? 0.7 : 1,
                  flexShrink: 0,
                }}
              >
                {joining ? '…' : '+'}
              </button>
            </form>
          </div>

          {/* Group list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }}>
            <p style={{
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '4px 6px 8px',
            }}>
              My Groups ({groups.length})
            </p>

            {groups.length === 0 ? (
              <div style={{
                padding: '20px 8px',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: 12,
                fontFamily: 'var(--font-mono)',
              }}>
                No groups yet.<br />Join one above ↑
              </div>
            ) : (
              groups.map(g => (
                <GroupItem
                  key={g.id}
                  group={g}
                  active={g.id === activeGroupId}
                  onSelect={() => onSelect(g.id)}
                  onLeave={() => onLeave(g.id)}
                />
              ))
            )}
          </div>
        </>
      )}

      {/* User info at bottom */}
      <div style={{
        padding: sidebarOpen ? '12px 14px' : '12px 14px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0,
      }}>
        <div style={{
          width: 30,
          height: 30,
          flexShrink: 0,
          borderRadius: 8,
          background: 'var(--accent-dim)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--text-accent)',
          fontWeight: 600,
        }}>
          {username.charAt(0).toUpperCase()}
        </div>
        {sidebarOpen && (
          <>
            <span style={{
              flex: 1,
              fontSize: 13,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {username}
            </span>
            <button
              onClick={onLogout}
              title="Logout"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                fontSize: 15,
                padding: 4,
                lineHeight: 1,
                flexShrink: 0,
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-pink)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              ⏻
            </button>
          </>
        )}
      </div>
    </aside>
  );
}

function GroupItem({
  group,
  active,
  onSelect,
  onLeave,
}: {
  group: Group;
  active: boolean;
  onSelect: () => void;
  onLeave: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 8px',
        borderRadius: 8,
        cursor: 'pointer',
        background: active
          ? 'var(--accent-glow)'
          : hovered
          ? 'var(--bg-hover)'
          : 'transparent',
        border: active ? '1px solid rgba(124,106,247,0.2)' : '1px solid transparent',
        transition: 'all var(--transition)',
        marginBottom: 2,
      }}
    >
      <div style={{
        width: 30,
        height: 30,
        flexShrink: 0,
        borderRadius: 8,
        background: active ? 'var(--accent)' : 'var(--bg-elevated)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 13,
        transition: 'background var(--transition)',
      }}>
        #
      </div>
      <span style={{
        flex: 1,
        fontSize: 13,
        fontFamily: 'var(--font-mono)',
        color: active ? 'var(--text-accent)' : 'var(--text-secondary)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {group.id}
      </span>
      {hovered && !active && (
        <button
          onClick={e => { e.stopPropagation(); onLeave(); }}
          title="Leave group"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            fontSize: 14,
            padding: '2px 4px',
            lineHeight: 1,
            flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-pink)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          ×
        </button>
      )}
    </div>
  );
}

// ─── Chat area ───────────────────────────────────────────────────────────────

function ChatArea({
  groupId,
  username,
}: {
  groupId: string;
  username: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [loadingMore, setLoadingMore] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const loadMessages = useCallback(async (cursor?: string) => {
    try {
      const data = await messagesApi.getMessages(groupId, cursor, 30);
      if (cursor) {
        setMessages(prev => [...data.messages.reverse(), ...prev]);
      } else {
        setMessages(data.messages.slice().reverse());
        setNextCursor(data.nextCursor);
        setTimeout(() => bottomRef.current?.scrollIntoView(), 50);
      }
      setNextCursor(data.nextCursor);
    } catch {
      // silently fail
    }
  }, [groupId]);

  useEffect(() => {
    setMessages([]);
    setNextCursor(undefined);
    loadMessages();
  }, [loadMessages]);

  // Real-time via socket
  useGroupSocket(groupId, (msg) => {
    const newMsg = msg as Message;
    setMessages(prev => {
      // avoid duplicates (if sender already got it via REST)
      if (prev.find(m => m.id === newMsg.id)) return prev;
      return [...prev, newMsg];
    });
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  });

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = input.trim();
    if (!content || sending) return;
    if (content.length > 255) { setError('Message too long (max 255 chars)'); return; }
    setError('');
    setSending(true);
    try {
      await messagesApi.send(groupId, content);
      setInput('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  const handleLoadMore = async () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const data = await messagesApi.getMessages(groupId, nextCursor, 30);
      setMessages(prev => [...data.messages.slice().reverse(), ...prev]);
      setNextCursor(data.nextCursor);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    }}>
      {/* Channel header */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexShrink: 0,
        background: 'var(--bg-surface)',
      }}>
        <span style={{ color: 'var(--text-accent)', fontSize: 18 }}>#</span>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 16,
          color: 'var(--text-primary)',
        }}>
          {groupId}
        </span>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}>
        {nextCursor && (
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              style={{
                background: 'none',
                border: '1px solid var(--border)',
                borderRadius: 6,
                padding: '6px 16px',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                cursor: loadingMore ? 'not-allowed' : 'pointer',
              }}
            >
              {loadingMore ? 'Loading…' : '↑ Load older messages'}
            </button>
          </div>
        )}

        {messages.length === 0 && (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            gap: 8,
          }}>
            <span style={{ fontSize: 32 }}>◈</span>
            <span>No messages yet. Say hello!</span>
          </div>
        )}

        {messages.map((msg, i) => {
          const isSelf = msg.sender.username === username;
          const prevMsg = messages[i - 1];
          const isSameSender = prevMsg && prevMsg.sender.id === msg.sender.id &&
            (new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime()) < 60000;

          return (
            <MessageBubble
              key={msg.id}
              message={msg}
              isSelf={isSelf}
              isSameSender={!!isSameSender}
            />
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '12px 20px 16px',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-surface)',
        flexShrink: 0,
      }}>
        {error && (
          <div style={{
            marginBottom: 8,
            padding: '6px 12px',
            background: 'rgba(255,110,180,0.08)',
            border: '1px solid rgba(255,110,180,0.2)',
            borderRadius: 6,
            fontSize: 12,
            color: 'var(--accent-pink)',
            fontFamily: 'var(--font-mono)',
          }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSend} style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message #${groupId}… (Enter to send, Shift+Enter for newline)`}
              rows={1}
              disabled={sending}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'var(--bg-base)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                resize: 'none',
                outline: 'none',
                transition: 'border-color var(--transition)',
                lineHeight: 1.5,
                maxHeight: 120,
                overflowY: 'auto',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
              onInput={e => {
                const el = e.currentTarget;
                el.style.height = 'auto';
                el.style.height = Math.min(el.scrollHeight, 120) + 'px';
              }}
            />
            <span style={{
              position: 'absolute',
              right: 10,
              bottom: 8,
              fontSize: 11,
              color: input.length > 220 ? 'var(--accent-pink)' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              pointerEvents: 'none',
            }}>
              {input.length}/255
            </span>
          </div>
          <button
            type="submit"
            disabled={sending || !input.trim()}
            style={{
              width: 40,
              height: 40,
              flexShrink: 0,
              background: input.trim() ? 'var(--accent)' : 'var(--bg-elevated)',
              color: input.trim() ? '#fff' : 'var(--text-muted)',
              border: 'none',
              borderRadius: 10,
              cursor: sending || !input.trim() ? 'not-allowed' : 'pointer',
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all var(--transition)',
            }}
          >
            {sending ? '…' : '↑'}
          </button>
        </form>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  isSelf,
  isSameSender,
}: {
  message: Message;
  isSelf: boolean;
  isSameSender: boolean;
}) {
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className="animate-fadeUp"
      style={{
        display: 'flex',
        flexDirection: isSelf ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: 8,
        marginTop: isSameSender ? 2 : 12,
      }}
    >
      {/* Avatar */}
      {!isSameSender ? (
        <div style={{
          width: 28,
          height: 28,
          flexShrink: 0,
          borderRadius: 8,
          background: isSelf ? 'var(--accent-dim)' : 'var(--bg-elevated)',
          border: isSelf ? '1px solid var(--accent)' : '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: isSelf ? 'var(--text-accent)' : 'var(--text-secondary)',
          fontWeight: 600,
          alignSelf: 'flex-start',
        }}>
          {message.sender.username.charAt(0).toUpperCase()}
        </div>
      ) : (
        <div style={{ width: 28, flexShrink: 0 }} />
      )}

      <div style={{ maxWidth: '70%' }}>
        {/* Sender name + time */}
        {!isSameSender && (
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 8,
            marginBottom: 4,
            flexDirection: isSelf ? 'row-reverse' : 'row',
          }}>
            <span style={{
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
              fontWeight: 500,
              color: isSelf ? 'var(--text-accent)' : 'var(--text-secondary)',
            }}>
              {isSelf ? 'you' : message.sender.username}
            </span>
            <span style={{
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
            }}>
              {time}
            </span>
          </div>
        )}

        {/* Bubble */}
        <div style={{
          padding: '8px 12px',
          borderRadius: isSelf ? '12px 4px 12px 12px' : '4px 12px 12px 12px',
          background: isSelf
            ? 'linear-gradient(135deg, var(--accent), #9b8cf7)'
            : 'var(--bg-elevated)',
          border: isSelf ? 'none' : '1px solid var(--border)',
          color: isSelf ? '#fff' : 'var(--text-primary)',
          fontSize: 14,
          fontFamily: 'var(--font-mono)',
          lineHeight: 1.5,
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
        }}>
          {message.content}
        </div>
      </div>
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-mono)',
    }}>
      <div style={{
        width: 72,
        height: 72,
        borderRadius: 20,
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 32,
        color: 'var(--accent)',
      }}>
        ◈
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 16, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
          Select a group to start chatting
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Or join a group using the sidebar
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const { username, logout } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);

  useEffect(() => {
    groupsApi.getMyGroups().then(setGroups).catch(() => {});
  }, []);

  const handleJoin = async (id: string) => {
    try {
      await groupsApi.join(id);
      const updated = await groupsApi.getMyGroups();
      setGroups(updated);
      setActiveGroupId(id);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to join group');
    }
  };

  const handleLeave = async (id: string) => {
    try {
      await groupsApi.leave(id);
      setGroups(prev => prev.filter(g => g.id !== id));
      if (activeGroupId === id) setActiveGroupId(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to leave group');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore
    }
  };

  return (
    <div style={{
      display: 'flex',
      height: '100dvh',
      background: 'var(--bg-base)',
      overflow: 'hidden',
    }}>
      <Sidebar
        groups={groups}
        activeGroupId={activeGroupId}
        onSelect={setActiveGroupId}
        onJoin={handleJoin}
        onLeave={handleLeave}
        onLogout={handleLogout}
        username={username ?? '?'}
      />

      {/* Main area */}
      <main style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        minWidth: 0,
      }}>
        {activeGroupId ? (
          <ChatArea key={activeGroupId} groupId={activeGroupId} username={username ?? ''} />
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
}

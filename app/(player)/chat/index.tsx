import { useEffect, useState, useMemo, useRef } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { ArrowLeft, Send, MessageCircle } from 'lucide-react-native';
import { usePlayerChat, useChatMessages } from '@/hooks/useDatabase';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { playersDB } from '@/database/database.supabase';
import { supabase } from '@/lib/supabase';

export default function PlayerChatScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { playerIdentity } = useRole();
  const flatListRef = useRef<FlatList>(null);

  const [messageInput, setMessageInput] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [playerLoading, setPlayerLoading] = useState(true);
  const [senderLabels, setSenderLabels] = useState<Record<string, string>>({});

  // State for loaded player data
  const [teamId, setTeamId] = useState<number>(-1);
  const playerId = useMemo(() => playerIdentity?.playerId || -1, [playerIdentity]);

  // Load team_id from player record
  useEffect(() => {
    if (!(playerId > 0)) {
      setPlayerLoading(false);
      return;
    }

    (async () => {
      try {
        const player = await playersDB.getById(playerId);
        if (player?.team_id) {
          setTeamId(player.team_id);
        }
      } catch (error) {
        console.error('Error loading player:', error);
      } finally {
        setPlayerLoading(false);
      }
    })();
  }, [playerId]);

  const { chat, loading: chatLoading, getOrCreateChat } = usePlayerChat(playerId, teamId);

  const { messages, loading: messagesLoading, sendMessage, deleteMessage } = useChatMessages(
    chat?.id || 0,
    2000
  );

  // Initialize chat on mount
  useEffect(() => {
    (async () => {
      if (!(playerId > 0) || !(teamId > 0)) return;
      await getOrCreateChat();
    })();
  }, [playerId, teamId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Load sender labels for this chat: 1° Mister, 2° Mister, ... , Giocatore
  useEffect(() => {
    (async () => {
      if (!(chat?.id && chat.id > 0)) {
        setSenderLabels({});
        return;
      }

      try {
        const labels: Record<string, string> = {};

        const { data: chatRow } = await supabase
          .from('chats')
          .select('team_id, teams(owner_user_id)')
          .eq('id', chat.id)
          .single();

        const teamIdForChat = Number((chatRow as any)?.team_id || 0);
        const ownerUserId = (chatRow as any)?.teams?.owner_user_id as string | undefined;

        const orderedMisterIds: string[] = [];
        if (ownerUserId) orderedMisterIds.push(ownerUserId);

        if (teamIdForChat > 0) {
          const { data: delegatedRows } = await supabase
            .from('team_misters')
            .select('user_id, created_at')
            .eq('team_id', teamIdForChat)
            .order('created_at', { ascending: true });

          (delegatedRows || []).forEach((r: any) => {
            const uid = String(r.user_id || '');
            if (uid && !orderedMisterIds.includes(uid)) {
              orderedMisterIds.push(uid);
            }
          });
        }

        // Fallback robusto: se i delegati non arrivano, li inferiamo dai messaggi
        // (tutti i sender diversi dal player corrente e non già presenti)
        const inferredMisters = messages
          .filter((m) => m.sender_id && m.sender_id !== user?.id)
          .map((m) => String(m.sender_id));

        inferredMisters.forEach((uid) => {
          if (!orderedMisterIds.includes(uid)) {
            orderedMisterIds.push(uid);
          }
        });

        orderedMisterIds.forEach((uid, idx) => {
          labels[uid] = `${idx + 1}° Mister`;
        });

        setSenderLabels(labels);
      } catch (e) {
        console.error('[PlayerChatScreen] load sender labels error:', e);
        setSenderLabels({});
      }
    })();
  }, [chat?.id, messages, user?.id]);

  const chatItems = useMemo(() => {
    const items: Array<
      | { type: 'date'; key: string; label: string }
      | { type: 'message'; key: string; message: (typeof messages)[number] }
    > = [];

    let lastDayKey = '';
    messages.forEach((m) => {
      const d = new Date(m.created_at);
      const dayKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

      if (dayKey !== lastDayKey) {
        lastDayKey = dayKey;
        items.push({
          type: 'date',
          key: `date-${dayKey}`,
          label: d.toLocaleDateString('it-IT', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }),
        });
      }

      items.push({
        type: 'message',
        key: `msg-${m.id}`,
        message: m,
      });
    });

    return items;
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !user) return;
    if (!(chat?.id && chat.id > 0)) return;

    const text = messageInput;
    setMessageInput('');

    setSendingMessage(true);
    const success = await sendMessage(user.id, text);
    setSendingMessage(false);

    if (success) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  };

  const handleDeleteMessage = (messageId: number) => {
    if (!user?.id) return;

    Alert.alert('Elimina messaggio', 'Vuoi eliminare questo messaggio?', [
      { text: 'Annulla', style: 'cancel' },
      {
        text: 'Elimina',
        style: 'destructive',
        onPress: async () => {
          await deleteMessage(user.id, messageId);
        },
      },
    ]);
  };

  if (playerLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#2e70b7ff" />
      </SafeAreaView>
    );
  }

  if (!(teamId > 0) || !(playerId > 0)) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <View style={styles.errorContainer}>
          <MessageCircle size={48} color="#9ca3af" />
          <Text style={styles.errorText}>Non sei associato a nessun team</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (chatLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#2e70b7ff" />
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 8) }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={20} color="#1f2937" />
          </TouchableOpacity>

          <Text style={styles.title} numberOfLines={1}>
            Chat con il Mister
          </Text>

          <View style={{ width: 32 }} />
        </View>

        {/* Messages List */}
        {messagesLoading && messages.length === 0 ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#2e70b7ff" />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={chatItems}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => {
              if (item.type === 'date') {
                return (
                  <View style={styles.dateSeparatorWrap}>
                    <Text style={styles.dateSeparatorText}>{item.label}</Text>
                  </View>
                );
              }

              const msg = item.message;
              const isCurrentUser = msg.sender_id === user?.id;
              const senderLabel = isCurrentUser ? 'Tu' : (senderLabels[msg.sender_id] || 'Mister');

              return (
                <TouchableOpacity
                  activeOpacity={isCurrentUser ? 0.8 : 1}
                  disabled={!isCurrentUser}
                  onLongPress={() => handleDeleteMessage(msg.id)}
                  style={[styles.messageBubble, isCurrentUser && styles.messageBubbleOwn]}
                >
                  <Text style={[styles.senderName, isCurrentUser && styles.senderNameOwn]}>
                    {senderLabel}
                  </Text>
                  <Text style={[styles.messageText, isCurrentUser && styles.messageTextOwn]}>
                    {msg.text}
                  </Text>
                  <Text style={[styles.messageTime, isCurrentUser && styles.messageTimeOwn]}>
                    {new Date(msg.created_at).toLocaleTimeString('it-IT', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={styles.messagesContainer}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MessageCircle size={40} color="#d1d5db" />
                <Text style={styles.emptyText}>Nessun messaggio</Text>
                <Text style={styles.emptySubtext}>Scrivi qualcosa al tuo mister per iniziare!</Text>
              </View>
            }
          />
        )}

        {/* Input */}
        <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 8) }]}>
          <TextInput
            style={styles.input}
            placeholder="Scrivi un messaggio..."
            placeholderTextColor="#9ca3af"
            value={messageInput}
            onChangeText={setMessageInput}
            multiline
            maxLength={500}
            editable={!sendingMessage && !!chat}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!messageInput.trim() || sendingMessage) && styles.sendBtnDisabled]}
            onPress={handleSendMessage}
            disabled={!messageInput.trim() || sendingMessage || !chat}
          >
            {sendingMessage ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Send size={18} color="#ffffff" />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: '#2e70b7ff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9ca3af',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#d1d5db',
  },
  messageBubble: {
    maxWidth: '80%',
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 4,
    alignSelf: 'flex-start',
  },
  messageBubbleOwn: {
    backgroundColor: '#2e70b7ff',
    alignSelf: 'flex-end',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  senderNameOwn: {
    color: 'rgba(255,255,255,0.9)',
  },
  messageText: {
    fontSize: 15,
    color: '#1f2937',
  },
  messageTextOwn: {
    color: '#ffffff',
  },
  messageTime: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  messageTimeOwn: {
    color: 'rgba(255,255,255,0.7)',
  },
  dateSeparatorWrap: {
    alignItems: 'center',
    marginVertical: 10,
  },
  dateSeparatorText: {
    fontSize: 12,
    color: '#6b7280',
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    textTransform: 'capitalize',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1f2937',
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2e70b7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
});

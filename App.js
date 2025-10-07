// App.js
import { StatusBar } from 'expo-status-bar';

import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/* ---------------------------
   here, we create a Small unique id generator
   --------------------------- */
const uid = () => `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

/* ---------------------------
   PickerModal that is :custom modal picker
   --------------------------- */
function PickerModal({ visible, options, selectedValue, onSelect, onClose, title = 'Select' }) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose} activeOpacity={1}>
        <TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{title}</Text>
            <ScrollView>
              {options.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.modalItem,
                    opt.value === selectedValue && styles.modalItemSelected,
                  ]}
                  onPress={() => { onSelect(opt.value); onClose(); }}
                >
                  <Text style={styles.modalItemText}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.modalClose} onPress={onClose}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
}

/* ---------------------------
   The rating star from 1 to 5 which is editable StarRating (1-5, editable)
   --------------------------- */
function StarRating({ rating = 0, editable = false, onRate }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <View style={styles.starRow} accessibilityRole="radiogroup" accessible>
      {stars.map((s) => (
        <TouchableOpacity
          key={s}
          onPress={() => editable && onRate && onRate(s)}
          style={styles.starButton}
          accessibilityRole="radio"
          accessibilityState={{ selected: s === rating }}
        >
          <Text style={[styles.star, s <= rating ? styles.starFilled : styles.starEmpty]}>
            {s <= rating ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

/* ---------------------------
   TicketFormModal (Create / Edit)
   includes status selector (Created | Under Assistance | Completed)
   --------------------------- */
function TicketFormModal({ visible, onClose, onSubmit, initial }) {
  const editing = !!initial;
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [priority, setPriority] = useState(initial?.priority ?? 'normal');
  const [autoAssign, setAutoAssign] = useState(initial?.autoAssign ?? false);
  const [status, setStatus] = useState(initial?.status ?? 'Created');
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerVisibleStatus, setPickerVisibleStatus] = useState(false);

  useEffect(() => {
    if (visible) {
      setTitle(initial?.title ?? '');
      setDescription(initial?.description ?? '');
      setPriority(initial?.priority ?? 'normal');
      setAutoAssign(initial?.autoAssign ?? false);
      setStatus(initial?.status ?? 'Created');
    }
  }, [visible, initial]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Please enter a title for the ticket.');
      return;
    }
    const payload = {
      ...initial,
      title: title.trim(),
      description: description.trim(),
      priority,
      autoAssign,
      status,
    };
    onSubmit(payload);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose} activeOpacity={1}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalContentLarge}
        >
          <TouchableWithoutFeedback>
            <View>
              <Text style={styles.modalTitle}>{editing ? 'Edit Ticket' : 'Create Ticket'}</Text>

              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Short title"
                value={title}
                onChangeText={setTitle}
                returnKeyType="done"
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                placeholder="Describe the issue"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />

              <Text style={styles.label}>Priority</Text>
              <TouchableOpacity
                style={styles.pseudoPicker}
                onPress={() => setPickerVisible(true)}
              >
                <Text>{priority.charAt(0).toUpperCase() + priority.slice(1)}</Text>
              </TouchableOpacity>

              <Text style={styles.label}>Status</Text>
              <TouchableOpacity
                style={styles.pseudoPicker}
                onPress={() => setPickerVisibleStatus(true)}
              >
                <Text>{status}</Text>
              </TouchableOpacity>

              <View style={styles.rowBetween}>
                <Text style={styles.label}>Auto assign?</Text>
                <Switch value={autoAssign} onValueChange={setAutoAssign} />
              </View>

              <View style={styles.formButtons}>
                <TouchableOpacity style={styles.buttonOutline} onPress={onClose}>
                  <Text style={styles.buttonOutlineText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonPrimary} onPress={handleSave}>
                  <Text style={styles.buttonPrimaryText}>{editing ? 'Save' : 'Create'}</Text>
                </TouchableOpacity>
              </View>

              <PickerModal
                visible={pickerVisible}
                onClose={() => setPickerVisible(false)}
                selectedValue={priority}
                onSelect={setPriority}
                title="Select priority"
                options={[
                  { label: 'Low', value: 'low' },
                  { label: 'Normal', value: 'normal' },
                  { label: 'High', value: 'high' },
                ]}
              />

              <PickerModal
                visible={pickerVisibleStatus}
                onClose={() => setPickerVisibleStatus(false)}
                selectedValue={status}
                onSelect={setStatus}
                title="Select status"
                options={[
                  { label: 'Created', value: 'Created' },
                  { label: 'Under Assistance', value: 'Under Assistance' },
                  { label: 'Completed', value: 'Completed' },
                ]}
              />
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
}

/* ---------------------------
   TicketItem component
   - shows status badge with conditional color
   - Next status button (cycles Created -> Under Assistance -> Completed)
   - if Completed, shows interactive rating
   --------------------------- */
function TicketItem({ item, onEdit, onDelete, onStatusChange, onRate }) {
  const statusColors = {
    'Created': { bg: '#dbeafe', text: '#1e40af' }, // blue
    'Under Assistance': { bg: '#fff7cc', text: '#92400e' }, // yellow-ish
    'Completed': { bg: '#dcfce7', text: '#166534' }, // green
  };

  const nextStatus = () => {
    const order = ['Created', 'Under Assistance', 'Completed'];
    const idx = order.indexOf(item.status);
    return order[(idx + 1) % order.length];
  };

  const colors = statusColors[item.status] || statusColors.Created;

  return (
    <View style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketTitle}>{item.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: colors.bg }]}>
          <Text style={[styles.statusText, { color: colors.text }]}>{item.status}</Text>
        </View>
      </View>

      <Text style={styles.ticketDesc}>{item.description || '— No description —'}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>Priority:</Text>
        <Text style={styles.metaValue}>{item.priority}</Text>
        <Text style={[styles.metaText, { marginLeft: 10 }]}>Assigned:</Text>
        <Text style={styles.metaValue}>{item.autoAssign ? 'Yes' : 'No'}</Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.tinyButton}
          onPress={() => onStatusChange(item.id, nextStatus())}
        >
          <Text style={styles.tinyButtonText}>Next status</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tinyButton} onPress={() => onEdit(item)}>
          <Text style={styles.tinyButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tinyButton, styles.deleteButton]} onPress={() => onDelete(item.id)}>
          <Text style={styles.tinyButtonText}>Delete</Text>
        </TouchableOpacity>

        <View style={{ marginLeft: 'auto', alignItems: 'flex-end' }}>
          {item.status === 'Completed' ? (
            <>
              <Text style={styles.small}>Rating</Text>
              <StarRating rating={item.rating ?? 0} editable onRate={(r) => onRate(item.id, r)} />
            </>
          ) : (
            <Text style={styles.small}>Rate after completion</Text>
          )}
        </View>
      </View>
    </View>
  );
}

/* ---------------------------
   Main App
   --------------------------- */
export default function App() {
  const [tickets, setTickets] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Seed data for manual testing/demo
    const seed = [
      {
        id: uid(),
        title: 'Cannot login',
        description: 'User reports login failure after password reset.',
        priority: 'high',
        autoAssign: true,
        status: 'Created',
        rating: 0,
        createdAt: Date.now(),
      },
      {
        id: uid(),
        title: 'Payment gateway error',
        description: 'Internal server error on checkout.',
        priority: 'normal',
        autoAssign: false,
        status: 'Under Assistance',
        rating: 0,
        createdAt: Date.now() - 1000000,
      },
      {
        id: uid(),
        title: 'UI bug in mobile nav',
        description: 'Hamburger menu overlaps content on iOS small screens.',
        priority: 'low',
        autoAssign: false,
        status: 'Completed',
        rating: 4,
        createdAt: Date.now() - 2000000,
      },
    ];
    setTickets(seed);
  }, []);

  // CRUD handlers
  const createTicket = (payload) => {
    const newTicket = {
      id: uid(),
      title: payload.title,
      description: payload.description,
      priority: payload.priority ?? 'normal',
      autoAssign: payload.autoAssign ?? false,
      status: payload.status ?? 'Created',
      rating: 0,
      createdAt: Date.now(),
    };
    setTickets((prev) => [newTicket, ...prev]);
  };

  const updateTicket = (payload) => {
    setTickets((prev) => prev.map((t) => (t.id === payload.id ? { ...t, ...payload } : t)));
  };

  const deleteTicket = (id) => {
    Alert.alert('Delete ticket', 'Are you sure you want to delete this ticket?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setTickets((prev) => prev.filter((t) => t.id !== id)),
      },
    ]);
  };

  const changeStatus = (id, newStatus) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
  };

  const rateTicket = (id, rating) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, rating } : t)));
  };

  const filtered = tickets.filter((t) => (filter === 'all' ? true : t.status === filter));

  const openEdit = (ticket) => {
    setEditingTicket(ticket);
    setFormVisible(true);
  };

  const handleSubmitFromForm = (payload) => {
    if (payload.id) updateTicket(payload);
    else createTicket(payload);
    setEditingTicket(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Support Tickets</Text>
          <TouchableOpacity
            style={styles.headerAction}
            onPress={() => { setEditingTicket(null); setFormVisible(true); }}
          >
            <Text style={styles.headerActionText}>+ New</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.controls}>
          <View style={styles.filterRow}>
            <TouchableOpacity style={[styles.filterBtn, filter === 'all' && styles.filterBtnActive]} onPress={() => setFilter('all')}>
              <Text>All</Text>
            </TouchableOpacity>

            {['Created', 'Under Assistance', 'Completed'].map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.filterBtn, filter === s && styles.filterBtnActive]}
                onPress={() => setFilter(s)}
              >
                <Text>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.listArea}>
          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No tickets to show.</Text>
              <Text style={styles.emptyHint}>Tap + New to create a ticket.</Text>
            </View>
          ) : (
            <FlatList
              data={filtered.sort((a,b) => b.createdAt - a.createdAt)}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TicketItem
                  item={item}
                  onEdit={openEdit}
                  onDelete={deleteTicket}
                  onStatusChange={changeStatus}
                  onRate={rateTicket}
                />
              )}
              contentContainerStyle={{ paddingBottom: 120 }}
            />
          )}
        </View>

        <TicketFormModal
          visible={formVisible}
          onClose={() => { setFormVisible(false); setEditingTicket(null); }}
          onSubmit={handleSubmitFromForm}
          initial={editingTicket}
        />
      </View>
    </SafeAreaView>
  );
}

/* ---------------------------
   Styles
   --------------------------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f6f7fb' },
  container: { flex: 1, padding: 12 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  headerTitle: { fontSize: 22, fontWeight: '700' },
  headerAction: { backgroundColor: '#2f80ed', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  headerActionText: { color: 'white', fontWeight: '600' },

  controls: { marginBottom: 8 },
  filterRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  filterBtn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, backgroundColor: '#fff', marginRight: 8 },
  filterBtnActive: { backgroundColor: '#dbeafe' },

  listArea: { flex: 1 },

  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 40 },
  emptyText: { fontSize: 18, fontWeight: '600' },
  emptyHint: { color: '#666' },

  ticketCard: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 10, elevation: 2 },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ticketTitle: { fontSize: 16, fontWeight: '700' },

  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontWeight: '700' },

  ticketDesc: { marginTop: 6, color: '#333' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  metaText: { color: '#666', fontSize: 12 },
  metaValue: { color: '#222', fontSize: 12, marginLeft: 4, fontWeight: '600' },

  actionsRow: { flexDirection: 'row', marginTop: 10, alignItems: 'center' },
  tinyButton: { paddingVertical: 6, paddingHorizontal: 8, backgroundColor: '#eef2ff', borderRadius: 8, marginRight: 8 },
  tinyButtonText: { fontSize: 12, fontWeight: '600' },
  deleteButton: { backgroundColor: '#ffecec' },

  small: { fontSize: 12, color: '#555' },

  starRow: { flexDirection: 'row', alignItems: 'center' },
  starButton: { padding: 4 },
  star: { fontSize: 18 },
  starFilled: { color: '#f5b301' },
  starEmpty: { color: '#aaa' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: 16 },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 12, maxHeight: '70%' },
  modalContentLarge: { backgroundColor: '#fff', borderRadius: 12, padding: 16, margin: 20, maxHeight: '80%' },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  modalItem: { paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#eee' },
  modalItemText: { fontSize: 16 },
  modalItemSelected: { backgroundColor: '#f0f8ff' },
  modalClose: { marginTop: 8, alignSelf: 'flex-end' },
  modalCloseText: { color: '#2f80ed', fontWeight: '700' },

  // Form
  label: { marginTop: 8, marginBottom: 4, fontWeight: '600' },
  input: { backgroundColor: '#fff', padding: 8, borderRadius: 8, borderWidth: StyleSheet.hairlineWidth, borderColor: '#ddd' },
  inputMultiline: { minHeight: 70, textAlignVertical: 'top' },
  pseudoPicker: { padding: 10, backgroundColor: '#fff', borderRadius: 8, borderWidth: StyleSheet.hairlineWidth, borderColor: '#ddd' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },

  formButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  buttonPrimary: { backgroundColor: '#2f80ed', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  buttonPrimaryText: { color: '#fff', fontWeight: '700' },
  buttonOutline: { borderWidth: 1, borderColor: '#ddd', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#fff' },
  buttonOutlineText: { fontWeight: '600' },
});

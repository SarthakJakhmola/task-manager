import { useState, useEffect } from 'react';
import styles from './TaskForm.module.css';
 
const today = () => new Date().toISOString().split('T')[0];
 
export default function TaskForm({ onSubmit, onCancel, initial = null }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [dueDate, setDueDate] = useState(initial?.dueDate?.split('T')[0] || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
 
  useEffect(() => {
    if (initial) {
      setTitle(initial.title);
      setDescription(initial.description || '');
      setDueDate(initial.dueDate ? initial.dueDate.split('T')[0] : '');
    }
  }, [initial]);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate || null,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };
 
  return (
    <div className={styles.formCard}>
      <h3 className={styles.formTitle}>{initial ? 'Edit Task' : 'New Task'}</h3>
      <div className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>Title *</label>
          <input
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            autoFocus
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add some details..."
            rows={3}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Due date</label>
          <input
            type="date"
            className={styles.input}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? 'Saving...' : initial ? 'Save changes' : 'Add task'}
          </button>
        </div>
      </div>
    </div>
  );
}
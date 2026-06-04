import { useState } from 'react';
import TaskForm from './TaskForm';
import styles from './TaskItem.module.css';
 
function isOverdue(task) {
  if (!task.dueDate || task.completed) return false;
  const due = new Date(task.dueDate);
  due.setHours(23, 59, 59, 999);
  return due < new Date();
}
 
function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
 
export default function TaskItem({ task, onToggle, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const overdue = isOverdue(task);
 
  const handleDelete = () => {
    if (deleting) {
      onDelete(task.id);
    } else {
      setDeleting(true);
    }
  };
 
  const handleUpdate = async (payload) => {
    await onUpdate(task.id, payload);
    setEditing(false);
  };
 
  if (editing) {
    return (
      <li className={styles.item}>
        <TaskForm
          initial={task}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
        />
      </li>
    );
  }
 
  return (
    <li
      className={`${styles.item} ${task.completed ? styles.completed : ''} ${overdue ? styles.overdue : ''} fade-up`}
      onMouseLeave={() => setDeleting(false)}
    >
      <div className={styles.left}>
        <button
          className={`${styles.check} ${task.completed ? styles.checked : ''}`}
          onClick={() => onToggle(task.id, task.completed)}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.completed && (
            <svg viewBox="0 0 12 12" fill="none" width="12" height="12">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
 
        <div className={styles.content}>
          <span className={styles.title}>{task.title}</span>
          {task.description && (
            <span className={styles.desc}>{task.description}</span>
          )}
          <div className={styles.meta}>
            {task.dueDate && (
              <span className={`${styles.due} ${overdue ? styles.overdueLabel : ''}`}>
                {overdue ? '⚠ ' : ''}
                {formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>
      </div>
 
      <div className={styles.actions}>
        <button
          className={styles.editBtn}
          onClick={() => setEditing(true)}
          aria-label="Edit task"
        >
          <svg viewBox="0 0 16 16" fill="none" width="15" height="15">
            <path d="M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          className={`${styles.deleteBtn} ${deleting ? styles.confirmDelete : ''}`}
          onClick={handleDelete}
          aria-label={deleting ? 'Confirm delete' : 'Delete task'}
        >
          {deleting ? (
            <span className={styles.confirmText}>Delete?</span>
          ) : (
            <svg viewBox="0 0 16 16" fill="none" width="15" height="15">
              <path d="M3 4h10M6 4V2.5h4V4M5 4v8.5h6V4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>
    </li>
  );
}
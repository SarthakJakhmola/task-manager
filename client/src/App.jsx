import { useState } from 'react';
import { useTasks } from './hooks/useTasks';
import TaskItem from './components/TaskItem';
import TaskForm from './components/TaskForm';
import styles from './App.module.css';
 
const FILTERS = ['all', 'active', 'completed'];
 
export default function App() {
  const {
    tasks,
    counts,
    status,
    setStatus,
    search,
    setSearch,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
  } = useTasks();
 
  const [showForm, setShowForm] = useState(false);
 
  const handleCreate = async (payload) => {
    await createTask(payload);
    setShowForm(false);
  };
 
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.brand}>
            <div className={styles.logoWrap}>
              <span className={styles.logoIcon}>⚡</span>
            </div>
            <span className={styles.brandName}>
              Peak<span className={styles.brandDot}>.</span>Flow
            </span>
          </div>
          <div className={styles.statsStrip}>
            <div className={styles.statCard}>
              <span className={styles.statNum}>{counts.active}</span>
              <span className={styles.statLabel}>Active</span>
            </div>
            <div className={styles.statCard}>
              <span className={`${styles.statNum} ${styles.statNumOrange}`}>{counts.completed}</span>
              <span className={styles.statLabel}>Done</span>
            </div>
          </div>
        </div>
 
        <div className={styles.headingBlock}>
          <p className={styles.headingEyebrow}>Your daily goals</p>
          <h1 className={styles.heading}>
            Stay on <span className={styles.headingAccent}>Track.</span>
          </h1>
        </div>
        <div className={styles.headingDivider} />
      </header>
 
      <main>
        {/* Controls */}
        <div className={styles.controls}>
          <div className={styles.searchWrap}>
            <svg className={styles.searchIcon} viewBox="0 0 16 16" fill="none" width="15" height="15">
              <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input
              className={styles.search}
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className={styles.clearSearch} onClick={() => setSearch('')}>×</button>
            )}
          </div>
 
          <div className={styles.filters}>
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`${styles.filterBtn} ${status === f ? styles.activeFilter : ''}`}
                onClick={() => setStatus(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
 
          <button
            className={`${styles.addBtn} ${showForm ? styles.addBtnActive : ''}`}
            onClick={() => setShowForm((p) => !p)}
          >
            <span className={styles.addIcon}>{showForm ? '×' : '+'}</span>
            <span>{showForm ? 'Cancel' : 'New task'}</span>
          </button>
        </div>
 
        {/* New task form */}
        {showForm && (
          <div className={styles.formWrap}>
            <TaskForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
          </div>
        )}
 
        {error && <div className={styles.errorBanner}>⚠ {error}</div>}
 
        {loading && (
          <div className={styles.loadingRow}>
            <span className={styles.spinner} />
          </div>
        )}
 
        {!loading && (
          <>
            {tasks.length === 0 ? (
              <div className={styles.empty}>
                <div className={styles.emptyIconWrap}>
                  {search ? '🔍' : status === 'completed' ? '🏆' : '🎯'}
                </div>
                <p className={styles.emptyTitle}>
                  {search
                    ? 'No tasks match your search'
                    : status === 'completed'
                    ? 'No completed tasks yet'
                    : status === 'active'
                    ? "You're all caught up!"
                    : 'No tasks yet'}
                </p>
                {!search && status === 'all' && (
                  <p className={styles.emptyHint}>Hit "New task" to start crushing your goals</p>
                )}
              </div>
            ) : (
              <ul className={styles.list}>
                {tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onUpdate={updateTask}
                    onDelete={deleteTask}
                  />
                ))}
              </ul>
            )}
          </>
        )}
      </main>
    </div>
  );
}
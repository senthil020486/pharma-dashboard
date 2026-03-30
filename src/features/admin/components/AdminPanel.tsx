'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { setSelectedTab, updateUserRole, deleteUser, addUser } from '@/store/slices/adminSlice';
import { UserRole } from '@/store/slices/authSlice';
import styles from './AdminPanel.module.css';

export default function AdminPanel() {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedTab, users, auditLogs } = useSelector((state: RootState) => (state.admin as any) || {});
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'viewer' as UserRole });
  const [showAddUser, setShowAddUser] = useState(false);

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      dispatch(addUser({
        id: `user-${Date.now()}`,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      }));
      setNewUser({ name: '', email: '', role: 'viewer' });
      setShowAddUser(false);
    }
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    dispatch(updateUserRole({ userId, newRole }));
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(userId));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Admin Panel</h2>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${selectedTab === 'users' ? styles.active : ''}`}
            onClick={() => dispatch(setSelectedTab('users'))}
          >
            👥 Users
          </button>
          <button
            className={`${styles.tab} ${selectedTab === 'audit' ? styles.active : ''}`}
            onClick={() => dispatch(setSelectedTab('audit'))}
          >
            📋 Audit Logs
          </button>
        </div>
      </div>

      {selectedTab === 'users' && (
        <div className={styles.content}>
          <div className={styles.usersHeader}>
            <h3>User Management</h3>
            <button
              className={styles.addButton}
              onClick={() => setShowAddUser(!showAddUser)}
            >
              + Add User
            </button>
          </div>

          {showAddUser && (
            <div className={styles.addUserForm}>
              <input
                type="text"
                placeholder="Full Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className={styles.input}
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className={styles.input}
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                className={styles.input}
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
              <button className={styles.confirmButton} onClick={handleAddUser}>
                Add User
              </button>
              <button className={styles.cancelButton} onClick={() => setShowAddUser(false)}>
                Cancel
              </button>
            </div>
          )}

          <div className={styles.usersList}>
            {users && users.map((user: any) => (
              <div key={user.id} className={styles.userItem}>
                <div className={styles.userInfo}>
                  <div className={styles.userName}>{user.name}</div>
                  <div className={styles.userEmail}>{user.email}</div>
                </div>
                <div className={styles.userActions}>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                    className={`${styles.roleSelect} ${styles[user.role]}`}
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'audit' && (
        <div className={styles.content}>
          <h3>Audit Logs</h3>
          <div className={styles.auditList}>
            {auditLogs && auditLogs.length === 0 ? (
              <p className={styles.empty}>No audit logs yet</p>
            ) : (
              auditLogs && auditLogs.map((log: any) => (
                <div key={log.id} className={styles.auditItem}>
                  <div className={styles.auditHeader}>
                    <span className={styles.auditAction}>{log.action}</span>
                    <span className={styles.auditTime}>
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className={styles.auditDetails}>
                    <span className={styles.auditUser}>{log.userName}</span>
                    <span className={styles.auditTarget}>{log.target}: {log.targetId}</span>
                    <span className={styles.auditDesc}>{log.details}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

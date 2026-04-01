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
        <div 
          className={styles.tabs}
          role="tablist"
          aria-label="Admin panel navigation"
        >
          <button
            className={`${styles.tab} ${selectedTab === 'users' ? styles.active : ''}`}
            onClick={() => dispatch(setSelectedTab('users'))}
            role="tab"
            aria-selected={selectedTab === 'users'}
            aria-controls="users-panel"
            id="users-tab"
          >
            <span aria-hidden="true">👥</span> Users
          </button>
          <button
            className={`${styles.tab} ${selectedTab === 'audit' ? styles.active : ''}`}
            onClick={() => dispatch(setSelectedTab('audit'))}
            role="tab"
            aria-selected={selectedTab === 'audit'}
            aria-controls="audit-panel"
            id="audit-tab"
          >
            <span aria-hidden="true">📋</span> Audit Logs
          </button>
        </div>
      </div>

      {selectedTab === 'users' && (
        <div 
          className={styles.content}
          role="tabpanel"
          id="users-panel"
          aria-labelledby="users-tab"
        >
          <div className={styles.usersHeader}>
            <h3>User Management</h3>
            <button
              className={styles.addButton}
              onClick={() => setShowAddUser(!showAddUser)}
              aria-expanded={showAddUser}
              aria-label="Add new user to system"
            >
              + Add User
            </button>
          </div>

          {showAddUser && (
            <fieldset className={styles.addUserForm} aria-label="Add new user form">
              <legend className={styles.legend} style={{position: 'absolute', left: '-10000px'}}>Add New User</legend>
              <label htmlFor="user-name-input">Full Name:</label>
              <input
                id="user-name-input"
                type="text"
                placeholder="Full Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className={styles.input}
                aria-required="true"
                aria-label="User full name"
              />
              <label htmlFor="user-email-input">Email:</label>
              <input
                id="user-email-input"
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className={styles.input}
                aria-required="true"
                aria-label="User email address"
              />
              <label htmlFor="user-role-select">Role:</label>
              <select
                id="user-role-select"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                className={styles.input}
                aria-required="true"
                aria-label="User role"
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
              <button 
                className={styles.confirmButton} 
                onClick={handleAddUser}
                aria-label="Confirm add user"
              >
                Add User
              </button>
              <button 
                className={styles.cancelButton} 
                onClick={() => setShowAddUser(false)}
                aria-label="Cancel add user"
              >
                Cancel
              </button>
            </fieldset>
          )}

          <div className={styles.usersList} role="list" aria-label="System users">
            {users && users.map((user: any) => (
              <div 
                key={user.id} 
                className={styles.userItem}
                role="listitem"
                aria-label={`User: ${user.name}`}
              >
                <div className={styles.userInfo}>
                  <div className={styles.userName}>{user.name}</div>
                  <div className={styles.userEmail}>{user.email}</div>
                </div>
                <div className={styles.userActions} role="group" aria-label={`Actions for ${user.name}`}>
                  <label htmlFor={`role-${user.id}`} className={styles.roleLabel}>Change Role:</label>
                  <select
                    id={`role-${user.id}`}
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                    className={`${styles.roleSelect} ${styles[user.role]}`}
                    aria-label={`Change role for ${user.name}`}
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteUser(user.id)}
                    aria-label={`Delete user ${user.name}`}
                  >
                    <span aria-hidden="true">🗑️</span> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'audit' && (
        <div 
          className={styles.content}
          role="tabpanel"
          id="audit-panel"
          aria-labelledby="audit-tab"
        >
          <h3>Audit Logs</h3>
          <div className={styles.auditList} role="log" aria-label="System audit logs">
            {auditLogs && auditLogs.length === 0 ? (
              <p className={styles.empty} role="status">No audit logs yet</p>
            ) : (
              auditLogs && auditLogs.map((log: any) => (
                <article 
                  key={log.id} 
                  className={styles.auditItem}
                  role="article"
                  aria-label={`Audit log: ${log.action}`}
                >
                  <div className={styles.auditHeader}>
                    <span 
                      className={styles.auditAction}
                      role="status"
                      aria-label={`Action: ${log.action}`}
                    >
                      {log.action}
                    </span>
                    <span 
                      className={styles.auditTime}
                      role="status"
                      aria-label={`Date and time: ${new Date(log.timestamp).toLocaleString()}`}
                    >
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className={styles.auditDetails}>
                    <span className={styles.auditUser} aria-label={`User: ${log.userName}`}>{log.userName}</span>
                    <span className={styles.auditTarget} aria-label={`Target: ${log.target} ${log.targetId}`}>{log.target}: {log.targetId}</span>
                    <span className={styles.auditDesc} aria-label={`Details: ${log.details}`}>{log.details}</span>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserRole } from './authSlice';

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  targetId: string;
  details: string;
}

export interface AdminState {
  users: User[];
  auditLogs: AuditLog[];
  selectedTab: 'users' | 'audit';
}

const initialState: AdminState = {
  users: [
    { id: 'user-001', email: 'admin@pharma.com', name: 'Admin User', role: 'admin' },
    { id: 'user-002', email: 'editor@pharma.com', name: 'Editor User', role: 'editor' },
    { id: 'user-003', email: 'viewer@pharma.com', name: 'Viewer User', role: 'viewer' },
  ],
  auditLogs: [],
  selectedTab: 'users',
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setSelectedTab: (state, action: PayloadAction<'users' | 'audit'>) => {
      state.selectedTab = action.payload;
    },
    updateUserRole: (state, action: PayloadAction<{ userId: string; newRole: UserRole }>) => {
      const user = state.users.find(u => u.id === action.payload.userId);
      if (user) {
        user.role = action.payload.newRole;
        state.auditLogs.unshift({
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          userId: 'system',
          userName: 'System',
          action: 'UPDATE_USER_ROLE',
          target: 'User',
          targetId: action.payload.userId,
          details: `Changed role to ${action.payload.newRole}`,
        });
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      const userToDelete = state.users.find(u => u.id === action.payload);
      state.users = state.users.filter(u => u.id !== action.payload);
      if (userToDelete) {
        state.auditLogs.unshift({
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          userId: 'system',
          userName: 'System',
          action: 'DELETE_USER',
          target: 'User',
          targetId: action.payload,
          details: `Deleted user ${userToDelete.name}`,
        });
      }
    },
    addAuditLog: (state, action: PayloadAction<Omit<AuditLog, 'id'>>) => {
      state.auditLogs.unshift({
        ...action.payload,
        id: `log-${Date.now()}`,
      });
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
      state.auditLogs.unshift({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        userId: 'system',
        userName: 'System',
        action: 'ADD_USER',
        target: 'User',
        targetId: action.payload.id,
        details: `Added new user ${action.payload.name}`,
      });
    },
  },
});

export const { setSelectedTab, updateUserRole, deleteUser, addAuditLog, addUser } = adminSlice.actions;
export default adminSlice.reducer;

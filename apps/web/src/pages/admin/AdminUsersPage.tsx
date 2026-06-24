import { useEffect, useState } from 'react';
import type { User } from '@mos/shared';
import { UserRole } from '@mos/shared';
import { usersService } from '../../services/users.service';
import { AdminNav } from '../../components/layout/AdminNav';

const ROLES = Object.values(UserRole);

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = (p = 1) => {
    setIsLoading(true);
    usersService.getAll(p, 20).then(({ data, total }) => {
      setUsers(data);
      setTotal(total);
      setIsLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleRoleChange = async (id: string, role: UserRole) => {
    setUpdatingId(id);
    try {
      const updated = await usersService.assignRole(id, role);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    await usersService.delete(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <AdminNav />
      <div className="page-header">
        <h1 className="page-title">Manage Users</h1>
        <p className="page-subtitle">{total} users registered</p>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  <div className="animate-spin h-6 w-6 border-2 border-brand-500 border-t-transparent rounded-full mx-auto" />
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-brand-700 flex items-center justify-center text-xs font-bold text-white">
                        {user.firstName[0]}
                      </div>
                      <span className="text-white">{user.firstName} {user.lastName}</span>
                    </div>
                  </td>
                  <td className="text-slate-400">{user.email}</td>
                  <td>
                    <select
                      id={`role-select-${user.id}`}
                      value={user.role}
                      disabled={updatingId === user.id}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                      className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <span className={user.isActive ? 'badge-green' : 'badge-red'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="text-slate-500 text-xs">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      id={`delete-user-${user.id}`}
                      onClick={() => handleDelete(user.id)}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

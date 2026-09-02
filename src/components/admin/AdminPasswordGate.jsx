import React, { useState } from 'react';
import { api } from '@/api/apiClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, Loader2 } from 'lucide-react';

export default function AdminPasswordGate({ onUnlock }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim() || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      // Verify by attempting a load. If wrong, backend returns 401.
      await api.functions.invoke('listConversations', { password });
      onUnlock(password);
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.error || err?.message || 'Login failed';
      setError(status === 401 ? 'Incorrect password.' : msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-card border border-border rounded-2xl p-8 shadow-sm"
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <h1 className="font-serif text-2xl text-foreground mb-1">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Enter the password to view student dialogues.</p>
        </div>

        <Input
          type="password"
          autoFocus
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-3"
          disabled={submitting}
        />

        {error && (
          <p className="text-xs text-destructive mb-3">{error}</p>
        )}

        <Button
          type="submit"
          disabled={!password.trim() || submitting}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Unlock'}
        </Button>
      </form>
    </div>
  );
}
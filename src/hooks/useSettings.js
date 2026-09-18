import { useState, useEffect, useCallback } from 'react';
import { settingsService } from '../services/admin/settingsService';

export function useSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [savedMsg, setSavedMsg] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load settings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateSettings = useCallback(async (newSettings) => {
    setSaving(true);
    setError(null);
    try {
      const data = await settingsService.updateSettings(newSettings);
      setSettings(data);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
      return data;
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save settings.');
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    settings,
    loading,
    saving,
    error,
    savedMsg,
    reload: load,
    updateSettings,
  };
}

export default useSettings;

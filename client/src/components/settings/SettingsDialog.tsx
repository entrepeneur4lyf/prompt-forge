import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getApiKey, setApiKey, clearApiKey } from '@/lib/storage';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const [apiKey, setApiKeyState] = useState('');

  useEffect(() => {
    const storedKey = getApiKey();
    if (storedKey) {
      setApiKeyState(storedKey);
    }
  }, []);

  const handleSave = () => {
    if (apiKey) {
      setApiKey(apiKey);
    } else {
      clearApiKey();
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Gemini API Key
            </label>
            <Input
              value={apiKey}
              onChange={(e) => setApiKeyState(e.target.value)}
              type="password"
              placeholder="Enter your Gemini API key"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={() => {
                clearApiKey();
                setApiKeyState('');
              }}
            >
              Clear Key
            </Button>
            <Button className="flex-1" onClick={handleSave}>
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

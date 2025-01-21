import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Provider = 'google' | 'anthropic' | 'openai';

interface ProviderConfig {
  name: string;
  models: string[];
}

const providers: Record<Provider, ProviderConfig> = {
  google: {
    name: 'Google',
    models: ['gemini-1.5-pro'],
  },
  anthropic: {
    name: 'Anthropic',
    models: ['claude-3-sonnet-20240119'],
  },
  openai: {
    name: 'OpenAI',
    models: ['gpt-4-turbo-preview', 'gpt-4', 'gpt-3.5-turbo'],
  },
};

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const { toast } = useToast();
  const [selectedProvider, setSelectedProvider] = useState<Provider>('google');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [apiKeys, setApiKeys] = useState<Record<Provider, string>>({
    google: '',
    anthropic: '',
    openai: '',
  });
  const [showApiKey, setShowApiKey] = useState<Record<Provider, boolean>>({
    google: false,
    anthropic: false,
    openai: false,
  });

  useEffect(() => {
    // Load settings from local storage
    const storedProvider = localStorage.getItem('selectedProvider') as Provider;
    const storedModel = localStorage.getItem('selectedModel');
    const storedApiKeys = localStorage.getItem('apiKeys');

    if (storedProvider) setSelectedProvider(storedProvider);
    if (storedModel) setSelectedModel(storedModel);
    if (storedApiKeys) {
      try {
        setApiKeys(JSON.parse(storedApiKeys));
      } catch (e) {
        console.error('Failed to parse stored API keys');
      }
    }

    // Set default model if none selected
    if (!storedModel) {
      setSelectedModel(providers[storedProvider || 'google'].models[0]);
    }
  }, []);

  const handleSave = () => {
    // Save settings to local storage
    localStorage.setItem('selectedProvider', selectedProvider);
    localStorage.setItem('selectedModel', selectedModel);
    localStorage.setItem('apiKeys', JSON.stringify(apiKeys));

    toast({
      title: 'Settings saved',
      description: 'Your AI provider settings have been saved successfully.',
    });
    onClose();
  };

  const toggleApiKeyVisibility = (provider: Provider) => {
    setShowApiKey(prev => ({
      ...prev,
      [provider]: !prev[provider],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <Label>AI Provider</Label>
            <RadioGroup
              value={selectedProvider}
              onValueChange={(value: Provider) => {
                setSelectedProvider(value);
                setSelectedModel(providers[value].models[0]);
              }}
              className="grid grid-cols-3 gap-4"
              data-testid="settings-provider-radio-group"
            >
              {Object.entries(providers).map(([key, { name }]) => (
                <div key={key} className="flex items-center space-x-2">
                  <RadioGroupItem value={key} id={key} data-testid={`settings-provider-radio-${key}`} />
                  <Label htmlFor={key}>{name}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label>Models</Label>
            <Select
              value={selectedModel}
              onValueChange={setSelectedModel}
              data-testid="settings-model-select"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {providers[selectedProvider].models.map((model) => (
                  <SelectItem
                    key={model}
                    value={model}
                    data-testid={`settings-model-option-${model}`}
                  >
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label>API Keys</Label>
            {Object.entries(providers).map(([key, { name }]) => (
              <div key={key} className="space-y-2">
                <Label>{name} API Key</Label>
                <div className="relative">
                  <Input
                    type={showApiKey[key as Provider] ? 'text' : 'password'}
                    value={apiKeys[key as Provider]}
                    onChange={(e) =>
                      setApiKeys(prev => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    placeholder={`Enter your ${name} API key`}
                    className="pr-10"
                    data-testid={`settings-api-key-input-${key}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-auto py-1"
                    onClick={() => toggleApiKeyVisibility(key as Provider)}
                    data-testid={`settings-api-key-toggle-${key}`}
                  >
                    {showApiKey[key as Provider] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} data-testid="settings-cancel-button">
            Cancel
          </Button>
          <Button onClick={handleSave} data-testid="settings-save-button">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
import { useState, useEffect, useCallback } from 'react';
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
import { getApiKeys, setApiKeys, SELECTED_PROVIDER, SELECTED_MODEL, StoredApiKeys } from '@/lib/storage';
import { Model, fetchAllModels } from '@/lib/providers';
import { LoadingSpinner } from '@/components/ui/loading';

type Provider = 'google' | 'anthropic' | 'openai' | 'deepseek';

interface ProviderConfig {
  name: string;
}

const providers: Record<Provider, ProviderConfig> = {
  google: {
    name: 'Google',
  },
  anthropic: {
    name: 'Anthropic',
  },
  openai: {
    name: 'OpenAI',
  },
  deepseek: {
    name: 'Deepseek',
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
  const [apiKeys, setApiKeysState] = useState<StoredApiKeys>({
    google: '',
    anthropic: '',
    openai: '',
    deepseek: '',
  });
  const [showApiKey, setShowApiKey] = useState<Record<Provider, boolean>>({
    google: false,
    anthropic: false,
    openai: false,
    deepseek: false,
  });
  const [models, setModels] = useState<Model[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validatingKeys, setValidatingKeys] = useState<Record<Provider, boolean>>({
    google: false,
    anthropic: false,
    openai: false,
    deepseek: false,
  });

  const loadModels = useCallback(async () => {
    setIsLoadingModels(true);
    setError(null);
    try {
      const allModels = await fetchAllModels();
      setModels(allModels);

      // Set first available model from selected provider if none selected
      if (!selectedModel) {
        const providerModels = allModels.filter(m => m.provider === selectedProvider);
        if (providerModels.length > 0) {
          setSelectedModel(providerModels[0].id);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load models');
      toast({
        title: 'Error',
        description: 'Failed to load available models. Please check your API keys.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingModels(false);
    }
  }, [selectedProvider, toast, selectedModel]);

  useEffect(() => {
    // Load settings from local storage
    const storedProvider = localStorage.getItem(SELECTED_PROVIDER) as Provider;
    const storedModel = localStorage.getItem(SELECTED_MODEL);
    const storedApiKeys = getApiKeys();

    if (storedProvider) setSelectedProvider(storedProvider);
    if (storedModel) setSelectedModel(storedModel);
    if (storedApiKeys) {
      setApiKeysState(storedApiKeys);
    }
  }, []);

  useEffect(() => {
    if (open) {
      loadModels();
    }
  }, [open, loadModels]);

  const handleSave = () => {
    // Save settings to local storage
    localStorage.setItem(SELECTED_PROVIDER, selectedProvider);
    localStorage.setItem(SELECTED_MODEL, selectedModel);
    setApiKeys(apiKeys);

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

  const handleApiKeyChange = (provider: Provider, value: string) => {
    setApiKeysState(prev => ({
      ...prev,
      [provider]: value,
    }));
  };

  const handleApiKeyBlur = async (provider: Provider) => {
    if (!apiKeys[provider]) return;

    setValidatingKeys(prev => ({ ...prev, [provider]: true }));

    // Save the API key immediately when the field loses focus
    const updatedKeys = {
      ...apiKeys,
      [provider]: apiKeys[provider],
    };
    setApiKeys(updatedKeys);

    // Only fetch models if this is the selected provider
    if (provider === selectedProvider) {
      await loadModels();
    }

    setValidatingKeys(prev => ({ ...prev, [provider]: false }));
  };

  const providerModels = models.filter(model => model.provider === selectedProvider);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[675px]">
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
                // Reset selected model when changing provider
                setSelectedModel('');
              }}
              className="grid grid-cols-5 gap-4"
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
              disabled={isLoadingModels || providerModels.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  isLoadingModels ? 'Loading models...' :
                  error ? 'Failed to load models' :
                  providerModels.length === 0 ? 'No models available' :
                  'Select a model'
                } />
              </SelectTrigger>
              <SelectContent>
                {isLoadingModels ? (
                  <div className="flex items-center justify-center py-2">
                    <LoadingSpinner />
                  </div>
                ) : providerModels.map((model) => (
                  <SelectItem
                    key={model.id}
                    value={model.id}
                    data-testid={`settings-model-option-${model.id}`}
                  >
                    {model.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label>API Keys</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(providers).map(([key, { name }]) => (
                <div key={key} className="space-y-2">
                  <Label>{name} API Key</Label>
                  <div className="relative">
                    <Input
                      type={showApiKey[key as Provider] ? 'text' : 'password'}
                      value={apiKeys[key as Provider]}
                      onChange={(e) => handleApiKeyChange(key as Provider, e.target.value)}
                      onBlur={() => handleApiKeyBlur(key as Provider)}
                      placeholder={`Enter your ${name} API key`}
                      className="pr-10"
                      data-testid={`settings-api-key-input-${key}`}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      {validatingKeys[key as Provider] && (
                        <LoadingSpinner className="h-4 w-4" />
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto py-1"
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
                </div>
              ))}
            </div>
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
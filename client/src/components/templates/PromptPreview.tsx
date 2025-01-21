import { useState, useCallback, KeyboardEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Template } from '@/lib/types';
import { enhancePrompt } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Copy, Wand2, Loader2, Settings2, Save, Maximize2, RotateCcw } from 'lucide-react';
import { generateEnhancementPrompt } from '@/lib/defaultPrompts';
import EnhancementPromptsDialog from '../settings/EnhancementPromptsDialog';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { encodePlaceholders, decodePlaceholders, preservePlaceholders } from '@/lib/utils';
import { FullPromptModal } from './FullPromptModal';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface PromptPreviewProps {
  template: Template | null;
  dynamicFields: Array<{ name: string; value: string }>;
  onDynamicFieldsChange: (fields: Array<{ name: string; value: string }>) => void;
  onSaveEnhanced?: (template: Template) => void;
}

export default function PromptPreview({
  template,
  dynamicFields,
  onDynamicFieldsChange,
  onSaveEnhanced,
}: PromptPreviewProps) {
  const { toast } = useToast();
  const [showPromptsDialog, setShowPromptsDialog] = useState(false);
  const [showFullPromptModal, setShowFullPromptModal] = useState(false);
  const [composedPrompt, setComposedPrompt] = useState('');
  const [enableEnhancement, setEnableEnhancement] = useState(() => {
    const stored = localStorage.getItem('enableEnhancement');
    return stored === null ? true : JSON.parse(stored);
  });

  const handleEnhancementToggle = (enabled: boolean) => {
    setEnableEnhancement(enabled);
    localStorage.setItem('enableEnhancement', JSON.stringify(enabled));
  };

  const enhanceMutation = useMutation({
    mutationFn: enhancePrompt,
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error
          ? error.message
          : 'Failed to enhance prompt. Check your API key in settings.',
        variant: 'destructive',
      });
    },
  });

  const handleEnhance = async () => {
    if (!template) return;

    const basePrompt = generatePrompt();
    const promptToSend = enableEnhancement
      ? `${composedPrompt || generateEnhancementPrompt(template, '')}\n\nPlease enhance the following prompt while maintaining its core intent and purpose:\n\n${basePrompt}`
      : basePrompt;

    enhanceMutation.mutate(promptToSend);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    handleEnhance();
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnhance();
    }
  };

  const resetToOriginal = () => {
    onDynamicFieldsChange([]);
    enhanceMutation.reset();
    toast({
      title: 'Reset',
      description: 'Prompt reset to original template',
    });
  };

  const formatFieldName = (name: string) => {
    return name
      .split(/(?=[A-Z])|_|\s/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const generatePrompt = () => {
    let prompt = template?.content || '';
    dynamicFields.forEach((field) => {
      prompt = prompt.replace(`{{${field.name}}}`, field.value);
    });
    return prompt;
  };

  // Pure function to handle copying text to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied',
        description: 'Content copied to clipboard',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  // Prevent generation when copying
  const handleCopy = async (text: string) => {
    if (!text) return;
    await copyToClipboard(text);
  };

  const handleSaveEditedPrompt = (content: string) => {
    if (!template) return;

    if (onSaveEnhanced) {
      onSaveEnhanced({
        ...template,
        content: preservePlaceholders(
          decodePlaceholders(content),
          template.content
        ),
      });
    }
  };

  if (!template) {
    return (
      <Card className="p-4">
        <p className="text-muted-foreground text-center">
          Select a template to preview
        </p>
      </Card>
    );
  }

  const placeholders = Array.from(
    template.content.matchAll(/\{\{([^}]+)\}\}/g),
    (m) => m[1]
  );

  const isPromptField = (fieldName: string) => {
    const name = fieldName.toLowerCase();
    return name.includes('prompt') || name === 'content';
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Preview</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFullPromptModal(true)}
          >
            <Maximize2 className="mr-2 h-4 w-4" />
            View Full Prompt
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPromptsDialog(true)}
          >
            <Settings2 className="mr-2 h-4 w-4" />
            Enhancement Prompts
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {placeholders.map((placeholder) => {
          const field = dynamicFields.find((f) => f.name === placeholder);
          const isPromptInput = isPromptField(placeholder);
          const fieldId = `field-${placeholder}`;

          return (
            <div key={placeholder}>
              <Label htmlFor={fieldId} className="text-sm font-medium mb-2 block">
                {formatFieldName(placeholder)}
              </Label>
              {isPromptInput ? (
                <Textarea
                  id={fieldId}
                  value={field?.value || ''}
                  onChange={(e) => {
                    const newFields = [...dynamicFields];
                    const index = newFields.findIndex((f) => f.name === placeholder);
                    if (index >= 0) {
                      newFields[index] = { name: placeholder, value: e.target.value };
                    } else {
                      newFields.push({ name: placeholder, value: e.target.value });
                    }
                    onDynamicFieldsChange(newFields);
                  }}
                  onKeyDown={handleKeyPress}
                  placeholder={`Enter value for ${formatFieldName(placeholder)}`}
                  className="w-full min-h-[100px] resize-y font-mono bg-muted/30"
                  aria-label={`Enter ${formatFieldName(placeholder)}`}
                />
              ) : (
                <Input
                  id={fieldId}
                  value={field?.value || ''}
                  onChange={(e) => {
                    const newFields = [...dynamicFields];
                    const index = newFields.findIndex((f) => f.name === placeholder);
                    if (index >= 0) {
                      newFields[index] = { name: placeholder, value: e.target.value };
                    } else {
                      newFields.push({ name: placeholder, value: e.target.value });
                    }
                    onDynamicFieldsChange(newFields);
                  }}
                  placeholder={`Enter value for ${formatFieldName(placeholder)}`}
                  className="w-full"
                  aria-label={`Enter ${formatFieldName(placeholder)}`}
                />
              )}
            </div>
          );
        })}

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Enhancement Instructions</h3>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                      ?
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <p className="text-sm">
                      This is the instruction prompt that will be used to enhance your template.
                      You can edit it directly or use the Enhancement Prompts settings to modify the defaults.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="enhance-mode"
                  checked={enableEnhancement}
                  onCheckedChange={handleEnhancementToggle}
                />
                <Label htmlFor="enhance-mode">Enable Enhancement</Label>
              </div>
            </div>
            {enableEnhancement && (
              <Textarea
                value={composedPrompt || generateEnhancementPrompt(template, '')}
                onChange={(e) => setComposedPrompt(e.target.value)}
                className="min-h-[150px] font-mono text-sm bg-muted/30 border-2 border-primary/20 resize-y"
                onKeyDown={handleKeyPress}
              />
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Enhanced Prompt</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={resetToOriginal}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Enhanced
              </Button>
            </div>
            <div className="relative bg-muted p-4 rounded-lg min-h-[120px]">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={() => handleCopy(generatePrompt())}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <div className="whitespace-pre-wrap pt-8 font-mono">
                {generatePrompt()}
              </div>
            </div>
          </div>

          {enhanceMutation.data && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Enhanced Prompt</h3>
                {onSaveEnhanced && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSaveEnhanced({
                      ...template,
                      content: preservePlaceholders(
                        decodePlaceholders(enhanceMutation.data.enhancedPrompt),
                        template.content
                      ),
                    })}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save as Template
                  </Button>
                )}
              </div>
              <div className="relative bg-muted/80 border-2 border-primary/10 p-4 rounded-lg min-h-[150px]">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={() => handleCopy(decodePlaceholders(enhanceMutation.data.enhancedPrompt))}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Textarea
                  className="whitespace-pre-wrap pt-8 font-mono w-full min-h-[120px] bg-transparent border-none focus-visible:ring-0 resize-none"
                  value={decodePlaceholders(enhanceMutation.data.enhancedPrompt)}
                  onChange={(e) => {
                    // Update the enhanced prompt in the mutation data
                    enhanceMutation.data = {
                      ...enhanceMutation.data,
                      enhancedPrompt: e.target.value
                    };
                  }}
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={enhanceMutation.isPending}
          >
            {enhanceMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            {enableEnhancement ? 'Enhance' : 'Process'}
          </Button>
        </div>
      </form>

      <EnhancementPromptsDialog
        open={showPromptsDialog}
        onClose={() => setShowPromptsDialog(false)}
      />

      <FullPromptModal
        open={showFullPromptModal}
        onClose={() => setShowFullPromptModal(false)}
        template={template}
        dynamicFields={dynamicFields}
        enhancedPrompt={composedPrompt || generateEnhancementPrompt(template, '')}
        enableEnhancement={enableEnhancement}
        onSave={handleSaveEditedPrompt}
      />
    </Card>
  );
}
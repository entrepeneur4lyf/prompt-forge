import { useState, useCallback, KeyboardEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Template } from '@/lib/types';
import { enhancePrompt } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Copy, Wand2, Loader2, Settings2, Save, Maximize2, X, RotateCcw } from 'lucide-react';
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
  const [enhancementInstructions, setEnhancementInstructions] = useState('');
  const [showPromptsDialog, setShowPromptsDialog] = useState(false);
  const [showFullPromptModal, setShowFullPromptModal] = useState(false);
  const [composedPrompt, setComposedPrompt] = useState('');
  const [enableEnhancement, setEnableEnhancement] = useState(() => {
    const stored = localStorage.getItem('enableEnhancement');
    return stored === null ? true : JSON.parse(stored);
  });

  // Save enhancement toggle state
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

  const clearAll = () => {
    onDynamicFieldsChange([]);
    setComposedPrompt('');
    setEnhancementInstructions('');
    enhanceMutation.reset();
    toast({
      title: 'Cleared',
      description: 'All prompts have been cleared',
    });
  };

  const clearGenerated = () => {
    enhanceMutation.reset();
    toast({
      title: 'Cleared',
      description: 'Enhanced prompt has been cleared',
    });
  };

  const resetToOriginal = () => {
    onDynamicFieldsChange([]);
    toast({
      title: 'Reset',
      description: 'Prompt reset to original template',
    });
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
    if (e.key === 'Enter' && name.toLowerCase() === 'prompt') {
      e.preventDefault();
      handleEnhance();
    }
  };

  // Format field name to title case
  const formatFieldName = (name: string) => {
    return name
      .split(/(?=[A-Z])|_|\s/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
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

  const generatePrompt = () => {
    let prompt = template.content;
    dynamicFields.forEach((field) => {
      prompt = prompt.replace(`{{${field.name}}}`, field.value);
    });
    return prompt;
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'Prompt copied to clipboard',
    });
  };

  const handleSaveEnhanced = () => {
    if (!enhanceMutation.data?.enhancedPrompt || !onSaveEnhanced || !template) {
      return;
    }

    const preservedContent = preservePlaceholders(
      decodePlaceholders(enhanceMutation.data.enhancedPrompt),
      template.content
    );

    onSaveEnhanced({
      ...template,
      content: preservedContent,
    });

    toast({
      title: 'Template Updated',
      description: 'Enhanced prompt has been saved to the template.',
    });
  };

  const handleEnhance = async () => {
    const basePrompt = generatePrompt();
    if (enableEnhancement) {
      const enhancementPrompt = composedPrompt || generateEnhancementPrompt(template, enhancementInstructions);
      const fullPrompt = `${enhancementPrompt}\n\nPlease enhance the following prompt:\n${basePrompt}`;
      enhanceMutation.mutate(fullPrompt);
    } else {
      // If enhancement is disabled, just use the base prompt
      enhanceMutation.mutate(basePrompt);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Preview</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={clearAll}
          >
            <X className="mr-2 h-4 w-4" />
            Clear All
          </Button>
          {enhanceMutation.data && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearGenerated}
            >
              <X className="mr-2 h-4 w-4" />
              Clear Enhanced
            </Button>
          )}
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

      <div className="space-y-6">
        {placeholders.map((placeholder) => {
          const field = dynamicFields.find((f) => f.name === placeholder);
          const isPromptField = placeholder.toLowerCase() === 'prompt';
          const InputComponent = isPromptField ? Textarea : Input;

          return (
            <div key={placeholder}>
              <label className="text-sm font-medium mb-2 block">
                {formatFieldName(placeholder)}
              </label>
              <InputComponent
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
                onKeyDown={(e) => handleKeyPress(e, placeholder)}
                placeholder={`Enter value for ${formatFieldName(placeholder)}`}
                className={`w-full ${isPromptField ? 'min-h-[100px]' : ''}`}
              />
            </div>
          );
        })}
      </div>

      <div className="space-y-6 mt-8">
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
            <>
              <Textarea
                value={composedPrompt || generateEnhancementPrompt(template, enhancementInstructions)}
                onChange={(e) => setComposedPrompt(e.target.value)}
                className="min-h-[150px] font-mono text-sm bg-muted/30 border-2 border-primary/20"
              />
              <Input
                value={enhancementInstructions}
                onChange={(e) => setEnhancementInstructions(e.target.value)}
                placeholder="Add specific instructions for enhancement (optional)"
                className="w-full mt-2"
              />
            </>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">{enableEnhancement ? 'Enhanced' : 'Generated'} Prompt</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetToOriginal}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset to Original
              </Button>
            </div>
          </div>
          <div className="relative bg-muted p-4 rounded-lg min-h-[120px]">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={() => copyToClipboard(generatePrompt())}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <div className="whitespace-pre-wrap pt-8">
              {generatePrompt()}
            </div>
          </div>
        </div>

        {enhanceMutation.data && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">
                {enableEnhancement ? 'Enhanced' : 'Generated'} Output
              </h3>
              {onSaveEnhanced && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveEnhanced}
                  className="ml-2"
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
                onClick={() => copyToClipboard(decodePlaceholders(enhanceMutation.data.enhancedPrompt))}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <div
                className="whitespace-pre-wrap pt-8"
                dangerouslySetInnerHTML={{
                  __html: encodePlaceholders(enhanceMutation.data.enhancedPrompt)
                }}
              />
            </div>
          </div>
        )}

        <Button
          className="w-full"
          onClick={handleEnhance}
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

      <EnhancementPromptsDialog
        open={showPromptsDialog}
        onClose={() => setShowPromptsDialog(false)}
      />

      <FullPromptModal
        open={showFullPromptModal}
        onClose={() => setShowFullPromptModal(false)}
        template={template}
        dynamicFields={dynamicFields}
        enhancedPrompt={composedPrompt || generateEnhancementPrompt(template, enhancementInstructions)}
        enableEnhancement={enableEnhancement}
      />
    </Card>
  );
}
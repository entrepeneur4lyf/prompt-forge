import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Template, DynamicField } from '@/lib/types';
import { enhancePrompt } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Copy, Wand2, Loader2, Settings2, Save } from 'lucide-react';
import { generateEnhancementPrompt } from '@/lib/defaultPrompts';
import EnhancementPromptsDialog from '../settings/EnhancementPromptsDialog';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { encodePlaceholders, decodePlaceholders, preservePlaceholders } from '@/lib/utils';

interface PromptPreviewProps {
  template: Template | null;
  dynamicFields: DynamicField[];
  onDynamicFieldsChange: (fields: DynamicField[]) => void;
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
  const [composedPrompt, setComposedPrompt] = useState('');

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
    const enhancementPrompt = composedPrompt || generateEnhancementPrompt(template, enhancementInstructions);
    const fullPrompt = `${enhancementPrompt}\n\nPlease enhance the following prompt:\n${basePrompt}`;
    enhanceMutation.mutate(fullPrompt);
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Preview</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowPromptsDialog(true)}
        >
          <Settings2 className="mr-2 h-4 w-4" />
          Enhancement Prompts
        </Button>
      </div>

      <div className="space-y-6">
        {placeholders.map((placeholder) => {
          const field = dynamicFields.find((f) => f.name === placeholder);
          return (
            <div key={placeholder}>
              <label className="text-sm font-medium mb-2 block">
                {placeholder}
              </label>
              <Input
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
                placeholder={`Enter value for ${placeholder}`}
                className="w-full"
              />
            </div>
          );
        })}
      </div>

      <div className="space-y-6 mt-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold">Enhancement Prompt</h3>
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
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Generated Prompt
          </label>
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
              <label className="text-sm font-semibold">
                Enhanced Prompt
              </label>
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
          Enhance
        </Button>
      </div>

      <EnhancementPromptsDialog 
        open={showPromptsDialog}
        onClose={() => setShowPromptsDialog(false)}
      />
    </Card>
  );
}
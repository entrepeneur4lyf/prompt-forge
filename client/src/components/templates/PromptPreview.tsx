import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Template, DynamicField } from '@/lib/types';
import { enhancePrompt } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Copy, Wand2, Loader2 } from 'lucide-react';

interface PromptPreviewProps {
  template: Template | null;
  dynamicFields: DynamicField[];
  onDynamicFieldsChange: (fields: DynamicField[]) => void;
}

export default function PromptPreview({
  template,
  dynamicFields,
  onDynamicFieldsChange,
}: PromptPreviewProps) {
  const { toast } = useToast();
  const [enhancementInstructions, setEnhancementInstructions] = useState('');

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

  const handleEnhance = async () => {
    const prompt = generatePrompt();
    const defaultInstructions = "Please rewrite and enhance the following prompt, make it more creative and engaging:";
    const instructions = enhancementInstructions 
      ? `${defaultInstructions} ${enhancementInstructions}:`
      : `${defaultInstructions}:`;

    const fullPrompt = `${instructions} ${prompt}`;
    enhanceMutation.mutate(fullPrompt);
  };

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Preview</h2>

      <div className="space-y-4 mb-4">
        {placeholders.map((placeholder) => {
          const field = dynamicFields.find((f) => f.name === placeholder);
          return (
            <div key={placeholder}>
              <label className="text-sm font-medium mb-1 block">
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
              />
            </div>
          );
        })}
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">
            Generated Prompt
          </label>
          <div className="bg-muted p-4 rounded-lg min-h-[100px] whitespace-pre-wrap">
            {generatePrompt()}
          </div>
        </div>

        {enhanceMutation.data && (
          <div>
            <label className="text-sm font-medium mb-1 block">
              Enhanced Prompt
            </label>
            <div className="bg-muted p-4 rounded-lg min-h-[100px] whitespace-pre-wrap">
              {enhanceMutation.data.enhancedPrompt}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Enhancement Instructions (Optional)
            </label>
            <Input
              value={enhancementInstructions}
              onChange={(e) => setEnhancementInstructions(e.target.value)}
              placeholder="Add specific instructions for enhancement"
            />
          </div>

          <div className="flex gap-2">
            <Button
              className="flex-1"
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
            <Button 
              className="flex-1" 
              onClick={() => copyToClipboard(enhanceMutation.data?.enhancedPrompt || generatePrompt())}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
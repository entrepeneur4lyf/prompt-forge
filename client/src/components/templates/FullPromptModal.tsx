import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Template } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Copy } from 'lucide-react';
import { useState, useEffect as ReactuseEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface FullPromptModalProps {
  open: boolean;
  onClose: () => void;
  template: Template | null;
  dynamicFields: Array<{ name: string; value: string }>;
  enhancedPrompt: string;
  enableEnhancement: boolean;
  onSave?: (content: string) => void;
}

export function FullPromptModal({ 
  open, 
  onClose, 
  template, 
  dynamicFields,
  enhancedPrompt,
  enableEnhancement,
  onSave
}: FullPromptModalProps) {
  const { toast } = useToast();
  const [editableContent, setEditableContent] = useState('');
  const [activeTab, setActiveTab] = useState('view');

  if (!template) return null;

  const renderSection = (title: string, content: string) => (
    <Card className="p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="whitespace-pre-wrap font-mono text-sm">
        {content}
      </div>
    </Card>
  );

  // Function to replace placeholders with actual values
  const processTemplate = () => {
    let content = template.content;
    dynamicFields.forEach(({ name, value }) => {
      content = content.replace(`{{${name}}}`, value);
    });
    return content;
  };

  // Construct the final enhancement prompt
  const constructFinalPrompt = () => {
    const originalContent = processTemplate();

    if (!enableEnhancement) {
      return originalContent;
    }

    return `Original Template:
${originalContent}

Template Parameters:
- Domain: ${template.domain}
- Model: ${template.modelType}
${template.agentEnhanced ? `- Agent Role: ${template.agentType}` : ''}
- Methodologies: ${template.methodologies.join(', ')}

Enhancement Instructions:
${enhancedPrompt}

Please enhance the following prompt while maintaining its core intent and purpose:

${originalContent}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editableContent || constructFinalPrompt());
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editableContent);
      toast({
        title: "Saved!",
        description: "Changes saved successfully",
      });
    }
  };

  // Initialize editable content when modal opens or content changes
  ReactuseEffect(() => {
    setEditableContent(constructFinalPrompt());
  }, [template, dynamicFields, enhancedPrompt, enableEnhancement]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {enableEnhancement ? 'Full Enhancement Prompt' : 'Prompt Preview'}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full pr-4">
          <div className="space-y-6 py-4">
            {renderSection("Original Template", template.content)}

            {enableEnhancement && (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Template Parameters</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4">
                      <p><strong>Domain:</strong> {template.domain}</p>
                      <p><strong>Model:</strong> {template.modelType}</p>
                      {template.agentEnhanced && (
                        <p><strong>Agent Role:</strong> {template.agentType}</p>
                      )}
                    </Card>
                    <Card className="p-4">
                      <p><strong>Methodologies:</strong></p>
                      <ul className="list-disc list-inside">
                        {template.methodologies.map((methodology) => (
                          <li key={methodology}>{methodology}</li>
                        ))}
                      </ul>
                    </Card>
                  </div>
                </div>

                {dynamicFields.length > 0 && (
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-2">Dynamic Fields</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {dynamicFields.map(({ name, value }) => (
                        <p key={name}>
                          <strong>{name}:</strong> {value}
                        </p>
                      ))}
                    </div>
                  </Card>
                )}
              </>
            )}

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {enableEnhancement ? "Complete Enhancement Prompt" : "Generated Prompt"}
                </h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleCopy}
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                  {onSave && (
                    <Button 
                      size="sm"
                      onClick={handleSave}
                      className="flex items-center gap-2"
                    >
                      Save Changes
                    </Button>
                  )}
                </div>
              </div>

              <Tabs defaultValue="view" value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="view">View</TabsTrigger>
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                </TabsList>
                <TabsContent value="view">
                  <Card className="p-4">
                    <div className="whitespace-pre-wrap font-mono text-sm">
                      {constructFinalPrompt()}
                    </div>
                  </Card>
                </TabsContent>
                <TabsContent value="edit">
                  <Textarea
                    value={editableContent}
                    onChange={(e) => setEditableContent(e.target.value)}
                    className="min-h-[300px] font-mono"
                    data-testid="full-prompt-modal-textarea"
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
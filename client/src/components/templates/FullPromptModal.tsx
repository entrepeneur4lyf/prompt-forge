import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MarkdownPreview } from '@/components/ui/markdown-preview';
import { Template } from '@/lib/types';
import { Card } from '@/components/ui/card';

interface FullPromptModalProps {
  open: boolean;
  onClose: () => void;
  template: Template | null;
  dynamicFields: Array<{ name: string; value: string }>;
  enhancedPrompt: string;
}

export function FullPromptModal({ 
  open, 
  onClose, 
  template, 
  dynamicFields,
  enhancedPrompt 
}: FullPromptModalProps) {
  if (!template) return null;

  const renderSection = (title: string, content: string) => (
    <Card className="p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <MarkdownPreview content={content} />
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh]">
        <DialogHeader>
          <DialogTitle>Full Enhancement Prompt</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full pr-4">
          <div className="space-y-6 py-4">
            {renderSection("Original Template", template.content)}
            
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

            {renderSection("Final Enhanced Prompt", enhancedPrompt)}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

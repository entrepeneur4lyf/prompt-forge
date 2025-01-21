import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Template } from '@/lib/types';
import { Card } from '@/components/ui/card';

interface FullPromptModalProps {
  open: boolean;
  onClose: () => void;
  template: Template | null;
  dynamicFields: Array<{ name: string; value: string }>;
  enhancedPrompt: string;
  enableEnhancement: boolean;
}

export function FullPromptModal({ 
  open, 
  onClose, 
  template, 
  dynamicFields,
  enhancedPrompt,
  enableEnhancement 
}: FullPromptModalProps) {
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

            {renderSection(
              enableEnhancement ? "Complete Enhancement Prompt" : "Generated Prompt", 
              constructFinalPrompt()
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
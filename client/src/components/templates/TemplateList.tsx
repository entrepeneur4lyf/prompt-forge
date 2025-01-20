import { Template } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Star, Trash2, Pencil } from 'lucide-react';

interface TemplateListProps {
  templates: Template[];
  selectedTemplate: Template | null;
  onSelect: (template: Template) => void;
  onDelete: (id: number) => void;
  onEdit: (template: Template) => void;
}

export default function TemplateList({
  templates,
  selectedTemplate,
  onSelect,
  onDelete,
  onEdit
}: TemplateListProps) {
  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Templates</h2>
      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`p-3 rounded-lg cursor-pointer border transition-colors ${
                selectedTemplate?.id === template.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => onSelect(template)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {template.isCore && (
                    <Star className="h-4 w-4 text-yellow-500" />
                  )}
                  <span className="font-medium">{template.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(template);
                    }}
                    title="Edit template"
                  >
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(template.id);
                    }}
                    title="Delete template"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
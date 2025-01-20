import { Template, templateDomains, agentTypes, modelTypes } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Star, Trash2, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useMemo } from 'react';

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
  const [selectedDomain, setSelectedDomain] = useState<string>('all');

  const filteredTemplates = useMemo(() => {
    if (selectedDomain === 'all') {
      return templates;
    }
    return templates.filter(template => template.domain === selectedDomain);
  }, [templates, selectedDomain]);

  const getBadgeVariant = (type: 'domain' | 'agent' | 'model', value: string) => {
    if (type === 'domain') {
      const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        'Code': 'default',
        'General': 'secondary',
        'Marketing': 'outline',
        'Education': 'destructive',
        'Creative Writing': 'secondary',
        'Meta': 'outline'
      };
      return variants[value] || 'default';
    } else if (type === 'agent') {
      const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        'Replit': 'outline',
        'Cursor': 'secondary',
        'Claude': 'default',
        'DeepSeek': 'destructive',
        'Browser Agent': 'secondary'
      };
      return variants[value] || 'default';
    } else {
      // Model type variants
      const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        'Claude-Sonnet-3.5': 'default',
        'GPT-4': 'secondary',
        'GPT-4-Turbo': 'outline',
        'Gemini-Pro': 'destructive'
      };
      return variants[value] || 'secondary';
    }
  };

  const handleEditClick = (e: React.MouseEvent, template: Template) => {
    e.stopPropagation();
    if (typeof onEdit === 'function') {
      onEdit(template);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <Card className="p-6">
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-foreground">Templates</h2>
          <Select 
            value={selectedDomain} 
            onValueChange={setSelectedDomain}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {templateDomains.map(domain => (
                <SelectItem key={domain} value={domain}>
                  {domain}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className={`p-4 rounded-lg cursor-pointer border transition-colors ${
                  selectedTemplate?.id === template.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => onSelect(template)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {template.isCore && (
                      <Star className="h-5 w-5 flex-shrink-0 text-yellow-500" />
                    )}
                    <span className="font-semibold text-lg">{template.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleEditClick(e, template)}
                      title="Edit template"
                    >
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteClick(e, template.id)}
                      title="Delete template"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={getBadgeVariant('domain', template.domain)}>
                    {template.domain}
                  </Badge>
                  {template.agentEnhanced && template.agentType && (
                    <Badge variant={getBadgeVariant('agent', template.agentType)}>
                      {template.agentType}
                    </Badge>
                  )}
                  {template.modelType && (
                    <Badge variant={getBadgeVariant('model', template.modelType)}>
                      {template.modelType}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}
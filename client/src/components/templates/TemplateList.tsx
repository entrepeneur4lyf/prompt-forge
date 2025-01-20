import { Template, templateDomains } from '@/lib/types';
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

  const getBadgeVariant = (type: 'domain' | 'agent', value: string) => {
    if (type === 'domain') {
      const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        'Code': 'default',
        'General': 'secondary',
        'Marketing': 'outline',
        'Education': 'destructive',
        'Creative Writing': 'secondary'
      };
      return variants[value] || 'default';
    } else {
      // Agent type badges use a different color scheme
      const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        'Replit': 'outline',
        'Cursor': 'secondary',
        'Claude': 'default',
        'DeepSeek': 'destructive',
        'Browser Agent': 'secondary'
      };
      return variants[value] || 'default';
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Templates</h2>
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

        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {filteredTemplates.map((template) => (
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
                <div className="mt-2 flex gap-2">
                  <Badge variant={getBadgeVariant('domain', template.domain)}>
                    {template.domain}
                  </Badge>
                  {template.agentEnhanced && template.agentType && (
                    <Badge variant={getBadgeVariant('agent', template.agentType)}>
                      {template.agentType}
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
import { Template, templateDomains, providerTypes, modelTypes } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Star, Trash2, Pencil, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useMemo } from 'react';

interface TemplateListProps {
  templates: Template[];
  selectedTemplate: Template | null;
  onSelect: (template: Template) => void;
  onDelete: (id: number) => void;
  onEdit: (template: Template) => void;
  onDuplicate?: (template: Template) => void;
}

export default function TemplateList({
  templates,
  selectedTemplate,
  onSelect,
  onDelete,
  onEdit,
  onDuplicate
}: TemplateListProps) {
  const [selectedDomain, setSelectedDomain] = useState<string>('all');

  const filteredTemplates = useMemo(() => {
    if (selectedDomain === 'all') {
      return templates;
    }
    return templates.filter(template => template.domain === selectedDomain);
  }, [templates, selectedDomain]);

  const getBadgeVariant = (type: 'domain' | 'provider' | 'model', value: string) => {
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
    } else if (type === 'provider') {
      const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        'OpenAI': 'outline',
        'Anthropic': 'secondary',
        'Replit': 'default',
        'Deepseek': 'destructive',
        'Gemini': 'secondary'
      };
      return variants[value] || 'default';
    } else {
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

  const handleDuplicateClick = (e: React.MouseEvent, template: Template) => {
    e.stopPropagation();
    if (onDuplicate) {
      onDuplicate(template);
    }
  };

  return (
    <Card className="p-6" data-testid="template-list-card">
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-foreground">Templates</h2>
          <Select value={selectedDomain} onValueChange={setSelectedDomain}>
            <SelectTrigger className="w-[180px]" data-testid="template-list-filter-domain">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" data-testid="template-list-filter-domain-option-all">
                All Categories
              </SelectItem>
              {templateDomains.map(domain => (
                <SelectItem 
                  key={domain} 
                  value={domain}
                  data-testid={`template-list-filter-domain-option-${domain.toLowerCase()}`}
                >
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
                data-testid={`template-list-item-${template.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {template.isCore && (
                      <Star className="h-5 w-5 flex-shrink-0 text-yellow-500" />
                    )}
                    <span className="font-semibold text-lg">{template.name}</span>
                    {/* Black circular agent badge */}
                    {template.agentEnhanced && template.agentType !== 'None' && (
                      <Badge 
                        variant="default"
                        className="bg-black text-white text-xs rounded-full h-6 px-2 flex items-center justify-center"
                        data-testid={`template-list-badge-agent-${template.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {template.agentType}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDuplicateClick(e, template)}
                      title="Duplicate template"
                      data-testid={`template-list-button-duplicate-${template.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleEditClick(e, template)}
                      title="Edit template"
                      data-testid={`template-list-button-edit-${template.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteClick(e, template.id)}
                      title="Delete template"
                      data-testid={`template-list-button-delete-${template.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant={getBadgeVariant('domain', template.domain)}
                    data-testid={`template-list-badge-domain-${template.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {template.domain}
                  </Badge>
                  <Badge 
                    variant={getBadgeVariant('provider', template.providerType)}
                    data-testid={`template-list-badge-provider-${template.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {template.providerType}
                  </Badge>
                  {template.modelType && (
                    <Badge 
                      variant={getBadgeVariant('model', template.modelType)}
                      data-testid={`template-list-badge-model-${template.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
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
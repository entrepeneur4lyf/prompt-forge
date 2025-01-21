import {
  Template,
  templateDomains,
  providerTypes,
  modelTypes,
} from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, Trash2, Pencil, Copy, GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TemplateListProps {
  templates: Template[];
  selectedTemplate: Template | null;
  onSelect: (template: Template) => void;
  onDelete: (id: number) => void;
  onEdit: (template: Template) => void;
  onDuplicate?: (template: Template) => void;
  onReorder?: (templates: Template[]) => void;
}

interface SortableTemplateItemProps {
  template: Template;
  isSelected: boolean;
  onSelect: (template: Template) => void;
  onEdit: (template: Template) => void;
  onDelete: (id: number) => void;
  onDuplicate?: (template: Template) => void;
}

// Badge variant helper function
const getBadgeVariant = (
  type: "domain" | "provider" | "model",
  value: string,
): "default" | "secondary" | "destructive" | "outline" => {
  if (type === "domain") {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      Code: "default",
      General: "secondary",
      Marketing: "outline",
      Education: "destructive",
      "Creative Writing": "secondary",
      Meta: "outline",
    };
    return variants[value] || "default";
  } else if (type === "provider") {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      OpenAI: "outline",
      Anthropic: "secondary",
      Replit: "default",
      Deepseek: "destructive",
      Gemini: "secondary",
    };
    return variants[value] || "default";
  } else {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      "Claude-Sonnet-3.5": "default",
      "GPT-4": "secondary",
      "GPT-4-Turbo": "outline",
      "Gemini-Pro": "destructive",
    };
    return variants[value] || "secondary";
  }
};

function SortableTemplateItem({
  template,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
}: SortableTemplateItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: template.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(template);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(template.id);
  };

  const handleDuplicateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDuplicate) {
      onDuplicate(template);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 rounded-lg cursor-pointer border transition-colors ${
        isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
      }`}
      onClick={() => onSelect(template)}
      data-testid={`template-list-item-${template.name.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          {template.isCore && (
            <Star className="h-5 w-5 flex-shrink-0 text-yellow-500" />
          )}
          <span className="font-semibold text-lg">{template.name}</span>
          {template.agentEnhanced && template.agentType !== "None" && (
            <Badge
              variant="default"
              className="bg-black text-white text-xs rounded-full h-6 px-2 flex items-center justify-center"
              data-testid={`template-list-badge-agent-${template.name.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {template.agentType}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDuplicateClick}
            title="Duplicate template"
            data-testid={`template-list-button-duplicate-${template.name.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <Copy className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEditClick}
            title="Edit template"
            data-testid={`template-list-button-edit-${template.name.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <Pencil className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteClick}
            title="Delete template"
            data-testid={`template-list-button-delete-${template.name.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={getBadgeVariant("domain", template.domain)}
          data-testid={`template-list-badge-domain-${template.name.toLowerCase().replace(/\s+/g, "-")}`}
        >
          {template.domain}
        </Badge>
        {template.agentEnhanced === true && (
          <Badge
            variant={getBadgeVariant("provider", template.providerType)}
            data-testid={`template-list-badge-provider-${template.name.toLowerCase().replace(/\s+/g, "-")}`}
          >
            Agent
          </Badge>
        )}
        {template.modelType && (
          <Badge
            variant={getBadgeVariant("model", template.modelType)}
            data-testid={`template-list-badge-model-${template.name.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {template.modelType}
          </Badge>
        )}
      </div>
    </div>
  );
}

export default function TemplateList({
  templates,
  selectedTemplate,
  onSelect,
  onDelete,
  onEdit,
  onDuplicate,
  onReorder,
}: TemplateListProps) {
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Sort templates: core templates first, then by order
  const sortedTemplates = useMemo(() => {
    return [...templates].sort((a, b) => {
      if (a.isCore && !b.isCore) return -1;
      if (!a.isCore && b.isCore) return 1;
      return 0;
    });
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    if (selectedDomain === "all") {
      return sortedTemplates;
    }
    return sortedTemplates.filter((template) => template.domain === selectedDomain);
  }, [sortedTemplates, selectedDomain]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = templates.findIndex((t) => t.id === active.id);
      const newIndex = templates.findIndex((t) => t.id === over.id);

      const reorderedTemplates = arrayMove(templates, oldIndex, newIndex);
      if (onReorder) {
        onReorder(reorderedTemplates);
      }
    }
  };

  return (
    <Card className="p-6" data-testid="template-list-card">
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-foreground">Templates</h2>
          <Select value={selectedDomain} onValueChange={setSelectedDomain}>
            <SelectTrigger
              className="w-[180px]"
              data-testid="template-list-filter-domain"
            >
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="all"
                data-testid="template-list-filter-domain-option-all"
              >
                All Categories
              </SelectItem>
              {templateDomains.map((domain) => (
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredTemplates.map(t => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {filteredTemplates.map((template) => (
                  <SortableTemplateItem
                    key={template.id}
                    template={template}
                    isSelected={selectedTemplate?.id === template.id}
                    onSelect={onSelect}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDuplicate={onDuplicate}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </ScrollArea>
      </div>
    </Card>
  );
}
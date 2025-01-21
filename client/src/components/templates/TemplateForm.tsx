import { useForm } from 'react-hook-form';
import { Template, templateDomains, modelTypes, methodologyTypes } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, KeyboardEvent } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { MarkdownPreview } from '@/components/ui/markdown-preview';
import { MarkdownHelp } from './markdown-help';
import { Badge } from '@/components/ui/badge';

interface TemplateFormProps {
  template: Template | null;
  onSubmit: (template: Partial<Template>) => void;
  onCancel: () => void;
}

const templateFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  content: z.string().min(1, "Content is required"),
  isCore: z.boolean(),
  domain: z.enum(templateDomains),
  modelType: z.enum(modelTypes),
  methodologies: z.array(z.enum(methodologyTypes))
});

type FormData = z.infer<typeof templateFormSchema>;

export default function TemplateForm({ template, onSubmit, onCancel }: TemplateFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: template?.name || '',
      content: template?.content || '',
      isCore: template?.isCore || false,
      domain: template?.domain || 'Code',
      modelType: template?.modelType || 'Claude-Sonnet-3.5',
      methodologies: template?.methodologies || []
    },
  });

  const modelType = form.watch('modelType');
  const content = form.watch('content');

  useEffect(() => {
    if (template) {
      form.reset({
        name: template.name,
        content: template.content,
        isCore: template.isCore,
        domain: template.domain,
        modelType: template.modelType,
        methodologies: template.methodologies
      });
    }
  }, [template, form]);

  const handleSubmit = (data: FormData) => {
    onSubmit(data);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const fieldName = (e.target as HTMLTextAreaElement).name;
    if (e.key === 'Enter' && fieldName.toLowerCase().includes('content')) {
      e.preventDefault();
      form.handleSubmit(handleSubmit)();
    }
  };

  const isPromptField = (fieldName: string) => {
    return fieldName.toLowerCase().includes('content');
  };

  return (
    <Card className="p-6" data-testid="template-form-card">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold">
            {template?.id ? 'Edit Template' : 'Create Template'}
          </h2>
          <Badge variant="outline" className="mt-2">
            Model: {modelType}
          </Badge>
        </div>
        <MarkdownHelp />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" data-testid="template-form">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter template name" data-testid="template-form-input-name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <Tabs defaultValue="edit" className="w-full">
                  <TabsList>
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  <TabsContent value="edit">
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter template content with {{placeholders}} and markdown formatting"
                        className={`min-h-[200px] font-mono resize-y ${isPromptField(field.name) ? 'bg-muted/30' : ''}`}
                        data-testid="template-form-textarea-content"
                        onKeyDown={handleKeyPress}
                      />
                    </FormControl>
                  </TabsContent>
                  <TabsContent value="preview" className="rounded-md border p-4">
                    <MarkdownPreview content={content} />
                  </TabsContent>
                </Tabs>
                <FormDescription>
                  Use markdown syntax for formatting. Click the help icon above for formatting guide.
                  {isPromptField(field.name) && (
                    <span className="block mt-1 text-sm text-muted-foreground">
                      Press Enter to submit prompt for enhancement
                    </span>
                  )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="template-form-select-domain">
                        <SelectValue placeholder="Select domain" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {templateDomains.map((domain) => (
                        <SelectItem
                          key={domain}
                          value={domain}
                          data-testid={`template-form-select-domain-option-${domain.toLowerCase()}`}
                        >
                          {domain}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="modelType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="template-form-select-model">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {modelTypes.map((model) => (
                        <SelectItem
                          key={model}
                          value={model}
                          data-testid={`template-form-select-model-option-${model.toLowerCase().replace(/\./g, '-')}`}
                        >
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>


          <FormField
            control={form.control}
            name="methodologies"
            render={() => (
              <FormItem>
                <FormLabel>Methodologies</FormLabel>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {methodologyTypes.map((methodology) => (
                    <FormField
                      key={methodology}
                      control={form.control}
                      name="methodologies"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={methodology}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(methodology)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, methodology])
                                    : field.onChange(
                                      field.value?.filter((value) => value !== methodology)
                                    );
                                }}
                                data-testid={`template-form-checkbox-methodology-${methodology.toLowerCase()}`}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {methodology}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isCore"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    data-testid="template-form-checkbox-is-core"
                  />
                </FormControl>
                <FormLabel className="!mt-0">Core Template</FormLabel>
                <FormDescription>
                  Mark this as a frequently used template
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              data-testid="template-form-button-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-testid="template-form-button-submit"
            >
              {template?.id ? 'Update Template' : 'Create Template'}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
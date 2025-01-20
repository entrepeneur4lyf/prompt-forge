import { useForm } from 'react-hook-form';
import { Template, CreateTemplateInput, templateDomains, agentTypes, modelTypes, roleTypes, methodologyTypes } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface TemplateFormProps {
  template: Template | null;
  onSubmit: (template: CreateTemplateInput & { id?: number }) => void;
  onCancel: () => void;
}

const templateFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  content: z.string().min(1, "Content is required"),
  isCore: z.boolean(),
  domain: z.enum(templateDomains),
  agentEnhanced: z.boolean(),
  agentType: z.enum(agentTypes).nullable(),
  modelType: z.enum(modelTypes),
  roleType: z.enum([...roleTypes, 'None'] as const),
  methodologies: z.array(z.enum(methodologyTypes))
}).refine((data) => {
  if (data.agentEnhanced && !data.agentType) {
    return false;
  }
  return true;
}, {
  message: "Agent type must be selected when agent enhancement is enabled",
  path: ["agentType"]
});

type FormData = z.infer<typeof templateFormSchema>;

export default function TemplateForm({ template, onSubmit, onCancel }: TemplateFormProps) {
  console.log('Template Form received template:', template); // Debug log

  const form = useForm<FormData>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: template?.name || '',
      content: template?.content || '',
      isCore: template?.isCore || false,
      domain: template?.domain || 'Code',
      agentEnhanced: template?.agentEnhanced || false,
      agentType: template?.agentType || null,
      modelType: template?.modelType || 'Claude-Sonnet-3.5',
      roleType: template?.roleType || 'None',
      methodologies: template?.methodologies || [],
    },
  });

  // Update form when template changes
  useEffect(() => {
    if (template) {
      console.log('Resetting form with template:', template); // Debug log
      form.reset({
        name: template.name,
        content: template.content,
        isCore: template.isCore,
        domain: template.domain,
        agentEnhanced: template.agentEnhanced,
        agentType: template.agentType,
        modelType: template.modelType,
        roleType: template.roleType,
        methodologies: template.methodologies,
      });
    }
  }, [template, form]);

  const agentEnhanced = form.watch('agentEnhanced');

  const handleSubmit = (data: FormData) => {
    console.log('Form submitting data:', data); // Debug log
    onSubmit(template?.id ? { ...data, id: template.id } : data);
  };

  return (
    <Card className="p-4 mt-4">
      <h2 className="text-xl font-semibold mb-4">
        {template?.id ? 'Edit Template' : 'Create Template'}
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter template name" />
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
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter template content with {{placeholders}}"
                    className="min-h-[100px]"
                  />
                </FormControl>
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
                      <SelectTrigger>
                        <SelectValue placeholder="Select domain" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {templateDomains.map((domain) => (
                        <SelectItem key={domain} value={domain}>
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
              name="agentEnhanced"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Agent Enhancement
                    </FormLabel>
                    <FormDescription>
                      Enable agent-specific prompt enhancement
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {agentEnhanced && (
              <FormField
                control={form.control}
                name="agentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select agent type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {agentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="modelType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {modelTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
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
              name="roleType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 gap-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="None" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          None
                        </FormLabel>
                      </FormItem>
                      {roleTypes.map((role) => (
                        <FormItem key={role} className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={role} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {role}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
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
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {template?.id ? 'Update Template' : 'Create Template'}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
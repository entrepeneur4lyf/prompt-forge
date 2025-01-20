import { useForm } from 'react-hook-form';
import { Template, templateDomains, modelTypes, roleTypes, methodologyTypes, providerTypes } from '@/lib/types';
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
  providerType: z.enum(providerTypes),
  modelType: z.enum(modelTypes),
  roleType: z.enum(roleTypes),
  methodologies: z.array(z.enum(methodologyTypes)),
  agentEnhanced: z.boolean().optional(),
  agentType: z.enum(['None', 'Architect', 'Developer', 'Tester']).optional()
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
      providerType: template?.providerType || 'Anthropic',
      modelType: template?.modelType || 'Claude-Sonnet-3.5',
      roleType: template?.roleType || 'None',
      methodologies: template?.methodologies || [],
      agentEnhanced: template?.agentEnhanced || false,
      agentType: template?.agentType || 'None'
    },
  });

  const domain = form.watch('domain');
  const agentEnhanced = form.watch('agentEnhanced');

  useEffect(() => {
    if (template) {
      form.reset({
        name: template.name,
        content: template.content,
        isCore: template.isCore,
        domain: template.domain,
        providerType: template.providerType,
        modelType: template.modelType,
        roleType: template.roleType,
        methodologies: template.methodologies,
        agentEnhanced: template.agentEnhanced,
        agentType: template.agentType
      });
    }
  }, [template, form]);

  const handleSubmit = (data: FormData) => {
    onSubmit(data);
  };

  return (
    <Card className="p-6" data-testid="template-form-card">
      <h2 className="text-xl font-bold mb-6">
        {template?.id ? 'Edit Template' : 'Create Template'}
      </h2>

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
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter template content with {{placeholders}}"
                    className="min-h-[100px]"
                    data-testid="template-form-textarea-content"
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

            {/* Agent Enhancement Fields - Only show when domain is Meta */}
            {domain === 'Meta' && (
              <>
                <FormField
                  control={form.control}
                  name="agentEnhanced"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="template-form-checkbox-agent-enhanced"
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Agent Enhanced</FormLabel>
                      <FormDescription>
                        Enable agent-specific instructions
                      </FormDescription>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="template-form-select-agent-type">
                              <SelectValue placeholder="Select agent type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {['None', 'Architect', 'Developer', 'Tester'].map((type) => (
                              <SelectItem 
                                key={type} 
                                value={type}
                                data-testid={`template-form-select-agent-type-option-${type.toLowerCase()}`}
                              >
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
              </>
            )}

            <FormField
              control={form.control}
              name="providerType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="template-form-select-provider">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {providerTypes.map((provider) => (
                        <SelectItem 
                          key={provider} 
                          value={provider}
                          data-testid={`template-form-select-provider-option-${provider.toLowerCase()}`}
                        >
                          {provider}
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

            <FormField
              control={form.control}
              name="roleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="template-form-select-role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roleTypes.map((role) => (
                        <SelectItem 
                          key={role} 
                          value={role}
                          data-testid={`template-form-select-role-option-${role.toLowerCase()}`}
                        >
                          {role}
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
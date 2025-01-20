import { useForm } from 'react-hook-form';
import { Template, CreateTemplateInput, templateDomains, modelTypes, roleTypes, methodologyTypes, providerTypes, ModelType, ProviderType } from '@/lib/types';
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
  providerType: z.enum(providerTypes),
  modelType: z.enum(modelTypes),
  roleType: z.enum(roleTypes),
  methodologies: z.array(z.enum(methodologyTypes))
});

type FormData = z.infer<typeof templateFormSchema>;

// Get available models for a specific provider
const getModelsForProvider = (provider: ProviderType): ModelType[] => {
  switch (provider) {
    case 'OpenAI':
      return ['GPT-3.5-Turbo', 'GPT-4', 'GPT-4-Turbo'];
    case 'Anthropic':
      return ['Claude-Sonnet-3.5', 'Claude-Sonnet', 'Claude-Haiku', 'Claude-Opus'];
    case 'Replit':
      return ['Replit-Code', 'Replit-Chat'];
    case 'Deepseek':
      return ['Deepseek-Coder'];
    case 'Gemini':
      return ['Gemini-Pro'];
    default:
      return [];
  }
};

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
    },
  });

  const selectedProvider = form.watch('providerType') as ProviderType;
  const availableModels = getModelsForProvider(selectedProvider);

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
      });
    }
  }, [template, form]);

  useEffect(() => {
    const currentModel = form.getValues('modelType');
    if (!availableModels.includes(currentModel)) {
      form.setValue('modelType', availableModels[0]);
    }
  }, [selectedProvider, availableModels, form]);

  const handleSubmit = (data: FormData) => {
    onSubmit(template?.id ? { ...data, id: template.id } : data);
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-6">
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
              name="providerType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {providerTypes.map((provider) => (
                        <SelectItem key={provider} value={provider}>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!selectedProvider}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableModels.map((model) => (
                        <SelectItem key={model} value={model}>
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
                <FormItem className="space-y-3">
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 gap-4"
                    >
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
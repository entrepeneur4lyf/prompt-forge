import { useForm } from 'react-hook-form';
import { Template, CreateTemplateInput } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface TemplateFormProps {
  template: Template | null;
  onSubmit: (template: CreateTemplateInput & { id?: number }) => void;
}

export default function TemplateForm({ template, onSubmit }: TemplateFormProps) {
  const form = useForm<CreateTemplateInput>({
    defaultValues: {
      name: template?.name || '',
      content: template?.content || '',
      isCore: template?.isCore || false,
    },
  });

  return (
    <Card className="p-4 mt-4">
      <h2 className="text-xl font-semibold mb-4">
        {template ? 'Edit Template' : 'Create Template'}
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => onSubmit({ ...data, id: template?.id }))}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter template name" />
                  </FormControl>
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
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {template ? 'Update Template' : 'Create Template'}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}

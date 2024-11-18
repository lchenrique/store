import {
  useForm as useReactHookForm,
  UseFormProps,
  FieldValues,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export function useForm<T extends FieldValues>(
  schema: z.ZodType<T>,
  options?: Omit<UseFormProps<T>, 'resolver'>
) {
  return useReactHookForm<T>({
    ...options,
    resolver: zodResolver(schema),
  });
}
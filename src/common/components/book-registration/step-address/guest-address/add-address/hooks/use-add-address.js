import { useState } from 'react';
import { isEmpty } from '@/common/services/misc/common';

export const useAddAddress = <Values>(
  validationSchema: any,
  initialValues: Values,
  onSubmit: (data: Values) => any,
) => {
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<Values>(initialValues);
  const [errors, setErrors] = useState<{ [P in keyof Values]?: string }>({});

  const handleChange = ({ target: { value, name } }: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName = name as keyof Values;

    if (!isEmpty(errors[fieldName])) {
      setErrors((errors) => ({ ...errors, [fieldName]: '' }));
    }

    setData((data) => ({ ...data, [fieldName]: value }));
  };

  const onFieldBlur = ({ target: { name } }: React.FocusEvent<HTMLInputElement>) => {
    const fieldName = name as keyof Values;
    validationSchema
      .validateAt(fieldName, data)
      .then(() => {
        if (!isEmpty(errors[fieldName])) {
          setErrors((errors) => ({ ...errors, [fieldName]: '' }));
        }
      })
      .catch(({ message }: any) => {
        setErrors((errors) => ({ ...errors, [fieldName]: message }));
      });
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): Promise<void | Promise<any>> => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await validationSchema.validate(data, { abortEarly: false });
      setSaving(true);
      try {
        await onSubmit({ ...data });
        setSaving(false);
      } catch (err) {
        setSaving(false);
      }
    } catch (err: any) {
      type Error = { path: keyof Values; message: string };
      const mapErrors: Error[] = err.inner.map(({ path, message }: Error) => ({
        path,
        message,
      }));

      setErrors((errors) => {
        const newErrors = { ...errors };
        mapErrors.forEach((e) => {
          newErrors[e.path] = e.message;
        });

        return newErrors;
      });
    }
  };

  return {
    data,
    saving,
    errors,
    handleChange,
    onFieldBlur,
    handleSubmit,
    setData,
  };
};

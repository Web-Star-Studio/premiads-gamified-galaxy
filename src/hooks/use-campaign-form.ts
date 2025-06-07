import { useState, useCallback } from 'react';

interface FormData {
  title: string;
  description: string;
  category: string;
  points: number;
  cashbackValue: number;
  minPurchase: number;
  maxParticipants: number;
  startDate: Date;
  endDate: Date;
  imageUrl: string;
  isActive: boolean;
}

export const useCampaignForm = (initialData?: Partial<FormData>) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    points: 10,
    cashbackValue: 5,
    minPurchase: 50,
    maxParticipants: 100,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    imageUrl: '',
    isActive: true,
    ...initialData
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback((field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.title) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const submitForm = useCallback(async () => {
    if (!validateForm()) {
      return false;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);

    return true;
  }, [validateForm]);

  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      description: '',
      category: '',
      points: 10,
      cashbackValue: 5,
      minPurchase: 50,
      maxParticipants: 100,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      imageUrl: '',
      isActive: true
    });
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    validateForm,
    submitForm,
    resetForm
  };
};

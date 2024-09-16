"use client";

import { GetFormContentByUrl } from '@/action/form';
import { FormElementInstance } from '@/components/FormElements';
import FormSubmitComponent from '@/components/FormSubmitComponent';
import React, { useState, useEffect } from 'react';

interface FormType {
  content: string;
  id?: string; // Make id optional
}

function SubmitPage({
  params,
}:{
  params:{
    formUrl:string;
  };
}) {
  const [form, setForm] = useState<FormType | null>(null);

  useEffect(() => {
    async function fetchForm() {
      const fetchedForm = await GetFormContentByUrl(params.formUrl);
      setForm(fetchedForm as FormType); // Type assertion
    }

    fetchForm();
  }, [params.formUrl]);

  if (!form || !form.content) {
    console.log("Form or form content is missing:", form);
    return <div>Loading...</div>;
  }

  let formContent;
  let elements;
  let layoutType: "single" | "multi" = 'single'; // Explicitly type layoutType
  console.log("1___layoutType",layoutType);
  

  try {
    formContent = JSON.parse(form.content);
    console.log("Parsed form content:", formContent);

    if (Array.isArray(formContent)) {
      elements = formContent;
    } else if (typeof formContent === 'object' && formContent !== null) {
      elements = formContent.elements || [];
      layoutType = (formContent.layoutType === 'multi' ? 'multi' : 'single') as "single" | "multi";
      console.log("2__layoutType",layoutType);
      
    } else {
      throw new Error('Invalid form content structure');
    }

    if (!Array.isArray(elements) || elements.length === 0) {
      throw new Error('No form elements found');
    }

  } catch (error) {
    console.error("Error processing form content:", error);
    return <div>Error processing form data</div>;
  }

  return (
    <FormSubmitComponent 
      formUrl={params.formUrl} 
      content={elements}
      layoutType={layoutType} 
      formId={form.id || ''}
      selectedPosition=""
    />
  );
}

export default SubmitPage;
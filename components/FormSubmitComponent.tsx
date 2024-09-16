"use client";

import React, { useCallback, useRef, useState, useTransition, useEffect } from 'react';
import { FormElementInstance, FormElements } from './FormElements';
import { Button } from './ui/button';
import { HiCursorClick } from 'react-icons/hi';
import { toast } from './ui/use-toast';
// import { getTime } from 'date-fns';
import { ImSpinner2 } from 'react-icons/im';
import { SubmitForm } from '@/action/form';
// import Image from 'next/image';


  function FormSubmitComponent({
    formUrl,
    formId, 
    content,
    // selectedPosition,
    layoutType 
}:{
    content:FormElementInstance[];
    formUrl:string;
    formId: string; // Add this type definition
    selectedPosition: string;
    layoutType: "single" | "multi"; // Add this type definition
}) {

    const formValues = useRef<{ [key:string] :string }>({});
    const formErrors = useRef<{[key:string]:boolean}>({});
    const [renderKey, setRenderKey] = useState(new Date().getTime());

    const [submitted, setSubmitted] = useState(false);
    const [pending, startTransition] = useTransition();
    const [profileText, setProfileText] = useState('');
    const [footerContent, setFooterContent] = useState(localStorage.getItem('footerContent') || '');
    const [profileImage, setProfileImage] = useState('');

    // console.log('layoutType %%%',layoutType)

  useEffect(() => {
    setProfileText(localStorage.getItem('text') || '');
    setProfileImage(localStorage.getItem('image') || '');
    const storedFooterContent = localStorage.getItem('footerContent');
        if (storedFooterContent) {
        setFooterContent(storedFooterContent);
        }
        
    // Check if the form has been submitted when the component mounts
    const formSubmitted = localStorage.getItem(`formSubmitted-${formUrl}`);
    if (formSubmitted === 'true') {
      setSubmitted(true);
    }
    
}, [formUrl]);

    const validateForm:()=> boolean = useCallback(()=>{
        for (const field of content){
            const actualValue = formValues.current[field.id] || "";
            const valid = FormElements[field.type].validate(field, actualValue);

            if(!valid){
                formErrors.current[field.id] = true;
            }
        }

        if(Object.keys(formErrors.current).length>0){
            return false;
        }

        return true;
    }, [content]);


    const submitValue = useCallback((key:string, value:string)=>{
        formValues.current[key]=value;
    },[]);
    const submitForm = async () =>{
        formErrors.current = {};
        const validForm = validateForm();
        if(!validForm){
            setRenderKey(new Date().getTime());
            toast({
                title:"Error",
                description:"Please check form again",
                variant:"destructive",
            });
            return;
        }

        try {
            const jsonContent = JSON.stringify(formValues.current);
            const response = await SubmitForm(formUrl, jsonContent);
            setSubmitted(true);
            localStorage.setItem(`formSubmitted-${formUrl}`, 'true');

            // Map form values to their labels
            const formValuesWithLabels = Object.fromEntries(
                Object.entries(formValues.current).map(([key, value]) => {
                    const field = content.find(f => f.id === key);
                    const label = field?.label || field?.extraAttributes?.label || `Field ${key}`;
                    return [label, value];
                })
            );

            
            // Combine the Form ID and values into a single object
            const fullResponse = {
                formId: formId,
                values: formValuesWithLabels
            };
            // console.log("Full Response:", fullResponse);

        } catch (error) {
            toast({
                title:"Error",
                description:"Something went wrong",
                variant:"destructive",
            });
        }

    };


    if(submitted){
        return (
        
        <div className='relative w-full h-full p-8'>
  <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[620px] flex flex-col gap-4 flex-grow bg-background 
  w-full p-8 overflow-y-auto border shadow-xl shadow-blue-700 rounded'>
    <h1 className='text-2xl font-bold '> Form Submitted </h1>
    <p className='text-muted-foreground'>Thank You for submitting the form. Now you can close this window.</p>
  </div>
</div>
);
}
  return (
    <div className='flex justify-center w-full h-full items-center p-8'>
      <div key={renderKey} className={`max-w-[620px] flex flex-col gap-4 flex-grow bg-background 
      w-full p-3 overflow-y-auto border shadow-xl shadow-blue-700 rounded pt-0 ${
        layoutType === "multi" ? "grid grid-cols-2 gap-4" : ""
      }`}>
        {/* <div className="pt-3">
        <div className={`flex flex-row ${selectedPosition === 'left' ? 'justify-start' : selectedPosition === 'center' ? 'justify-center' : 'justify-end'}`}>
            {profileImage && 
            <div style={{ maxWidth: '30%' }}>
            <Image src={profileImage}  alt="Profile" layout="responsive" width={2} height={2} />
            </div>
            }       
        </div>
        </div> */}
        {
            Array.isArray(content) ? (
                content.map((element)=>{
                    const FormElement = FormElements[element.type].formComponent;

                    return( 
                    <FormElement 
                        key={element.id} 
                        elementInstance={element}
                        submitValue={submitValue}
                        isInvalid={formErrors.current[element.id]}
                        defaultValue={formValues.current[element.id]}
                     />
                     );
                })
            ) : (
                <div>No form elements to display</div>
            )
        }
        <div className="w-full flex justify-center items-end">
                <p>{footerContent}</p>
            </div>
        <Button className='mt-8 '
        onClick={()=>{
           startTransition( submitForm);
        }} disabled={pending}
        >
            {!pending && (
                <>
                    <HiCursorClick className='mr-3' /> Submit
                </>
            )}
            {pending && <ImSpinner2 className='animate-spin'/>}
        </Button>
      </div>
    </div>
  );
}

export default FormSubmitComponent;
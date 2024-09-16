import React, { useEffect, useState, useMemo } from 'react';
import { Button } from './ui/button';
import { MdPreview } from "react-icons/md";
import useDesigner from './hooks/useDesigner';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { FormElements } from './FormElements';
import Image from 'next/image';

interface PreviewDialogBtnProps {
  selectedPosition: string;
  layoutType: 'single' | 'multi';
}

function PreviewDialogBtn({ selectedPosition, layoutType }: PreviewDialogBtnProps) {
  // console.log('*** layoutType ***', layoutType);
  
  const { elements } = useDesigner();
  const [profileText, setProfileText] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [footerContent, setFooterContent] = useState(localStorage.getItem('footerContent') || '');

  useEffect(() => {
    setProfileText(localStorage.getItem('text') || '');
    setProfileImage(localStorage.getItem('image') || '');
    const storedFooterContent = localStorage.getItem('footerContent');
    if (storedFooterContent) {
      setFooterContent(storedFooterContent);
    }
  }, []);

  const renderElements = useMemo(() => {
    if (layoutType === 'single') {
      return elements.map(element => {
        const FormComponent = FormElements[element.type].formComponent;
        return <FormComponent key={element.id} elementInstance={element} />;
      });
    } else {
      return chunk(elements, 2).map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2 w-full">
          {row.map(element => {
            const FormComponent = FormElements[element.type].formComponent;
            return <FormComponent key={element.id} elementInstance={element} />;
          })}
        </div>
      ));
    }
  }, [elements, layoutType]); // Memoize renderElements based on elements and layoutType

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} className='gap-2'>
          <MdPreview className='h-6 w-6' />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className='w-screen h-screen max-h-screen max-w-full flex flex-col flex-grow p-0 gap-0'>
        <div className="px-4 py-2 border-b">
          <p className="text-lg font-bold text-muted-foreground">Form Preview</p>
        </div>
        <div className="bg-accent flex flex-col flex-grow items-center justify-center p-4 bg-[url(/paper.svg)] dark:bg-[url(/paper-dark.svg)] overflow-y-auto">
          <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background h-full w-full rounded-2xl p-8 overflow-y-auto pt-3">
            <div className={`flex ${selectedPosition === 'left' ? 'justify-start' : selectedPosition === 'center' ? 'justify-center' : 'justify-end'}`}>
              {profileImage && 
                <div style={{ maxWidth: '30%' }}>
                  <Image src={profileImage} alt="Profile" layout="responsive" width={2} height={2} />
                </div>
              }
            </div>
            
            {renderElements}

            <div className="w-full flex justify-center items-end">
              <p>{footerContent}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to chunk array into groups of n
function chunk<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (v, i) =>
    array.slice(i * size, i * size + size)
  );
}

export default PreviewDialogBtn;
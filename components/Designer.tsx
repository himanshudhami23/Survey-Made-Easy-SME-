"use client";
import React, { useState, useEffect, useTransition, useRef } from 'react';
import DesignerSidebar from './DesignerSidebar';
import { DragEndEvent, useDndMonitor, useDraggable, useDroppable } from "@dnd-kit/core";
import { cn } from '@/lib/utils';
import useDesigner from './hooks/useDesigner';
import { ElementsType, FormElementInstance, FormElements } from './FormElements';
import { idGenerator } from '@/lib/idGenerator';
import { Button } from './ui/button';
import { BiSolidTrash } from 'react-icons/bi';
import Image from 'next/image';
import { UpdateFormContent } from '@/action/form';
import { toast } from './ui/use-toast';

interface DesignerProps {
  setPosition: React.Dispatch<React.SetStateAction<string>>;
  formId: number;
  layoutType: "single" | "multi";
  setLayoutType: React.Dispatch<React.SetStateAction<"single" | "multi">>;
}

const positions = ['left', 'center', 'right'];

function Designer({ setPosition, formId, layoutType, setLayoutType }: DesignerProps) {
  const { elements, addElement, selectedElement, setSelectedElement, removeElement } = useDesigner();
  const [loading, startTransition] = useTransition();
  const droppable = useDroppable({
    id: "designer-drop-area",
    data: {
      isDesignerDropArea: true,
    },
  });

  const [profileText, setProfileText] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [footerContent, setFooterContent] = useState(localStorage.getItem('footerContent') || '');
  const [selectedPosition, setSelectedPosition] = useState('left');

  useEffect(() => {
    setProfileText(localStorage.getItem('text') || '');
    setProfileImage(localStorage.getItem('image') || '');
    const storedFooterContent = localStorage.getItem('footerContent');
    if (storedFooterContent) {
      setFooterContent(storedFooterContent);
    }
    // Get all EmailFields from the elements array
    const emailFields = elements.filter(el => el.type === "EmailField");

    // If an EmailField does not exist, add one
    if (emailFields.length === 0) {
      const emailField = FormElements["EmailField"].construct(idGenerator());
      addElement(elements.length, emailField);
      // saveForm();
    }

    // If more than one EmailField exists, remove the extras
    else if (emailFields.length > 1) {
      // Keep the first EmailField and remove the rest
      emailFields.slice(1).forEach(extraEmailField => {
        removeElement(extraEmailField.id);
        // saveForm();
      });
    }
  }, [elements, addElement, removeElement]);

  useEffect(() => {
    const savedLayoutType = localStorage.getItem(`form_${formId}_layout`) as "single" | "multi" | null;
    if (savedLayoutType) {
      setLayoutType(savedLayoutType);
    }
  }, [formId, setLayoutType]);

  // const saveForm = async () => {
  //   try {
  //     const jsonElements = JSON.stringify({
  //       elements: elements,
  //       layoutType: layoutType
  //     });
  //     await UpdateFormContent(formId, jsonElements);
  //     toast({
  //       title: "Success",
  //       description: "Your form has been saved",
  //     });
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Something went wrong while saving",
  //       variant: "destructive",
  //     });
  //   }
  // };

  const handleLayoutChange = (newLayout: "single" | "multi") => {
    setLayoutType(newLayout);
    localStorage.setItem(`form_${formId}_layout`, newLayout);
  };

  useDndMonitor({
    onDragEnd: (event: DragEndEvent) => {
      const { active, over } = event;
      if (!active || !over) return;

      console.log("Drag ended:", { active, over });

      const isDesignerBtnElement = active.data?.current?.isDesignerBtnElement;
      const isDroppingOverDesignerDropArea = over.data?.current?.isDesignerDropArea;

      // First scenario: dropping a sidebar btn element over the designer drop area
      const droppingSidebarBtnOverDesignerDropArea = isDesignerBtnElement && isDroppingOverDesignerDropArea;
      if (droppingSidebarBtnOverDesignerDropArea) {
        const type = active.data?.current?.type;
        const newElement = FormElements[type as ElementsType].construct(idGenerator());
        addElement(elements.length, newElement);
        console.log("Added new element to drop area:", newElement);

        // Save the form after adding the new element
        // startTransition(() => {
        //   setTimeout(async () => {
        //     console.log("Saving form after adding element...");
        //     await saveForm();
        //     console.log("Elements after saving:", elements);
        //   }, 0);
        // });
      }

      const isDroppingOverDesignerElementTopHalf = over.data?.current?.isTopHalfDesignerElement;
      const isDroppingOverDesignerElementBottomHalf = over.data?.current?.isBottomHalfDesignerElement;
      const isDroppingOverDesignerElement = isDroppingOverDesignerElementTopHalf || isDroppingOverDesignerElementBottomHalf;
      const droppingSidebarBtnOverDesignerElement = isDesignerBtnElement && isDroppingOverDesignerElement;

      // Second Scenario: dropping sidebar btn over designer element
      if (droppingSidebarBtnOverDesignerElement) {
        const type = active.data?.current?.type;
        const newElement = FormElements[type as ElementsType].construct(idGenerator());
        const overId = over.data?.current?.elementId;
        const overElementIndex = elements.findIndex((el) => el.id === overId);
        if (overElementIndex === -1) {
          throw new Error("Element not found");
        }
        let indexForNewElement = overElementIndex;
        if (isDroppingOverDesignerElementBottomHalf) {
          indexForNewElement = overElementIndex + 1;
        }
        addElement(indexForNewElement, newElement);
        console.log("Added new element over existing element:", newElement);

        // Save the form after adding the new element
        // startTransition(() => {
        //   setTimeout(async () => {
        //     console.log("Saving form after adding element...");
        //     await saveForm();
        //     console.log("Elements after saving:", elements);
        //   }, 0);
        // });
      }

      // Third scenario: dragging designer element over another designer element
      const isDraggingDesignerElement = active.data?.current?.isDesignerElement;
      const draggingDesignerElementOverAnotherDesignerElement = isDroppingOverDesignerElement && isDraggingDesignerElement;
      if (draggingDesignerElementOverAnotherDesignerElement) {
        const activeId = active.data?.current?.elementId;
        const overId = over.data?.current?.elementId;
        const activeElementIndex = elements.findIndex((el) => el.id === activeId);
        const overElementIndex = elements.findIndex((el) => el.id === overId);
        if (activeElementIndex === -1 || overElementIndex === -1) {
          throw new Error("Element not found");
        }
        const activeElement = { ...elements[activeElementIndex] };
        removeElement(activeId);
        let indexForNewElement = overElementIndex;
        if (isDroppingOverDesignerElementBottomHalf) {
          indexForNewElement = overElementIndex + 1;
        }
        addElement(indexForNewElement, activeElement);
        console.log("Moved element:", activeElement);

        // Save the form after moving the element
        // startTransition(() => {
        //   setTimeout(async () => {
        //     console.log("Saving form after moving element...");
        //     await saveForm();
        //     console.log("Elements after saving:", elements);
        //   }, 0);
        // });
      }
    },
  });

  const saveFormBtnRef = useRef(null);

  const handleSaveFormBtnClick = () => {
    if (saveFormBtnRef.current) {
      (saveFormBtnRef.current as HTMLElement).click();
    }
  };

  const renderElements = () => {
    if (layoutType === 'single') {
      return elements.map((element) => (
        <DesignerElementWrapper key={element.id} element={element} />
      ));
    } else {
      return chunk(elements, 2).map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2 w-full">
          {row.map((element) => (
            <DesignerElementWrapper key={element.id} element={element} />
          ))}
        </div>
      ));
    }
  };

  return (
    <div className='flex w-full h-full'>
      <div className="p-4 w-full" 
        onClick={() => {
          if (selectedElement) setSelectedElement(null);
        }}>
        <div className="mb-4">
          <label className="mr-2">Layout:</label>
          <select 
            value={layoutType} 
            onChange={(e) => handleLayoutChange(e.target.value as "single" | "multi")}
            className="border rounded p-1"
          >
            <option value="single">Single Column</option>
            <option value="multi">Multi Column</option>
          </select>
        </div>
        <div 
          ref={droppable.setNodeRef}
          className={cn(
            "bg-background max-w-[920px] h-full m-auto rounded-xl flex flex-col flex-grow items-start justify-start flex-1 overflow-y-auto",
            droppable.isOver && "ring-4 ring-primary ring-inset"
          )}
        >
          <div className="grid grid-cols-3">
            {positions.map((position, index) => (
              <div key={index} className={`col-span-1 pt-[23px] ml-10 mr-10 text-${position}`}
                onClick={() => {
                  setSelectedPosition(position);
                  setPosition(position);
                  console.log('position', position);
                }}>
                {profileImage && position === selectedPosition && 
                  <div className="min-w-[50px] min-h-[50px]">
                    <Image src={profileImage} alt="Profile" layout="responsive" width={1} height={1} />
                  </div>
                }
              </div>
            ))}
          </div>

          {!droppable.isOver && elements.length === 0 && (
            <div className='text-3xl text-muted-foreground flex flex-grow items-center font-bold pl-[333px]'>
              <p>Drop Here</p>
            </div>
          )}

          {droppable.isOver && elements.length === 0 && (
            <div className="p-4 w-full">
              <div className="h-[120px] rounded-md bg-primary/20"></div>
            </div>
          )}

          {elements.length > 0 && (
            <div className={`flex flex-col w-full gap-2 p-4 ${layoutType === 'multi' ? 'flex-wrap' : ''}`}>
              {renderElements()}
            </div>
          )}

          <div className="w-full flex justify-center items-end ">
            <p>{footerContent}</p>
          </div>
        </div>
      </div>
      <DesignerSidebar />
    </div>
  );
}

function DesignerElementWrapper({ element }: { element: FormElementInstance }) {
  const { removeElement, selectedElement, setSelectedElement } = useDesigner();
  const [mouseIsOver, setMouseIsOver] = useState<boolean>(false);

  const topHalf = useDroppable({
    id: element.id + "-top",
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: true,
    },
  });

  const bottomHalf = useDroppable({
    id: element.id + "-bottom",
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalfDesignerElement: true,
    },
  });

  const draggable = useDraggable({
    id: element.id + "-drag-handler",
    data: {
      type: element.type,
      elementId: element.id,
      isDesignerElement: true,
    },
  });

  if (draggable.isDragging) return null;

  const DesignerElement = FormElements[element.type].designerComponent;

  return (
    <div 
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      className="relative h-[120px] flex-1 flex flex-col text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset"
      style={{ minWidth: '200px' }} // Ensure a minimum width for multi-column layout
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedElement(element);
      }}
    >
      <div ref={topHalf.setNodeRef} className="absolute w-full h-1/2 rounded-t-md" />
      <div ref={bottomHalf.setNodeRef} className="absolute w-full bottom-0 h-1/2 rounded-b-md" />

      <div 
        className={cn(
          "flex w-full h-[120px] items-center rounded-md bg-accent/40 px-4 py-4 pointer-events-none opacity-100",
          mouseIsOver && "opacity-30"
        )}
      >
        <DesignerElement elementInstance={element} />
      </div>

      {element.type !== "EmailField" && (
        <div className="absolute top-0 right-0 p-2 cursor-pointer text-red-500" onClick={() => removeElement(element.id)}>
          <BiSolidTrash className="h-6 w-6" />
        </div>
      )}
    </div>
  );
}

// Helper function to chunk array into groups of n
function chunk<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (v, i) =>
    array.slice(i * size, i * size + size)
  );
}

export default Designer;
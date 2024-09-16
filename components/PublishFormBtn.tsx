import React, { startTransition, useTransition } from 'react';
import { Button } from './ui/button';
import { MdOutlinePublish } from 'react-icons/md';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import Loading from '@/app/(dashboard)/builder/[id]/loading';
import { FaIcons, FaSpinner } from 'react-icons/fa';
import { toast } from './ui/use-toast';
import { PublishForm } from '@/action/form';
import { useRouter } from 'next/navigation';
import { getSalesforceRecordByFormId, updateSalesforceRecord } from '../app/util/salesforceApi';


function PublishFormBtn({ id }: { id: number }) {

  const [loading, startTransition] = useTransition();
  const router = useRouter();

  async function publishForm() {
    try {
      const publishedForm = await PublishForm(id);
      console.log('Publish Id: ', id);

      // Fetch Salesforce record using form ID
      const salesforceRecord = await getSalesforceRecordByFormId('SME_Form__c', id);

      if (salesforceRecord) {
        const shareLink = `${window.location.origin}/submit/${publishedForm.shareURL}`;
        
        // Parse the JSON content
        const formElements = JSON.parse(publishedForm.content);
        
        // Extract only type and label
        const simplifiedContent = formElements.map((element: { type: string; extraAttributes: { label: string } }) => ({
          type: element.type,
          label: element.extraAttributes.label
        }));

        console.log('simplifiedContent: ', simplifiedContent);

        
        // Convert back to JSON string
        const jsonContent = JSON.stringify(simplifiedContent);
        console.log('!!!jsonContent: ', jsonContent);
        
        await updateSalesforceRecord('SME_Form__c', salesforceRecord.Id, {
          Form_URL__c: shareLink,
          Form_Response_Json__c: jsonContent,
        });
        console.log('Salesforce record updated with form link and simplified content');
      } else {
        console.log('No matching Salesforce record found for this form ID');
      }

      toast({
        title: "Success",
        description: "Your form is now available publicly.",
      });
      router.refresh();
    } catch (error) {
      console.error('Error publishing form:', error);
      toast({
        title: "Error",
        description: "Something went wrong while publishing the form.",
      });
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
      <Button className='gap-2 text-white bg-gradient-to-r from-indigo-400
    to-cyan-400'>
      <MdOutlinePublish className='w-4 h-4' />
      Publish</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure ?</AlertDialogTitle>
          <AlertDialogDescription>This action can not be undo. After publishing you will be not able to edit this form. <br /><br /> 
            {/* <span className="font-medium">
              By publishing this form you will make it public and you will be able to collect submission.
            </span> */}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
            disabled={loading}
            onClick={(el)=>{
              el.preventDefault();
              startTransition(publishForm);
            }}
            >Proceed {loading && <FaSpinner className='animate-spin'/> } </AlertDialogAction>
          </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default PublishFormBtn;
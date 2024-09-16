'use client'
import React, { useTransition } from 'react';
import { Button } from './ui/button';
import { MdOutlineUnpublished } from 'react-icons/md';
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
import { FaSpinner } from 'react-icons/fa';
import { toast } from './ui/use-toast';
import { UnpublishForm } from '@/action/form';
import { useRouter } from 'next/navigation';
import { getSalesforceRecordByFormId, updateSalesforceRecord } from '../app/util/salesforceApi';

function UnpublishFormBtn({ id }: { id: number }) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  async function unpublishForm() {
    try {
      await UnpublishForm(id);
      console.log('Unpublish Id: ', id);

      // Fetch Salesforce record using form ID
      const salesforceRecord = await getSalesforceRecordByFormId('SME_Form__c', id);

      if (salesforceRecord) {
        // Update Salesforce record to remove the form URL and content
        await updateSalesforceRecord('SME_Form__c', salesforceRecord.Id, {
          Form_URL__c: null,
          Form_Response_Json__c: null,
        });
        console.log('Salesforce record updated: form link and content removed');
      } else {
        console.log('No matching Salesforce record found for this form ID');
      }

      toast({
        title: "Success",
        description: "Your form is no longer publicly available.",
      });
      router.refresh();
    } catch (error) {
      console.error('Error unpublishing form:', error);
      toast({
        title: "Error",
        description: "Something went wrong while unpublishing the form.",
      });
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className='w-full mt-2 text-md  text-sm gap-2 text-white bg-gradient-to-r from-orange-400 to-red-400'>
          <MdOutlineUnpublished className='w-4 h-4' />
          Unpublish
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will unpublish your form. After unpublishing, the form will no longer be publicly accessible, and you will be able to edit it again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              startTransition(unpublishForm);
            }}
          >
            Proceed {loading && <FaSpinner className='animate-spin' />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default UnpublishFormBtn;
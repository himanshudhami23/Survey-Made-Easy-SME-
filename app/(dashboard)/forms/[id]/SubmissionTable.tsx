"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { GetFormWithSubmission } from "@/action/form";
import { FormElementInstance } from '@/components/FormElements';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistance } from "date-fns";
import { Button } from '@/components/ui/button';
import { sendResponseToSalesforce } from '@/app/util/salesforceApi';
import { getSalesforceRecordByFormId } from '@/app/util/salesforceApi';

function SubmissionTable({ id }: { id: number }) {
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastProcessedSubmissionId, setLastProcessedSubmissionId] = useState<number | null>(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedForm = await GetFormWithSubmission(id);
      if (fetchedForm) {
        setForm(fetchedForm);
      }
    } catch (error) {
      console.error('Error fetching form:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const sendToSalesforce = useCallback(async () => {
    if (form && form.FormSubmissions && form.FormSubmissions.length > 0) {
      const newestSubmission = form.FormSubmissions[form.FormSubmissions.length - 1];

      if (newestSubmission.id !== lastProcessedSubmissionId) {
        const salesforceRecord = await getSalesforceRecordByFormId('SME_Form__c', id);
        if (salesforceRecord) {
          const parsedContent = JSON.parse(newestSubmission.content);

          // Format the submission data
          const formattedSubmission = Object.entries(parsedContent).reduce((acc: any, [key, value]) => {
            const formContent = Array.isArray(form.content) ? form.content : JSON.parse(form.content || '[]');
            const field = formContent.find((f: FormElementInstance) => f.id === key);
            if (field) {
              acc[key] = {
                type: field.type,
                label: field.extraAttributes?.label || '',
                value: value
              };
            }
            return acc;
          }, {});

          const fullResponse = {
            formId: id,
            values: formattedSubmission
          };

          await sendResponseToSalesforce(
            'SME_Form_Response__c',
            {
              Name: `Form Response ${id}`,
              Response_Data__c: JSON.stringify(fullResponse),
              Form_Name__c: salesforceRecord.Id
            }
          );
          setLastProcessedSubmissionId(newestSubmission.id);
        }
      }
    }
  }, [form, id, lastProcessedSubmissionId]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleRefreshSubmissions = () => {
    fetchSubmissions();
    // Send to Salesforce in the background
    sendToSalesforce();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!form) {
    return <div>Form not found</div>;
  }

  const formElements = JSON.parse(form.content) as FormElementInstance[];
  const columns = formElements
    .filter(element => ['TextField', 'NumberField', 'DateField', 'CheckboxField', 'SelectField', 'TextAreaField', 'EmailField'].includes(element.type))
    .map(element => ({
      id: element.id,
      label: element.extraAttributes?.label,
      required: element.extraAttributes?.required,
      type: element.type
    }));

  return (
    <>
      <h1 className="text-2xl font-bold my-4">Submissions</h1>
      <Button onClick={handleRefreshSubmissions} className="mb-4">Refresh Submissions</Button>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className="uppercase">
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="text-muted-foreground text-right uppercase">
                Submitted At
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {form.FormSubmissions.map((submission: any, index: number) => (
              <TableRow key={index}>
                {columns.map(column => (
                  <TableCell key={column.id}>
                    {JSON.parse(submission.content)[column.id]}
                  </TableCell>
                ))}
                <TableCell className="text-muted-foreground text-right">
                  {formatDistance(new Date(submission.createdAt), new Date(), { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default SubmissionTable;
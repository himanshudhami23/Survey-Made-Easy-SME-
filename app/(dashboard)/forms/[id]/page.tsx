import { GetFormById, GetFormWithSubmission } from "@/action/form";
import FormLinkShare from "@/components/FormLinkShare";
import VisitBtn from "@/components/VisitBtn";
import React, { ReactNode } from "react";
import {StatsCard} from "../../page";
import {LuView} from "react-icons/lu";
import {FaWpforms} from "react-icons/fa";
import {HiCursorClick} from "react-icons/hi";
import {TbArrowBounce} from "react-icons/tb";
import { ElementsType, FormElementInstance } from "@/components/FormElements";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, formatDistance } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import SubmissionTable from "./SubmissionTable";



async function FormDetailPage({params,}:
    {params:{
        id:string;
    };
}) {

    const {id} = params;
    const form = await GetFormById(Number(id));
    if(!form){
        throw new Error("Form Not Found");
    }

    // Calculate the statistics
    const visits = form.visits;
    const submissions = form.submissions;
    const submissionRate = visits > 0 ? (submissions / visits) * 100 : 0;
    const bounceRate = visits > 0 ? ((visits - submissions) / visits) * 100 : 0;

    return  (
    <>
    <div className="py-10 border-b border-muted">
        <div className="flex justify-between container">
          <h1 className="text-4xl font-bold truncate">{form.name} </h1>
          <VisitBtn shareUrl={form.shareURL} />
        </div>
    </div>
    <div className="py-4 border-b border-muted">
        <div className="container flex gap-2 items-center justify-center">
          <FormLinkShare shareUrl={form.shareURL} />
        </div>
    </div>
    <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2
    lg:grid-cols-4 container">
      <StatsCard title="Total visits"
         icon={<LuView className="text-blue-600" />}
         helperText = "All time form visit"
         value={visits.toLocaleString()}
         loading={false}
         className="shadow-md shadow-blue-600"
         />

         <StatsCard title="Total Submissions"
         icon={<FaWpforms className="text-green-600" />}
         helperText = "All time form submissions"
         value={submissions.toLocaleString()}
         loading={false}
         className="shadow-md shadow-green-600"
         />

         <StatsCard title="Submission Rate"
         icon={<HiCursorClick className="text-yellow-600" />}
         helperText = "Visits to submissions rate"
         value={submissionRate.toFixed(2) + "%"}
         loading={false}
         className="shadow-md shadow-yellow-600"
         />

         <StatsCard title="Bounce Rate"
         icon={<TbArrowBounce className="text-red-600" />}
         helperText = "Visits without submissions"
         value={bounceRate.toFixed(2) + "%"}
         loading={false}
         className="shadow-md shadow-red-600"
         />
    </div>
    <div className="container pt-10">
        <SubmissionTable id={form.id}/>
    </div>
    </>
    );
}

export default FormDetailPage;

type Row = {[key:string]:string} & {
  submittedAt: Date;
} ;

// async function SubmissionTable({id}:{id:number}) {
//   const form = await GetFormWithSubmission(id);

//   if(!form){
//     throw new Error("Form not found");
//   }

//   const formElements = JSON.parse(form.content) as FormElementInstance[];
//   const columns = formElements
//     .filter(element => ['TextField', 'NumberField', 'DateField', 'CheckboxField', 'SelectField', 'TextAreaField', 'EmailField'].includes(element.type))
//     .map(element => ({
//       id: element.id,
//       label: element.extraAttributes?.label,
//       required: element.extraAttributes?.required,
//       type: element.type
//     }));

//   const rows: Row[] = form.FormSubmissions.map(submission => ({
//     ...JSON.parse(submission.content),
//     submittedAt: submission.createdAt,
//   }));

//   return (
//     <>
//       <h1 className="text-2xl font-bold my-4">Submissions</h1>
//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               {columns.map((column) => (
//                 <TableHead key={column.id} className="uppercase">
//                   {column.label}
//                 </TableHead>
//               ))}
//               <TableHead className="text-muted-foreground text-right uppercase">
//                 Submitted At
//               </TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {rows.map((row, index) => (
//               <TableRow key={index}>
//                 {columns.map(column => (
//                   <TableCell key={column.id}>
//                     {renderCellValue(column.type, row[column.id])}
//                   </TableCell>
//                 ))}
//                 <TableCell className="text-muted-foreground text-right">
//                   {formatDistance(row.submittedAt, new Date(), {
//                     addSuffix: true,
//                   })}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     </>
//   );
// }

// function renderCellValue(type: ElementsType, value: string) {
//   switch (type) {
//     case "DateField":
//       return value ? (
//         <Badge variant={"outline"}>
//           {format(new Date(value), "dd/MM/yyyy")}
//         </Badge>
//       ) : null;
//     case "CheckboxField":
//       return <Checkbox checked={value === "true"} disabled />;
//     default:
//       return value;
//   }
// }


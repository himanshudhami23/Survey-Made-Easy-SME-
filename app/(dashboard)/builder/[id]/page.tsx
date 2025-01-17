import { GetFormById } from "@/action/form";
import FormBuilder from "@/components/FormBuilder";
import React from "react";

async function BuilderPage({params,}:
    {params:{
        id:string;
    };
}) {

    const {id} = params;
    const form = await GetFormById(Number(id));
    if(!form){
        throw new Error("Form Not Found");
    }

  return (    
    <FormBuilder form={form} />
    
  );
}

export default BuilderPage;
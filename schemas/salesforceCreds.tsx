import { z } from "zod";

export const salesforceCredSchema = z.object({
    clientId:z.string().min(4),
    clientSecret: z.string().min(4)
});


export type salesforceCredSchemaType = z.infer<typeof salesforceCredSchema >
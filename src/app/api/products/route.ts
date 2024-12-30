import { db } from "@/app/lib/db/db";
import { products } from "@/app/lib/db/schema";
import { productSchema } from "@/app/lib/validators/productSchema"
import { desc } from "drizzle-orm";
import { writeFile,unlink } from 'node:fs/promises';
import path from "path";

export async function POST(request:Request){

   const data= await request.formData()
    
   let validatedData ;
   try {
    validatedData =productSchema.parse({
        name: data.get('name'),
        description: data.get('description'),
        price: Number(data.get('price')),
        image: data.get('image'),
     })

   } catch (error) {
       return Response.json({message:error},{status:400})
   }
   const filename = `${Date.now()}.${validatedData.image.name.split('.').slice(-1)}`; // choco.png 213123123123.png
   const filepath = path.join(process.cwd(), 'public/assets', filename);
   try {
    const buffer = Buffer.from(await validatedData.image.arrayBuffer());
    await writeFile(filepath, buffer);
    
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   } catch (error:any) {
     return Response.json({message:'Failed to save file'},{status:500})
   }

   try {
      await db.insert(products).values({...validatedData,image:filename})
   } catch (error:any) {
    //if database insert fail 
    try {
        await unlink(filepath)
    } catch (error) {
         console.log('Failed to delete file:',error)
    }
       return Response.json({message:'Failed to store product into the database'},{status:500})
   }

   return Response.json({message:'ok'},{status:201})
}

export async function GET(){
  try {
      const allProducts=await db.select().from(products).orderBy(desc(products.id));
      return Response.json(allProducts)
  } catch (error) {
    return Response.json({message:'Fail to fetch products'},{status:500})
  }
}
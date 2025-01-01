import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import React from "react";
import CreateProductForm, { FormValues } from "./create-product-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "@/http/api";
import { useNewProduct } from "@/store/product-store";
import { useToast } from "@/hooks/use-toast";
const ProductSheet = () => {
  const { isOpen, onClose } = useNewProduct();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationKey: ["create-product"],
    mutationFn: (data: FormData) => createProduct(data),
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "Product created successfully",
      });
    },
  });
  const onSubmit = (values: FormValues) => {
    const formdata = new FormData();
    formdata.append("name", values.name);
    formdata.append("description", values.description);
    formdata.append("price", String(values.price));
    formdata.append("image", (values.image as FileList)[0]);
    mutate(formdata);
  };
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="min-w-[28rem] space-y-4">
        <SheetHeader>
          <SheetTitle>Create Product</SheetTitle>
          <SheetDescription>Create a new product</SheetDescription>
        </SheetHeader>
        <CreateProductForm disabled={isPending} onSubmit={onSubmit} />
      </SheetContent>
    </Sheet>
  );
};
export default ProductSheet;

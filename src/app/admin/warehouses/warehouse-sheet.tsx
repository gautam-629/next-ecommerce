import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Warehouse } from "@/types";
import { useNewWarehouse } from "@/store/warehouse-store";
import { createWarehouse } from "@/http/api";
import { useToast } from "@/hooks/use-toast";
import CreateWarehouseForm, { FormValues } from "./create-warehouse-form";
const WarehouseSheet = () => {
  const { toast } = useToast();
  const { isOpen, onClose } = useNewWarehouse();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["warehouse"],
    mutationFn: (data: Warehouse) => createWarehouse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouse"] });
      toast({
        title: "Warehouse created successfully",
      });
      onClose();
    },
  });
  const onSubmit = (values: FormValues) => {
    mutate(values as Warehouse);
  };
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="min-w-[28rem] space-y-4">
        <SheetHeader>
          <SheetTitle>Create Warehouse</SheetTitle>
          <SheetDescription>Create a new warehouse</SheetDescription>
        </SheetHeader>
        <CreateWarehouseForm onSubmit={onSubmit} disabled={isPending} />
      </SheetContent>
    </Sheet>
  );
};
export default WarehouseSheet;

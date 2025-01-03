"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllDeliveryPersons } from "@/http/api";
import { Product } from "@/types";
import { Loader2 } from "lucide-react";
import { useNewDeliveryPerson } from "@/store/delivery-person-store";
import { columns } from "./columns";
import DeliveryPersonSheet from "./delivery-person-sheet";
import { DataTable } from "../_components/data-table";
const DeliveryPersonsPage = () => {
  const { onOpen } = useNewDeliveryPerson();
  const {
    data: deliveryPersons,
    isLoading,
    isError,
  } = useQuery<Product[]>({
    queryKey: ["delivery-persons"],
    queryFn: getAllDeliveryPersons,
  });
  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold tracking-tight">Delivery Persons</h3>
        <Button size={"sm"} onClick={onOpen}>
          Add Delivery Person
        </Button>
        <DeliveryPersonSheet />
      </div>
      {isError && <span className="text-red-500">Something went wrong.</span>}
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="size-10 animate-spin" />
        </div>
      ) : (
        <DataTable columns={columns} data={deliveryPersons || []} />
      )}
    </>
  );
};
export default DeliveryPersonsPage;

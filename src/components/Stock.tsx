import React from "react";
import { useQuery } from "react-apollo";
import { MaterialChangelog2ContactView } from "../entities/MaterialChangelog2ContactView";
import { MaterialChangelog2WarehouseView } from "../entities/MaterialChangelog2WarehouseView";
import MaterialChangelogToProduct from "../entities/MaterialChangelogToProduct";
import Product from "../entities/Product";
import { GET_CONTACT_STOCK } from "../graphql/ContactQueries";
import { GET_WAREHOUSE_STOCK } from "../graphql/WarehouseQueries";
import Loading from "./Loading";
import Panel from "./Panel";
import Table from "./Table";

export enum StockType {
  WAREHOUSE = "warehouse",
  CONTACT = "contact",
}
export interface StockProps {
  type: StockType;
  id: number;
}

interface StockEntry {
  id: number;
  name: string;
  amount: number;
}

export default function Stock(props: StockProps) {
  let query = useQuery<{
    getContactStock: Array<
      MaterialChangelog2ContactView & { product: Product }
    >;
    getWarehouseStock: Array<
      MaterialChangelog2WarehouseView & { product: Product }
    >;
  }>(GET_CONTACT_STOCK, {
    variables: { id: props.id },
    fetchPolicy: "network-only",
  });

  if (props.type === StockType.WAREHOUSE) {
    query = useQuery<{
      getContactStock: Array<
        MaterialChangelog2ContactView & { product: Product }
      >;
      getWarehouseStock: Array<
        MaterialChangelog2WarehouseView & { product: Product }
      >;
    }>(GET_WAREHOUSE_STOCK, {
      variables: { id: props.id },
      fetchPolicy: "network-only",
    });
  }

  if (query.loading && !query.data) {
    return (
      <Panel title="Material">
        <Loading />
      </Panel>
    );
  }

  const stockEntries: StockEntry[] = [];

  for (const item of query.data?.getContactStock || []) {
    if (item.inAmount - item.outAmount != 0) {
      stockEntries.push({
        id: item.product.id,
        name: item.product.internName,
        amount: item.inAmount - item.outAmount,
      });
    }
  }

  for (const item of query.data?.getWarehouseStock || []) {
    if (item.inAmount - item.outAmount != 0) {
      stockEntries.push({
        id: item.product.id,
        name: item.product.internName,
        amount: item.inAmount - item.outAmount,
      });
    }
  }

  const columns = [
    {
      keys: ["name"],
      text: "Produkt",
      sortable: true,
      searchable: true,
    },
    { keys: ["amount"], text: "Anzahl", sortable: true, searchable: true },
  ];

  if (props.type === StockType.WAREHOUSE) {
    columns.push({
      keys: ["numbers"],
      text: "Nummern",
      sortable: true,
      searchable: true,
    });
  }

  return (
    <Panel title="Material">
      <Table<StockEntry>
        columns={columns}
        data={stockEntries}
        defaultSort={{
          keys: ["name"],
          direction: "asc",
        }}
      />
    </Panel>
  );
}

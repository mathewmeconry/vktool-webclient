import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-apollo";
import { useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { UI } from "../../actions/UIActions";
import Action from "../../components/Action";
import Column from "../../components/Column";
import { Error403 } from "../../components/Errors/403";
import Error404 from "../../components/Errors/404";
import FormEntry from "../../components/FormEntry";
import Loading from "../../components/Loading";
import { Page } from "../../components/Page";
import Panel from "../../components/Panel";
import Row from "../../components/Row";
import Stock, { StockType } from "../../components/Stock";
import Config from "../../Config";
import { MaterialChangelog2WarehouseView } from "../../entities/MaterialChangelog2WarehouseView";
import Product from "../../entities/Product";
import { default as WarehouseEntity } from "../../entities/Warehouse";
import { Authroles } from "../../generated/graphql";
import { GET_MY_ROLES } from "../../graphql/UserQueries";
import {
  EDIT_WAREHOUSE,
  GET_WAREHOUSE,
  GET_WAREHOUSE_STOCK,
} from "../../graphql/WarehouseQueries";
import { AuthRoles } from "../../interfaces/AuthRoles";

export default function Warehouse(props: RouteComponentProps<{ id: string }>) {
  const { loading, data, error, refetch } = useQuery<{
    getWarehouse: WarehouseEntity;
  }>(GET_WAREHOUSE, {
    variables: { id: parseInt(props.match.params.id) },
    fetchPolicy: "cache-and-network",
  });
  const [editable, setEditable] = useState(false);
  const [warehouse, setWarehouse] = useState<WarehouseEntity>();
  const [editWarehouse] = useMutation<{ editWarehouse: WarehouseEntity }>(
    EDIT_WAREHOUSE
  );
  const stock = useQuery<{
    getWarehouseStock: Array<MaterialChangelog2WarehouseView & {product: Product}>;
  }>(GET_WAREHOUSE_STOCK, {
    variables: { id: parseInt(props.match.params.id) },
    fetchPolicy: "cache-and-network",
  });
  const [currentWeight, setCurrentWeight] = useState(0);
  const { data: rolesQueryData } = useQuery(GET_MY_ROLES);

  useEffect(() => {
    const data = stock.data?.getWarehouseStock || [];
    let weight = 0;
    for (const entry of data) {
      const amount = entry.inAmount - entry.outAmount;
      if (entry.product.weight && amount > 0) {
        weight += entry.product.weight * amount;
      }
    }
    setCurrentWeight(weight);
  }, [stock.data?.getWarehouseStock]);

  const dispatch = useDispatch();
  let formEl: HTMLFormElement;

  if (error?.message && error?.message.indexOf("Access denied!") > -1) {
    return <Error403 />;
  }

  if (loading || !data) {
    return (
      <Page title="Loading...">
        <Loading />
      </Page>
    );
  }

  if (!data) {
    return <Error404 />;
  }

  if (!warehouse && data.getWarehouse) {
    setWarehouse(data.getWarehouse);
    return (
      <Page title={data.getWarehouse.name}>
        <Loading />
      </Page>
    );
  }

  async function onAbort() {
    setEditable(false);
    setWarehouse((await refetch()).data.getWarehouse);
  }

  function onInputChange(name: string, value: any) {
    const clone = { ...warehouse } as WarehouseEntity;
    // @ts-ignore
    clone[name] = value;
    setWarehouse(clone);
  }

  async function onSave() {
    const isValid = formEl.checkValidity();
    if (isValid) {
      const result = await editWarehouse({
        variables: {
          id: warehouse?.id,
          name: warehouse?.name,
          maxWeight: parseFloat(warehouse?.maxWeight?.toString() || ""),
        },
      });
      if (
        (result.errors && result.errors.length > 0) ||
        result.data === undefined
      ) {
        return false;
      }
      setWarehouse(result.data?.editWarehouse);
      setEditable(false);
      dispatch(UI.showSuccess("Gespeichert"));
      return true;
    }
    dispatch(UI.showError("Korrigiere zuerst die Fehler"));
    return false;
  }

  function renderPanelActions() {
    const actions = [
      <Action
        key="pdf-export"
        onClick={async () => {
          window.open(
            `${Config.apiEndpoint}/api/warehouse/${warehouse?.id}/report/pdf`
          );
        }}
        icon="file-pdf"
      />,
    ];
    if (editable) {
      actions.push(<Action icon="save" key="save" onClick={onSave} />);
      actions.push(<Action icon="times" key="cancel" onClick={onAbort} />);
      return actions;
    }

    actions.push(
      <Action
        icon="pencil-alt"
        key="edit"
        onClick={async () => {
          setEditable(true);
        }}
        roles={[AuthRoles.WAREHOUSE_CREATE]}
      />
    );
    return actions;
  }

  function renderWeight() {
    if (
      rolesQueryData?.me?.roles.filter((rec: Authroles) =>
        [Authroles.WarehouseOverload, Authroles.Admin].includes(rec)
      ).length > 0
    ) {
      return (
        <FormEntry
          id="currentWeight"
          title="Jetztiges Gewicht"
          value={Math.round(currentWeight)}
          editable={false}
          append="kg"
        />
      );
    }
    return null;
  }

  return (
    <Page title={data.getWarehouse.name}>
      <Row>
        <Column>
          <Panel actions={renderPanelActions()}>
            <form
              id="editWarehouse"
              ref={(ref: HTMLFormElement) => {
                formEl = ref;
              }}
            >
              <FormEntry
                id="name"
                title="Name"
                value={warehouse?.name}
                editable={editable}
                onChange={onInputChange}
                required={true}
              />
              <FormEntry
                id="maxWeight"
                title="Maximal Gewicht"
                value={warehouse?.maxWeight}
                editable={editable}
                onChange={onInputChange}
                append="kg"
              />
              {renderWeight()}
            </form>
          </Panel>
        </Column>
      </Row>
      <Row>
        <Column>
          <Stock
            id={parseInt(props.match.params.id)}
            type={StockType.WAREHOUSE}
          />
        </Column>
      </Row>
    </Page>
  );
}

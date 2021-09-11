import React from 'react'
import { useQuery } from 'react-apollo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { RouteComponentProps } from 'react-router'
import { MaterialChangelog } from '../generated/graphql'
import { GET_MATERIAL_CHANGELOGS_CONTACT } from '../graphql/MaterialChangelogQueries'
import Loading from './Loading'
import Panel from './Panel'
import Table from './Table'
import { Button } from 'react-bootstrap'

export default function ContactMaterialChangelogs(props: { id: number } & RouteComponentProps) {
  const { loading, data } = useQuery<{ getContactMaterialChangelogs: MaterialChangelog[] }>(GET_MATERIAL_CHANGELOGS_CONTACT, { variables:  { id: props.id } })

  function viewChangelog(event: React.MouseEvent<HTMLButtonElement>) {
    if (event.currentTarget.parentNode && event.currentTarget.parentNode.parentElement) {
        let id = event.currentTarget.parentNode.parentElement.getAttribute('data-key')

        // open a new tap when the middle button is pressed (buttonID 1)
        if (event.button == 1) {
            window.open((document.location as Location).origin + '/warehouse/changelog/' + id)
        } else {
            props.history.push('/warehouse/changelog/' + id)
        }
    }
}

  if(loading) {
    return (<Panel title="Materialänderungen"><Loading /></Panel>)
  }

  return (
    <Panel title="Materialänderungen">
      <Table<MaterialChangelog>
        columns={[
          { text: 'Datum', keys: ['date'], sortable: true, format: 'toLocaleDateString' },
          { text: 'Actions', keys: ['_id'], content: <Button variant="success" className="view" onMouseUp={viewChangelog}><FontAwesomeIcon icon="eye" /></Button> }
        ]}
        defaultSort={{
          keys: ['date'],
          direction: 'desc'
        }}
        data={data?.getContactMaterialChangelogs || []}
      />
    </Panel>
  )
}
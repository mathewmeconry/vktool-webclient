import React, { useState } from "react"
import Contact from "../entities/Contact"
import { Page } from "../components/Page"
import Row from "../components/Row"
import Column from "../components/Column"
import Panel from "../components/Panel"
import { Button } from "react-bootstrap"
import { LogoffBase } from "../interfaces/Logoffs"
import MemberSelect from "../components/MemberSelect"
import Table from "../components/Table"
import { LogoffState } from "../entities/Logoff"
import Input from "../components/Input"
import { ADD_LOGOFFS } from "../graphql/LogoffQueries"
import { RouteComponentProps } from "react-router"
import { ValueType } from "react-select/lib/types"
import { useMutation } from "react-apollo"

export interface AddLogoffState { contact?: Contact, logoffs: Array<ExtendedLogoffBase>, notify: boolean }

interface ExtendedLogoffBase extends LogoffBase {
    id: string,
    [index: string]: any
}

export default function AddLogoff(props: RouteComponentProps) {
    let formEl: HTMLFormElement
    const [member, setMember] = useState<number>()
    const [notify, setNotify] = useState(true)
    const [logoffs, setLogoffs] = useState<Partial<ExtendedLogoffBase>[]>([])
    const [addLogoffs, { data }] = useMutation(ADD_LOGOFFS)

    function onSelectChange(contacts: Contact[]) {
        if (contacts) {
            setMember(contacts[0].id)
        } else {
            setMember(undefined)
        }
    }

    function onInputChange(name: string, value: any) {
        switch (name) {
            case 'notify':
                setNotify(value as boolean)
                break
        }
    }

    function onLogoffChange(id: string | number | null, name: string, value: any, newly: boolean): void {
        if (newly) {
            const logoff: Partial<ExtendedLogoffBase> = {
                id: logoffs.length.toString()
            }
            // @ts-ignore
            logoff[name] = value
            logoff.state = LogoffState.APPROVED
            setLogoffs([...logoffs, logoff])
        } else {
            if (id) {
                setLogoffs(logoffs.map((item, index) => {
                    if (index === parseInt(id.toString())) {
                        item[name] = value
                    }
                    return item
                }))
            }

        }
    }

    function onSave(event: React.MouseEvent<HTMLButtonElement>): boolean {
        event.preventDefault()
        if (formEl) {
            let valid = formEl.checkValidity()
            formEl.className = 'was-validated'

            if (valid) {
                addLogoffs({
                    variables: {
                        data: logoffs.map(item => {
                            return {
                                contactId: member,
                                from: item.from,
                                until: item.until,
                                state: item.state,
                                remarks: item.remarks
                            }
                        }),
                        notify
                    }
                })
                props.history.push('/draft/logoffs')
            }
            return valid
        }
        return false
    }

    return (
        <Page title="Abmeldungen hinzufügen">
            <Row>
                <Column>
                    <Panel>
                        <form id="addLogoffs" ref={(ref: HTMLFormElement) => { formEl = ref }}>
                            <div className="row">
                                <div className="col">
                                    <h5>Mitglied</h5>
                                    <MemberSelect onChange={onSelectChange} defaultValue={(member) ? [member.toString()] : undefined} required={true} />
                                </div>
                                <div className="col-1">
                                    <h5>Benachrichtigen</h5>
                                    <Input type="checkbox" className="d-flex justify-content-center" name="notify" key="notify" value={notify} onChange={onInputChange} editable={true} />
                                </div>
                            </div>
                            <br></br>
                            <Table<ExtendedLogoffBase>
                                columns={[
                                    { keys: ['from'], text: 'Von', editable: true, type: 'datetime', onChange: onLogoffChange, required: true },
                                    { keys: ['until'], text: 'Bis', editable: true, type: 'datetime', onChange: onLogoffChange, required: true },
                                    { keys: ['state'], text: 'Status', editable: true, type: 'select', options: ['approved', 'pending', 'declined'], onChange: onLogoffChange, required: true },
                                    { keys: ['remarks'], text: 'Bemerkungen', editable: true, type: 'text', onChange: onLogoffChange, required: false },
                                ]}
                                addNew={true}
                                data={logoffs as ExtendedLogoffBase[]}
                            />
                            <Button variant="primary" block={true} onClick={onSave}>Speichern</Button>
                        </form>
                    </Panel>
                </Column>
            </Row>
        </Page >
    )
}
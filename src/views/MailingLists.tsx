import React from "react"
import { Page } from "../components/Page"
import Column from "../components/Column"
import Row from "../components/Row"
import Panel from "../components/Panel"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useQuery } from "react-apollo"
import { GET_ALL_MEMBERS } from "../graphql/ContactQueries"
import Loading from "../components/Loading"
import Contact from "../entities/Contact"

export default function MailingLists() {
    const { loading, error, data } = useQuery<{ getMembersAll: Contact[] }>(GET_ALL_MEMBERS)

    if (loading || !data) {
        return (<Page title="Verteiler"><Loading /></Page>)
    }

    let mailingLists = { all: ([] as Array<string>), drivers: ([] as Array<string>), vks: ([] as Array<string>), squad: ([] as Array<string>), vst: ([] as Array<string>), con: ([] as Array<string>) }

    for (let member of data.getMembersAll) {
        mailingLists.all.push(member.mail)
        if (member.mailSecond) mailingLists.all.push(member.mailSecond)
        mailingLists.all = mailingLists.all.concat(member.moreMails || [])

        if (member.contactGroups) {
            // Drivers
            if (member.contactGroups.find(group => group.bexioId === 9)) {
                mailingLists.drivers.push(member.mail)
                if (member.mailSecond) mailingLists.drivers.push(member.mailSecond)
                mailingLists.drivers = mailingLists.drivers.concat(member.moreMails || [])
            }

            // VKs
            if (member.contactGroups.find(group =>
                group.bexioId === 17 ||
                group.bexioId === 13 ||
                group.bexioId === 11 ||
                group.bexioId === 12 ||
                group.bexioId === 28 ||
                group.bexioId === 29 ||
                group.bexioId === 15 ||
                group.bexioId === 27 ||
                group.bexioId === 26 ||
                group.bexioId === 10 ||
                group.bexioId === 14
            )) {
                mailingLists.vks.push(member.mail)
                if (member.mailSecond) mailingLists.vks.push(member.mailSecond)
                mailingLists.vks = mailingLists.vks.concat(member.moreMails || [])
            }

            // Squad
            if (member.contactGroups.find(group =>
                group.bexioId === 13 ||
                group.bexioId === 12 ||
                group.bexioId === 28 ||
                group.bexioId === 29 ||
                group.bexioId === 15 ||
                group.bexioId === 14
            )) {
                mailingLists.squad.push(member.mail)
                if (member.mailSecond) mailingLists.squad.push(member.mailSecond)
                mailingLists.squad = mailingLists.squad.concat(member.moreMails || [])
            }

            // VST
            if (member.contactGroups.find(group => group.bexioId === 16)) {
                mailingLists.vst.push(member.mail)
                if (member.mailSecond) mailingLists.vst.push(member.mailSecond)
                mailingLists.vst = mailingLists.vst.concat(member.moreMails || [])
            }

            // Condor
            if (member.contactGroups.find(group => group.bexioId === 22)) {
                mailingLists.con.push(member.mail)
                if (member.mailSecond) mailingLists.con.push(member.mailSecond)
                mailingLists.con = mailingLists.con.concat(member.moreMails || [])
            }
        }
    }

    function copy(data: string) {
        (navigator as any).permissions.query({ name: "clipboard-write" }).then((result: { state: string }) => {
            if (result.state == "granted" || result.state == "prompt") {
                (navigator as any).clipboard.writeText(data)
            }
        })
    }

    function addCopy(data: string) {
        return (
            <div className="input-group-prepend">
                <button className="btn btn-outline-secondary" id="btnGroupAddon" onClick={async () => copy(data)}>
                    <FontAwesomeIcon icon="clipboard" />
                </button>
            </div>
        )
    }

    return (
        <Page title="Verteiler">
            <Row>
                <Column className="col-md-4">
                    <Panel title="Mitglieder">
                        <div className="input-group">
                            <input className="form-control" readOnly value={mailingLists.all.join(';')}></input>
                            {addCopy(mailingLists.all.join(';'))}
                        </div>
                    </Panel>
                </Column>

                <Column className="col-md-4">
                    <Panel title="VKs (ohne Fahrer und Condor)">
                        <div className="input-group">
                            <input className="form-control" readOnly value={mailingLists.vks.join(';')}></input>
                            {addCopy(mailingLists.vks.join(';'))}
                        </div>
                    </Panel>
                </Column>

                <Column className="col-md-4">
                    <Panel title="Kader">
                        <div className="input-group">
                            <input className="form-control" readOnly value={mailingLists.squad.join(';')}></input>
                            {addCopy(mailingLists.squad.join(';'))}
                        </div>
                    </Panel>
                </Column>
            </Row>
            <Row>
                <Column className="col-md-4">
                    <Panel title="Fahrer">
                        <div className="input-group">
                            <input className="form-control" readOnly value={mailingLists.drivers.join(';')}></input>
                            {addCopy(mailingLists.drivers.join(';'))}
                        </div>
                    </Panel>
                </Column>

                <Column className="col-md-4">
                    <Panel title="Vorstand">
                        <div className="input-group">
                            <input className="form-control" readOnly value={mailingLists.vst.join(';')}></input>
                            {addCopy(mailingLists.vst.join(';'))}
                        </div>
                    </Panel>
                </Column>

                <Column className="col-md-4">
                    <Panel title="Condor">
                        <div className="input-group">
                            <input className="form-control" readOnly value={mailingLists.con.join(';')}></input>
                            {addCopy(mailingLists.con.join(';'))}
                        </div>
                    </Panel>
                </Column>
            </Row>
        </Page >
    )
}
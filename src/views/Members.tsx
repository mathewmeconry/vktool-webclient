import { State } from "../reducers/IndexReducer"
import { connect } from "react-redux"
import { Data } from "../actions/DataActions"
import { UI } from "../actions/UIActions"
import { ThunkDispatch } from "redux-thunk"
import { AnyAction } from "redux"
import { DataList, DataListProps } from "../components/DataList"
import Action from "../components/Action"
import React, { Component } from "react"
import Contact from "../entities/Contact"
import Xlsx from 'xlsx'
import Config from "../Config"
import { DataInterface } from "../reducers/DataReducer"
import ContactGroup from "../entities/ContactGroup"
import { TableFilter } from "../components/Table"

interface MembersProps extends DataListProps<Contact> {
    memberlistPdf: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>
    ranks: DataInterface<ContactGroup>
}

export class _Members extends Component<MembersProps, { filters: TableFilter[] }> {
    constructor(props: MembersProps) {
        super(props)

        this.excelExport = this.excelExport.bind(this)

        this.state = {
            filters: []
        }
    }

    public componentDidUpdate(prevProps: MembersProps) {
        if (prevProps !== this.props && !this.props.ranks.loading && this.props.ranks.ids) {
            const filters: TableFilter[] = this.props.ranks.ids.map<TableFilter>(id => {
                return {
                    id: this.props.ranks.byId[id].id.toString(),
                    displayName: this.props.ranks.byId[id].name,
                    filters: [{ type: 'eq', value: this.props.ranks.byId[id].name, key: 'rank' }]
                }
            }
            )
            this.setState({
                filters
            })
        }
    }

    private async excelExport(event: React.MouseEvent<HTMLButtonElement>) {
        let membersAsArray = []
        for (let i in this.props.data.byId) {
            let member = this.props.data.byId[i]
            let germanizedMember = {
                Nachname: member.lastname,
                Vorname: member.firstname,
                Rang: (member.rank || ''),
                Funktionen: (member.functions || []).join(','),
                Geburtstag: member.birthday,
                Adresse: `${member.address}, ${member.postcode} ${member.city}`,
                Abholpunkt: '',
                'E-Mail': member.mail,
                'E-Mail 2': member.mailSecond,
                Festnetz: member.phoneFixed,
                Mobile: member.phoneMobile
            }

            if (member.collectionPoint) germanizedMember.Abholpunkt = `(${member.collectionPoint.name}) ${member.collectionPoint.address}, ${member.collectionPoint.postcode} ${member.collectionPoint.city}`

            membersAsArray.push(germanizedMember)
        }
        let sheet = Xlsx.utils.json_to_sheet(membersAsArray)
        let book = Xlsx.utils.book_new()
        Xlsx.utils.book_append_sheet(book, sheet, 'Mitglieder')
        Xlsx.writeFile(book, 'Mitglieder.xlsx')
    }

    public render() {
        return (
            <DataList<Contact>
                title='Mitglieder'
                viewLocation='/contact/'
                data={{ ...this.props.data, loading: this.props.data.loading && this.props.ranks.loading }}
                fetchData={this.props.fetchData}
                history={this.props.history}
                tableColumns={[
                    { text: 'Name', keys: ['lastname', 'firstname'], sortable: true, searchable: true },
                    { text: 'Grad', keys: ['rank'], sortable: true, searchable: true },
                    { text: 'Funktionen', keys: ['functions'], sortable: true, searchable: true },
                    { text: 'Addresse', keys: ['address', 'postcode', 'city'], link: true, linkPrefix: 'https://www.google.com/maps/search/', sortable: true, searchable: true },
                    { text: 'Abholpunkt', keys: { collectionPoint: ['address', 'postcode', 'city'] }, link: true, linkPrefix: 'https://www.google.com/maps/search/', sortable: true, searchable: true },
                    { text: 'Festnetz', keys: ['phoneFixed'], link: true, linkPrefix: 'tel:', sortable: true, searchable: true },
                    { text: 'Festnetz 2', keys: ['phoneFixedSecond'], link: true, linkPrefix: 'tel:', sortable: true, searchable: true },
                    { text: 'Mobile', keys: ['phoneMobile'], link: true, linkPrefix: 'tel:', sortable: true, searchable: true },
                    { text: 'E-Mail', keys: ['mail'], link: true, linkPrefix: 'mailto:', sortable: true, searchable: true },
                    { text: 'E-Mail 2', keys: ['mailSecond'], link: true, linkPrefix: 'mailto:', sortable: true, searchable: true },
                ]}
                panelActions={[
                    <Action key="excel-export" icon="file-excel" onClick={this.excelExport} />,
                    <Action key="pdf-export" onClick={this.props.memberlistPdf} icon='file-pdf' />
                ]}
                defaultFilter='all'
                filters={[
                    {
                        id: 'all',
                        displayName: 'Alle',
                        filters: [{ type: 'any' }]
                    },
                    ...this.state.filters
                ]}
            />
        )
    }
}

const mapStateToProps = (state: State) => {
    return {
        data: state.data.members,
        ranks: state.data.ranks
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>) => {
    return {
        fetchData: () => {
            dispatch(Data.fetchRanks())
            dispatch(Data.fetchMembers())
        },
        memberlistPdf: async () => {
            window.open(`${Config.apiEndpoint}/api/members/pdf`)
        }
    }
}


export const Members = connect(mapStateToProps, mapDispatchToProps)(_Members)
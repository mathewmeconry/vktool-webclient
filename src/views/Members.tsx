import { State } from "../reducers/IndexReducer";
import { connect } from "react-redux";
import { Data } from "../actions/DataActions";
import { UI } from "../actions/UIActions";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { DataList, DataListProps } from "../components/DataList";
import Action from "../components/Action";
import React, { Component } from "react";
import Contact from "../entities/Contact";
import Xlsx from 'xlsx'

interface MembersProps extends DataListProps<Contact> {
}

export class _Members extends Component<MembersProps> {
    constructor(props: MembersProps) {
        super(props)

        this.excelExport = this.excelExport.bind(this)
    }

    private excelExport(event: React.MouseEvent<HTMLButtonElement>) {
        let membersAsArray = []
        for (let i in this.props.data.byId) {
            let member = this.props.data.byId[i]
            let germanizedMember = {
                Vorname: member.firstname,
                Nachname: member.lastname,
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
                {...this.props}
                panelActions={[<Action icon="file-excel" onClick={this.excelExport} />]}
            />
        )
    }
}

const mapStateToProps = (state: State) => {
    return {
        data: state.data.members,
        title: 'Mitglieder',
        viewLocation: '/contact/',
        tableColumns: [
            { text: 'Name', keys: ['firstname', 'lastname'], sortable: true },
            { text: 'Addresse', keys: ['address', 'postcode', 'city'], link: true, linkPrefix: 'https://www.google.com/maps/search/', sortable: true },
            { text: 'Abholpunkt', keys: { collectionPoint: ['address', 'postcode', 'city'] }, link: true, linkPrefix: 'https://www.google.com/maps/search/', sortable: true },
            { text: 'Festnetz', keys: ['phoneFixed'], link: true, linkPrefix: 'tel:', sortable: true },
            { text: 'Festnetz 2', keys: ['phoneFixedSecond'], link: true, linkPrefix: 'tel:', sortable: true },
            { text: 'Mobile', keys: ['phoneMobile'], link: true, linkPrefix: 'tel:', sortable: true },
            { text: 'E-Mail', keys: ['mail'], link: true, linkPrefix: 'mailto:', sortable: true },
            { text: 'E-Mail 2', keys: ['mailSecond'], link: true, linkPrefix: 'mailto:', sortable: true },
        ]
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>) => {
    return {
        fetchData: () => {
            dispatch(Data.fetchMembers())
        },
        onSearch: (value: string) => {
            dispatch(UI.searchMembers(value))
        }
    }
}


export const Members = connect(mapStateToProps, mapDispatchToProps)(_Members)
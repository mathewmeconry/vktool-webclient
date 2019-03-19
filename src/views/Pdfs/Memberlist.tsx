import React, { Component } from "react";
import Contact from "../../entities/Contact";
import { Data } from "../../actions/DataActions";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { State } from "../../reducers/IndexReducer";
import { AnyAction } from "redux";
import { DataInterface } from "../../reducers/DataReducer";
import StringIndexed from "../../interfaces/StringIndexed";
import Table from "../../components/Table";
import Loading from "../../components/Loading";
import { PDFExport } from '@progress/kendo-react-pdf';
import { RouteComponentProps } from "react-router-dom";

export class _Memberlist extends Component<{ data: DataInterface<Contact>, fetchData: Function } & RouteComponentProps> {
    private pdfExport: PDFExport

    constructor(props: { data: DataInterface<Contact>, fetchData: Function } & RouteComponentProps) {
        super(props)
        if (this.props.data.ids.length === 0) this.props.fetchData()
    }

    public componentDidMount() {
        if (this.props.data.ids.length > 0) {
            this.pdfExport.save(() => {
                this.props.history.push('/members')
            })
        }
    }

    public componentDidUpdate() {
        if (this.props.data.ids.length > 0) {
            this.pdfExport.save(() => {
                this.props.history.push('/members')
            })
        }
    }

    public render() {
        if (this.props.data.ids.length === 0) return <Loading fullscreen={true} />

        let dataById: StringIndexed<any> = {}
        for (let id of this.props.data.ids) {
            dataById['_' + id] = this.props.data.byId[id]
        }

        return (
            <div>
                <Loading fullscreen={true} />
                <PDFExport
                    ref={(ref: PDFExport) => this.pdfExport = ref}
                    paperSize="A4"
                    repeatHeaders={true}
                    landscape={true}
                    date={new Date()}
                    fileName={`Mitgliederliste-${new Date().toLocaleDateString()}`}
                    margin="2cm"
                >
                    <Table<Contact>
                        data={dataById}
                        columns={
                            [
                                { text: 'Name', keys: ['firstname', 'lastname'] },
                                { text: 'Addresse', keys: ['address', 'postcode', 'city'], link: true, linkPrefix: 'https://www.google.com/maps/search/' },
                                { text: 'Abholpunkt', keys: { collectionPoint: ['address', 'postcode', 'city'] }, link: true, linkPrefix: 'https://www.google.com/maps/search/' },
                                { text: 'Festnetz', keys: ['phoneFixed'], link: true, linkPrefix: 'tel:' },
                                { text: 'Mobile', keys: ['phoneMobile'], link: true, linkPrefix: 'tel:' },
                                { text: 'E-Mail', keys: ['mail'], link: true, linkPrefix: 'mailto:' }
                            ]}
                    />
                </PDFExport>
            </div>
        )
    }
}

const mapStateToProps = (state: State) => {
    return {
        data: state.data.members
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>) => {
    return {
        fetchData: () => {
            dispatch(Data.fetchMembers())
        }
    }
}


export const Memberlist = connect(mapStateToProps, mapDispatchToProps)(_Memberlist) 
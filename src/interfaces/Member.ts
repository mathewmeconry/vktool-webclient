export interface EditMember {
    id: number,
    collectionPointId?: number,
    entryDate?: Date,
    exitDate?: Date,
    bankName?: string,
    iban?: string,
    accountHolder?: string,
    moreMails?: Array<string>
}
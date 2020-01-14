export interface AddLogoff extends LogoffBase {
    contact: number
}

export interface AddLogoffs {
    conatct: number,
    logoffs: LogoffBase[]
}

export interface LogoffBase {
    from: Date,
    until: Date,
    remarks?: string
}
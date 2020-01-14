export interface AddLogoff extends LogoffBase {
    contact: number
}

export interface AddLogoffs {
    conatct: number,
    logoffs: LogoffBase[]
}

interface LogoffBase {
    from: Date,
    until: Date,
    remarks?: string
}
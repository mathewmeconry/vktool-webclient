import { LogoffState } from "../entities/Logoff"

export interface AddLogoff extends LogoffBase {
    contact: number
    notify: boolean
}

export interface AddLogoffs {
    contact: number,
    logoffs: LogoffBase[]
}

export interface LogoffBase {
    from: Date,
    until: Date,
    state: LogoffState
    remarks?: string
}
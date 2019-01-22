declare module 'current-device' {
    export default class Device {
        public static type: 'mobile' | 'tablet' | 'desktop' | 'unknown'
        public static orientation: 'landscape' | 'portrait' | 'unkown'
        public static os: 'ios' | 'iphone' | 'ipad' | 'ipod' | 'android' | 'blackberry' | 'windows' | 'fxos' | 'meego' | 'television' | 'unknown'

        // device type
        public static mobile(): boolean
        public static tablet(): boolean
        public static desktop(): boolean

        // devices
        public static ios(): boolean
        public static ipad(): boolean
        public static iphone(): boolean
        public static ipod(): boolean
        public static android(): boolean
        public static androidPhone(): boolean
        public static androidTablet(): boolean
        public static blackberry(): boolean
        public static blackberryPhone(): boolean
        public static blackberryTablet(): boolean
        public static windows(): boolean
        public static windowsPhone(): boolean
        public static windowsTablet(): boolean
        public static fxos(): boolean
        public static fxosPhone(): boolean
        public static fxosTablet(): boolean
        public static meego(): boolean
        public static television(): boolean

        // orientation
        public static landscape(): boolean
        public static portrait(): boolean

        // callbacks
        public static onChangeOrientation(callback: (newOrientation: string) => void): void

        // utilities
        public static noConflict(): Device
    }
}
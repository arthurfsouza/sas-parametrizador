import { Md5 } from "ts-md5";

export let env = 'D3V';
export let key = 'S4$.P4r@M3tR!z4D0r';

export const environment = {
    application: {
        api: { url: "http://localhost:9090/api/" },
        localStorage: {
            name: String(Md5.hashStr(env + '.LocalStorageName.' + key)),
            secret: String(Md5.hashStr(env + '.LocalStorageSecret.' + key))
        },
        sas: { url: "http://localhost:4800/" },
        web: { url: "http://localhost:4800/" }
    }
};
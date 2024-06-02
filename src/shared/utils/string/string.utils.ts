export default class StringUtils {
    static removeDoubleBars(val: string) {
        let valAux: string = val.replace(/\/\//g, '/');

        if(valAux.indexOf('http:/') >= 0) {
            valAux = valAux.replace('http:/', 'http://');
        }
        else if(valAux.indexOf('https:/') >= 0) {
            valAux = valAux.replace('https:/', 'https://');
        }

        return valAux;
    }
    
    static replaceAll(value: string, searchValue: string, replaceValue: string): string {
        while(value.indexOf(searchValue) >= 0) {
            value = value.replace(searchValue, replaceValue);
        }

        return value;
    }

    static replaceAllSpecialCharacters(val: string){
        let valAux = val.toLocaleLowerCase().trim();

        valAux = valAux.replace(/[áàãâä]/g, 'a');
        valAux = valAux.replace(/[éèêë]/g, 'e');
        valAux = valAux.replace(/[íìîï]/g, 'i');
        valAux = valAux.replace(/[óòõôö]/g, 'o');
        valAux = valAux.replace(/[úùûü]/g, 'u');
        valAux = valAux.replace(/[ç]/g, 'c');
        valAux = valAux.replace(/_+/, '_');
        valAux = valAux.replace(/[^a-z0-9 ]/g, '');
        valAux = valAux.replace(/[ ]+/g, ' ');

        return valAux;
    }

    static objectCopy(object: any){ return JSON.parse(JSON.stringify(object)); }

    static uuidv4(): string {  
        // @ts-ignore  
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>  
            // tslint:disable-next-line:no-bitwise  
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)  
        );
    }
}

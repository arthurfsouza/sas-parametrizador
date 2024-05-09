export default class StringUtils {
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
}

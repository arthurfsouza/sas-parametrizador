import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class CSVService {
    public saveDataInCSV(data: Array<any>, delimiter: ',' | ';' = ';'): string {
        if(data.length == 0) { return ''; }
    
        let propertyNames = Object.keys(data[0]);
        let rowWithPropertyNames = propertyNames.join(delimiter) + '\n';
    
        let csvContent = rowWithPropertyNames;
    
        let rows: string[] = [];
    
        data.forEach((item) => {
          let values: string[] = [];
    
          propertyNames.forEach((key) => {
            let val: any = item[key];
    
            if(val !== undefined && val !== null) { val = new String(val); }
            else { val = ''; }

            values.push(val);
          });

          rows.push(values.join(delimiter));
        });

        csvContent += rows.join('\n');
    
        return csvContent;
    }
    
    public importDataFromCSV(csvText: string, delimiter: ',' | ';' = ';'): Array<any> {
        const propertyNames = csvText.slice(0, csvText.indexOf('\n')).trim().split(delimiter);
        const dataRows = csvText.slice(csvText.indexOf('\n') + 1).trim().split('\n');
    
        let dataArray: any[] = [];

        dataRows.forEach((row) => {
          let values = row.split(delimiter);
    
          let obj: any = new Object();
    
          for(let index = 0; index < propertyNames.length; index++) {
            const propertyName: string = propertyNames[index];
    
            let val: any = values[index] != null ? values[index].trim() : values[index];

            if (val === '') { val = null; }
    
            obj[propertyName] = val;
          }
    
          dataArray.push(obj);
        });
    
        return dataArray;
    }
}
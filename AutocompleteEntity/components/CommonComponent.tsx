/* eslint-disable @typescript-eslint/no-explicit-any */
 import * as React from 'react';
let recordSetValue:any = [];

 const CommonComponent = ()=>{
    return(
        <>
        
        </>
    )
 }

 export const getFetchXml = (pagingCookie=null)=>{
      


 }


    // const parser = new DOMParser();
                // const xmlDoc = parser.parseFromString(modifiedXml, "application/xml");

                // // Extract entity name
                // const entityName1 = xmlDoc.getElementsByTagName("entity")[0].getAttribute("name");

                // // Extract attributes
                // const attributes = Array.from(xmlDoc.getElementsByTagName("attribute"))
                //     .map(attr => attr.getAttribute("name"));


export const mapEntityresult  = (data:any,entityName:any):any=>{
    recordSetValue = [];
    data.forEach((record:any) => {
        const newRecord:any = {
            id: record[`${entityName}id`],
            Action: 'Add',
            isBlue: 'No',
        };
        Object.keys(record).forEach(key => {
            if (key !== `${entityName}id` && key !== 'Action' && key !== 'isBlue') {
                newRecord[key] = record[key];
            }
        });
        recordSetValue.push(newRecord);
    })

    return recordSetValue;
}


export const mapColumns = ():any=>{

}
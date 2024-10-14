/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { useState } from 'react';
import { ComboBox, IComboBox, IModalProps, nullRender, SelectionMode, type IComboBoxOption, type IComboBoxStyles } from '@fluentui/react';
import { IInputs } from './generated/ManifestTypes';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { Toggle } from '@fluentui/react/lib/Toggle';
import { ContextualMenu } from '@fluentui/react/lib/ContextualMenu';
import { useBoolean } from '@fluentui/react-hooks';
import './main.css';
import { DetailsList, IColumn, DetailsListLayoutMode } from '@fluentui/react';
import { mergeStyles } from '@fluentui/react/lib/Styling';
import { mapEntityresult } from './components/CommonComponent';
import {Entity,View} from './components/ModelComponent';


//Roshan Pandey is a good boy
// const dragOptions = {
//     moveMenuItemText: 'Move',
//     closeMenuItemText: 'Close',
//     menu: ContextualMenu,
// };

// const dialogContentProps = {
//     type: DialogType.normal,
//     title: 'Entity View Selection',
//     subText: 'Do you want to send this message without a subject?',
// };

// const modalPropsStyles = { main: { maxWidth: '800px', width: '100%' }, };
// const customDialogClass = mergeStyles({
//     maxWidth: '800px', // Desired maximum width
//     width: '100%', // Ensure full width within the maxWidth
//     '@media (min-width: 400px)': {
//         maxWidth: '700px', // Responsive adjustment
//     },
// });
const comboBoxStyles: Partial<IComboBoxStyles> = { root: { minWidth: 300 } };

export interface AutoCompleteEntityComponentProps {
    label: string;
    entities: Entity[];
    onChanges: (newValue: string | undefined) => void;
    context: ComponentFramework.Context<IInputs>
}

export const AutoCompleteEntityComponent = React.memo((props: AutoCompleteEntityComponentProps) => {
    const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const openDialog = () => setIsDialogOpen(true);
    const closeDialog = () => setIsDialogOpen(false);
    const [option, setOptions] = useState<IComboBoxOption[]>([]);
    const [optionV, setOptionVs] = useState<IComboBoxOption[]>([]);
    // const [filtoption, setFiltOptions] = useState<IComboBoxOption[]>([]);
    // const [value, setValue] = useState<string | null>();
    // const [key, setKey] = useState<string | number | null>();
    const entitySetValues: IComboBoxOption[] = [];
    const viewSetValues: IComboBoxOption[] = [];
    const [isView, setIsView] = useState(true);
    const [entityName, setEntityName] = useState<string>('');
    const [viewName, setViewName] = useState('');
    // const [recordsName, setRecordsName] = useState('');
    const [records, setRecords] = useState<any>([]);
    const [finalRecords, setFinalRecords] = useState<any>([]);
    let recordSetValue: any = [];
    const [isRecord, setISRecord] = useState(false);
    const [fieldName, setFieldName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isAllLoading, setIsAllLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    // const [count, setCount] = useState(10);
    // const [pagingCookie, setPagingCookie] = useState<string | null>(null);
    // const [hasMoreRecords, setHasMoreRecords] = useState(true);
    const [isNext,setIsNext] = useState(true);
    const[currentp,setCurrentP] = useState(1);
    const [isPrev,setIsPrev] = useState(false);
 //new
 let allRecords:any = [];
 let currentPage = 1; // Track the current page
const recordsPerPage = 10;


    let vname = '';
    let fname = '';
    let recordData :any = [];
    let finalRecordData :any = [];
    // const columns: IColumn[] = [
    //     {
    //         key: 'column1',
    //         name: 'Action',
    //         fieldName: 'Action',
    //         minWidth: 50,
    //         maxWidth: 200,
    //         isMultiline: false,
    //         onRender: (item: Record) => (
    //             <button onClick={() => setTextField(item)} style={{ background: (item.isBlue == 'Yes') ? 'Green' : 'Blue', color: 'White' }}>Add</button>
    //         ),
    //     },
    //     {
    //         key:'column2', name:'Name'
    //         , fieldName:
    //             'name'
    //         , minWidth:
    //             50
    //         , maxWidth:
    //             200
    //         , isMultiline: false
    //     },
    //     {
    //         key:'column2', name:'Telephone'
    //         , fieldName:
    //             'telephone1'
    //         , minWidth:
    //             50
    //         , maxWidth:
    //             200
    //         , isMultiline: false
    //     }
    // ];
    // const columns :IColumn[] = [];
    const [columns, setColumns] = useState<any>([]);
    // const modalProps = React.useMemo(
    //     () => ({
    //         styles: modalPropsStyles,
    //     }),
    //     [],
    // );

    React.useEffect(() => {
        if (props.label) {
            setIsAllLoading(true);
            console.log(props.label);
            const oldValues = props.label.split(',');
            setFieldName(oldValues[2]);
            fname = oldValues[2];
            setEntityName(oldValues[0]);
            fetchAndMapViews(oldValues[0]);
            setViewName(oldValues[1]);
            setIsView(false);
            fetchViesAndRecords(oldValues[0], oldValues[1]);
            setIsAllLoading(false);

        }
        mapEntites(props.entities);
        setOptions(entitySetValues);


    }, [])

    const mapEntites = (data: Entity[]) => {
        if (data.length > 0) {
            data.forEach((d) => {
                entitySetValues.push({
                    text: d.text, key: d.key
                })
            })
        }
    }

    const fetchAndMapViews = async (entityName: string) => {
        try {
            setEntityName(entityName);
            const result = await props.context.webAPI.retrieveMultipleRecords("savedquery", `?$filter=returnedtypecode eq '${entityName}'`);
            if (result.entities.length > 0) {
                setIsView(false);
            }
            result.entities.forEach((d) => {
                viewSetValues.push({
                    text: d.name, key: d.savedqueryid
                })
            })

            setOptionVs(viewSetValues);
            setIsView(false);
        } catch (error) {
            console.error(error);
        }

    }

    const mapForButtonColor = () => {
        recordSetValue.forEach((d: any) => {
            if(d.name==undefined){
                if(d.fullname==fname){
                    d.isBlue = 'Yes';
                }
            }
            else{
                if(d.name==fname){
                    d.isBlue = 'Yes';
                }
            }
        });
    }

    const mapColumns = (keys: any) => {
        const columns = [];
        columns.push({
            key: 'column1',
            name: 'Action',
            fieldName: 'Action',
            minWidth: 50,
            maxWidth: 200,
            isMultiline: false,
            onRender: (item: any) => (
                <button onClick={() => setTextField(item)} style={{ background: (item.isBlue == 'Yes') ? 'Green' : '#1468fb', color: 'White' }}>Add</button>
            ),
        })
        const col = 'column';
        let count = 2;
        for (let i = 1; i < keys.length; i++) {
            if (!keys[i].includes('id')) {
                let column = '';
                column = col + count;
                columns.push({
                    key: column,
                    name: keys[i]?.toString().charAt(0).toUpperCase() + keys[i]?.toString().slice(1),
                    fieldName: keys[i]?.toString() || '',
                    minWidth: 50,
                    maxWidth: 200,
                    isMultiline: false
                })
                count = count + 1;
            }
        }
        setColumns(columns);
    }

    const handleEntityChange = (event: React.FormEvent<IComboBox>, option?: IComboBoxOption) => {
        setCurrentP(1);
        currentPage = 1;
        setIsLoading(true);
        setIsPrev(false);
        setIsNext(true);
        allRecords = [];
        setIsView(true);
        fetchAndMapViews(option?.text.toString() || '');
        // props.onChanges(option?.text);

    };

    const fetchViesAndRecords = async (entityName: string, viewid: any) => {
        try {
            setIsNext(true);
            setIsLoading(true);
            const fvalue = entityName + ',' + viewid;
            // setValue(fvalue);
            const viewResult = await props.context.webAPI.retrieveRecord("savedquery", viewid);
            if (viewResult.fetchxml) {
               
              const data = await fetchRecords(entityName,viewid,currentPage);

                if (data.length > 0) {
                    if(data.length<10){
                        setIsNext(false);
                    }
                    const keys = Object.keys(data[0]);
                    recordSetValue = mapEntityresult(data, entityName);

                    mapColumns(keys);
                    setFinalRecords(recordSetValue);
                    finalRecordData     = recordSetValue;
                    mapForButtonColor();
                    setIsLoading(false);
                    setISRecord(true);
                    recordData = recordSetValue;
                    setRecords(recordSetValue);
                }

            }
        } catch (error) {
            console.error(error);
        }
    }
    const searchAndFilter = () => {
        if (searchText != '') {
            recordSetValue = [];
            recordSetValue = (searchText.length < 4) ? finalRecords.filter((element:any) => element.name == searchText || element.name.toLowerCase().startsWith(searchText.toLowerCase())) :
                finalRecords.filter((element:any) => element.name == searchText || element.name.toLowerCase().includes(searchText.toLowerCase()));
            mapForButtonColor();
            setRecords(recordSetValue);
        }
        else {
            recordSetValue = finalRecords;
            mapForButtonColor();
            setRecords(recordSetValue);
        }
    }
    const setTextField = (textName: any) => {
        const fillName  = (textName.name==undefined)?textName.fullname:textName.name;
        setFieldName(fillName);
        const frt = entityName + ',' +vname + ',' +fillName;
        props.onChanges(frt);
        recordSetValue = [];
        recordSetValue = recordData;
        recordSetValue.forEach((d: any) => {
            d.isBlue = ((d.name==undefined)?d.fullname:d.name == fillName) ? 'Yes' : 'No';
        })
       recordData = recordSetValue;
        
        setRecords(recordSetValue);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // const getFetchXml = (baseFetchXml: any, pagingCookie: any) => {
    //     let modifiedFetchXml = baseFetchXml.replace('<fetch', '<fetch  count="10"');
         
    //     if (pagingCookie) {
    //         modifiedFetchXml = modifiedFetchXml.replace('</fetch>', `<paging-cookie>${pagingCookie} </paging-cookie></fetch>`);
    //     }

    //     return modifiedFetchXml;
    // };

    // const nextRecords = () => {
    //     fname = props.label.split(',')[2];
    //     fetchViesAndRecords(entityName, viewName);
    // }

    const setSort = () => {
        setIsLoading(true);
        setRecords([]);
        const m = records.sort((a:any, b:any) => {
            if (a.name < b.name) {
                return 1;
            }
            if (a.name > b.name) {
                return -1;
            }
            return 0;
        });
        setRecords(m);
        setIsLoading(false);
    }



    const onDialogClick = () => {

    }

    const handleViewChange = (event: React.FormEvent<IComboBox>, option?: IComboBoxOption) => {
        setIsLoading(true);
        console.log(option?.key);

        setViewName(option?.key.toString() || '');
        vname = option?.key.toString()||'';
        console.log(viewName);
        const p = optionV.find(d => d.key == viewName);
        fetchViesAndRecords(entityName, option?.key.toString());

    };
    function handleInputChnage(text: string): void {
        //         if(text.toString()==''){
        //             const optionSet = props.options;
        //           if(optionSet){

        //           optionSet.forEach(d=>{
        //             optionSetvalue.push({
        //             text:d.Label,key:d.Value
        //            })
        //         })
        //    }
        //             setOptions(optionSetvalue);
        //         }
        //         else{
        //             const optionSet = props.options;
        //    if(optionSet){
        //     optionSet.forEach(d=>{
        //         optionSetvalue.push({
        //             text:d.Label,key:d.Value
        //         })
        //     })
        //    }
        //             const t:string = text.toString()||'';
        //             const op = optionSetvalue.filter((option1) =>
        //                 option1.text.toLowerCase().startsWith(t)
        //             );
        //             setOptions(op); 
        //         }
    }

////new logic implemented

function getFetchXml1(originalFetchXml:any, pagingCookie:any) {
    const domParser = new DOMParser();
    const fetchXmlDocument = domParser.parseFromString(originalFetchXml, "text/xml");

    if (pagingCookie) {
        const fetchElement = fetchXmlDocument.getElementsByTagName("fetch")[0];
        fetchElement.setAttribute("paging-cookie", pagingCookie);
    }

    const xmlSerializer = new XMLSerializer();
    return xmlSerializer.serializeToString(fetchXmlDocument);
}

 const fetchRecords = async (entityName:any, viewid:any, page:any)=> {
    const viewResult = await props.context.webAPI.retrieveRecord("savedquery", viewid);

    if (viewResult.fetchxml) {
        let pagingCookie = null; 
        let hasMoreRecords = true; 

        while (hasMoreRecords) {
            const modifiedXml = getFetchXml1(viewResult.fetchxml, pagingCookie);
            const recordsResult = await props.context.webAPI.retrieveMultipleRecords(entityName, `?fetchXml=${encodeURIComponent(modifiedXml)}`);

            allRecords = allRecords.concat(recordsResult.entities);

            if ((recordsResult as any).fetchXmlPagingCookie) {
                pagingCookie = (recordsResult as any).fetchXmlPagingCookie;
            } else {
                hasMoreRecords = false; 
            }
        }

        const startIndex = (page - 1) * recordsPerPage;
        const paginatedRecords = allRecords.slice(startIndex, startIndex + recordsPerPage);

        if (paginatedRecords.length > 0) {
            const keys = Object.keys(paginatedRecords[0]);
            console.log(paginatedRecords); // Do something with the paginated records
            return paginatedRecords; // Return paginated records
        } else {
            console.log("No records found for the current page.");
            return [];
        }
    }
}

async function handleNext() {
    currentPage  = currentp;
    currentPage = currentPage+1; // Increment the page number
    setCurrentP(currentPage);
    setIsPrev(true);
    fetchViesAndRecords(entityName,viewName);
}

const handlePreviousNext = async ()=>{
    currentPage  = currentp;
    currentPage = currentPage-1;
    if(currentPage==1){setIsPrev(false)}
    setCurrentP(currentPage);
    fetchViesAndRecords(entityName,viewName);
}

    return (
        <>
            <div>
                <input type="text" placeholder="Enter Account Name" onClick={openDialog} value={fieldName} />
            </div>

            <Dialog
                hidden={!isDialogOpen}
                onDismiss={closeDialog}
                // modalProps={modalProps}
                styles={{
                    main: {
                        selectors: {
                            ['@media (min-width: 480px)']: {
                                minWidth: 450,
                                maxWidth: '1000px',
                                width:'1000px',
                                padding:'30px'
                            }
                        }
                    }
                }}
            >
                <div className='dialog_container'>
                    <div className='main-head dflex'>
                        <h1 className='head'>Entity And Views Selection</h1>
                        <p onClick={closeDialog} className='cld sbutton'>X</p>
                    </div>
                </div>

                <div className='main_conainer'>
                    {isAllLoading ? <p>All Loading .........</p> :
                        <div className='input_ele'>
                            <ComboBox
                                label='Entity'
                                options={option}
                                styles={comboBoxStyles}
                                allowFreeInput
                                autoComplete="on"
                                onChange={handleEntityChange}
                                onInputValueChange={handleInputChnage}
                                selectedKey={entityName}
                                style={{ marginTop: '50px' }}
                            />

                            {isView ? <p>Need to select Entity and wait .....</p> :
                                <ComboBox
                                    label='View'
                                    options={optionV}
                                    styles={comboBoxStyles}
                                    allowFreeInput
                                    autoComplete="on"
                                    onChange={handleViewChange}
                                    onInputValueChange={handleInputChnage}
                                    style={{ display: isView ? 'none' : 'block' }}
                                    selectedKey={viewName}
                                />
                            }
                            <div className='listRecords' style={{ display: isRecord ? 'block' : 'none' }}>
                                <h1 className='head mt-15'>Data Records</h1>
                                {isLoading ? <p className='mt-15'>Loading.......</p> :
                                    <div>
                                        <div className='search_text dflex mt'>
                                            <input className='isearch' type='text' value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder='Enter Name Text ' />
                                            <button onClick={searchAndFilter} className='mbutton'>Search</button>
                                        </div>

                                        <DetailsList
                                            items={records}
                                            columns={columns}
                                            setKey="set"
                                            isHeaderVisible={true}
                                            selectionMode={SelectionMode.none}
                                        // onItemInvoked={setTextField} // Add the click handler here
                                        />
                                        <div className='paging-main'>
                                            <div className='crm'>
                                            <p className='currp'>Page Number Is: {currentp}</p>
                                            </div>
                                            <div className='button1'>
                                            <button onClick={handlePreviousNext} className='mbutton' style={{display:isPrev?'block':'none'}}>Prvious</button>
                                            <button onClick={handleNext} className='mbutton' style={{display:isNext?'block':'none'}}>Next</button>
                                            </div>
                                        </div>
                                    </div>

                                }
                            </div>
                        </div>
                    }
                </div>
            </Dialog>

        </>



    );

});
AutoCompleteEntityComponent.displayName = 'AutoCompleteEntityComponent';
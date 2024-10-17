/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { Dialog, DialogType, DialogFooter, DefaultButton, ComboBox, setIconOptions, IComboBoxStyles, IComboBox, IComboBoxOption, DetailsList, SelectionMode, Icon } from '@fluentui/react';
import { useState, useEffect } from 'react';
import { text } from 'stream/consumers';
const comboBoxStyles: Partial<IComboBoxStyles> = { root: { minWidth: 300 } };
import './style.css';
export const FilterComponent: React.FC<any> = ({ isopen, onClose, handlFilterData, initialData }) => {

    const [allData, setAllData] = useState<any>([]);
    const [columnOptions, setColumnoptions] = useState<any>([]);
    const [conditionOption, setConditionOption] = useState<any>([{ text: 'Equals', key: 'Equals' }, { text: 'Contains', key: 'Contains' }]);
    const [value, setValue] = useState('');
    const [finalData, setFinalData] = useState<any>();
    const finalCondition = { name: '', condition: '', value: '', isFilter: false };
    const [name, setName] = useState('');
    const [condition, setCondition] = useState('');
    const [isFilter, setIsFilter] = useState(true);
    let allFilteroptions: any = [];
    const [filterOptions, setFilterOptions] = useState<any>([]);
    const columnData: any = [];

    useEffect(() => {
        setAllData(initialData);
        console.log(initialData);
        for (let i = 1; i < initialData.length; i++) {
            columnData.push({
                text: initialData[i].name, key: initialData[i].name
            })
        }

        setColumnoptions(columnData);
    }, []);
    const apply = () => {
        setIsFilter(true);
        handlFilterData(filterOptions, isFilter);
        onClose();
    }

    const cancel = () => {
        onClose();
    }

    const clearFilter = () => {
        //finalCondition.isFilter = false;
        setIsFilter(false);
        setFinalData(finalCondition);
        setFilterOptions([]);
        handlFilterData(filterOptions, isFilter);
        onClose();
    }
    const handleName = (event: React.FormEvent<IComboBox>, option?: IComboBoxOption) => {
        finalCondition.name = option?.text.toString() || '';
        setName(option?.text.toString() || '');

    };

    const handlCondition = (event: React.FormEvent<IComboBox>, option?: IComboBoxOption) => {
        finalCondition.condition = option?.text.toString() || '';
        setCondition(option?.text.toString() || '');
    };

    const handleValueChange = (e: any) => {
        const pr = e.target.value;
        setValue(e.target.value);
        finalCondition.value = pr;
        finalCondition.name = name;
        finalCondition.condition = condition;
        finalCondition.isFilter = true;
        setFinalData(finalCondition);
        console.log(finalCondition);

    }

    const addFilterOptions = () => {
        if (finalData.name != '' && finalData.condition != '' && finalData.value != '') {
            allFilteroptions = [];
            allFilteroptions = filterOptions;
            allFilteroptions.push({ column: finalData.name, condition: finalData.condition, value: finalData.value, Action: 'Delete' });
            setFilterOptions(allFilteroptions);
            finalCondition.name = '';
            finalCondition.condition = '';
            finalCondition.value = '';
            setName('');
            setCondition('');
            setValue('');
        }
    }

    const columns = [{ key: 'column1', name: 'FieldName', fieldName: 'column', minWidth: 50, maxWidth: 200, isMultiline: false },
    { key: 'column2', name: 'Condition', fieldName: 'condition', minWidth: 50, maxWidth: 200, isMultiline: false },
    { key: 'column3', name: 'Value', fieldName: 'value', minWidth: 50, maxWidth: 200, isMultiline: false },
    {
        key: 'column4',
        name: 'Action',
        fieldName: 'Action',
        minWidth: 50,
        maxWidth: 200,
        isMultiline: false,
        onRender: (item: any) => (
            <Icon
                iconName="Delete"
                className='icnf'
                onClick={() => deleteOptions(item)}
            />
        ),
    }
    ]

    const deleteOptions = (item: any) => {
        allFilteroptions = [];
        allFilteroptions = filterOptions;
        allFilteroptions = allFilteroptions.filter((d: any) => d.column != item.column);
        setFilterOptions(allFilteroptions);
    }

    const setAsDefault = () => {
        setFilterOptions([]);
        finalCondition.name = '';
        finalCondition.condition = '';
        finalCondition.value = '';
        setName('');
        setCondition('');
        setValue('');
    }
    return (

        <>
            <Dialog
                hidden={!isopen}
                onDismiss={onClose}
                styles={{
                    main: {
                        selectors: {
                            ['@media (min-width: 480px)']: {
                                minWidth: 150,
                                maxWidth: '1000px',
                                width: '1000px',
                                padding: '30px'
                            }
                        }
                    }
                }}
            >
                <div className='clr dflex'>
                    <p className='link' onClick={clearFilter}>Clear All Filter</p>
                    <p className='link' onClick={setAsDefault}>Set filter As Default</p>
                </div>
                <div className='dflex'>
                    <ComboBox
                        label='Column Name'
                        options={columnOptions}
                        styles={comboBoxStyles}
                        allowFreeInput
                        autoComplete="on"
                        onChange={handleName}
                        // onInputValueChange={handleInputChnage}
                        // style={{ display: isView ? 'none' : 'block' }}
                        selectedKey={name}
                    />
                    <ComboBox
                        label='Condition'
                        options={conditionOption}
                        styles={comboBoxStyles}
                        allowFreeInput
                        autoComplete="on"
                        onChange={handlCondition}
                        // onInputValueChange={handleInputChnage}
                        // style={{ display: isView ? 'none' : 'block' }}
                        selectedKey={condition}
                    />
                    <div className='inpt'>
                        <p className='txt'>Value</p>
                        <input type='text' value={value} onChange={handleValueChange} className='inptxt w-266' />
                    </div>
                </div>

                <div className='addfilter' style={{ display: filterOptions.length > 0 ? 'block' : 'none' }}>
                    <DetailsList
                        items={filterOptions}
                        columns={columns}
                        setKey="set"
                        isHeaderVisible={true}
                        selectionMode={SelectionMode.none}
                    // onItemInvoked={setTextField} // Add the click handler here
                    />
                </div>
                <div className='addfilter'>
                    <button onClick={addFilterOptions} className='btn'>+ Add</button>
                </div>


                <div className='disb'>
                    <button onClick={apply} className='btn'>Apply</button>
                    <button onClick={cancel} className='btn'>Cancel</button>
                </div>

            </Dialog>
        </>
    )
}
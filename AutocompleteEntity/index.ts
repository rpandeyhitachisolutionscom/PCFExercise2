import * as ReactDOM from "react-dom";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import {AutoCompleteEntityComponent} from './AutoCompleteEntityComponent';

interface Entity{
    text:string,
    key:string
}

interface View{
    text:string,
    key:string
}
export class AutocompleteEntity implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    notifyOutputChanged: () => void;
    rootContainer: HTMLDivElement;
    selectedValue: string | null;
    context: ComponentFramework.Context<IInputs>;   
   private Entities:Entity[]   = [];
   private Views:View[] =[]; 
    constructor()
    {

    }

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void
    {
        this.notifyOutputChanged = notifyOutputChanged;
        this.rootContainer = container;
        this.context = context; 
        this.fetchEntities();
    }

    onChange = (newValue: string | undefined): void => {
         this.context.parameters.value.raw = newValue||'';
         this.selectedValue = newValue||'';
        this.notifyOutputChanged();
   };

   private async fetchEntities(){
   this.Entities.push({text:'account',key:'account'},{text:'contact',key:'contact'})
   }

    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
        const { value } = context.parameters;
        if (value && value.attributes) {
            ReactDOM.render(
                React.createElement(AutoCompleteEntityComponent, {
                    label: value.raw||'',
                    entities: this.Entities,
                    onChanges: this.onChange,
                    context:this.context
                }),
                this.rootContainer,
            );
        }
    }

 
    public getOutputs(): IOutputs
    {
        return { value: this.selectedValue } as IOutputs;
    }

 
    public destroy(): void
    {
        ReactDOM.unmountComponentAtNode(this.rootContainer);
    }
}

import * as React from 'react';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { ChoiceGroup } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import {
    DatePicker,
    DayOfWeek,
    IDatePickerStrings
} from 'office-ui-fabric-react/lib/DatePicker';
import {
  TextField
} from 'office-ui-fabric-react/lib/TextField';
import { Dropdown, IDropdown, DropdownMenuItemType, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Mileage } from './Mileage';
  //import { BaseComponent, createRef } from 'office-ui-fabric-react/lib/Utilities';
//   import './DatePicker.Examples.scss';

  const DayPickerStrings: IDatePickerStrings = {
    months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  
    shortMonths: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  
    days: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
  
    shortDays: ['S','M','T','W','T','F','S'],
  
    goToToday: 'Go to today',
    prevMonthAriaLabel: 'Go to previous month',
    nextMonthAriaLabel: 'Go to next month',
    prevYearAriaLabel: 'Go to previous year',
    nextYearAriaLabel: 'Go to next year',
  
    isRequiredErrorMessage: 'Field is required.',
  
    invalidInputErrorMessage: 'Invalid date format.'
  };
  
   export interface IFieldsValue {
     firstDayOfWeek?: DayOfWeek;
     DateMileage:Date;
     showPanel: boolean;
     StartPoint:string;
     EndPoint:string;
     Purpose:string;
     Who:string;
     Kilometers:string;
     Department:string;
 }
 export interface IMileage {
  //Other properties
  //edit:boolean;
  saveHandler: 
  (
    MileageDate:Date,
    StartPoint:string,
    EndPoint:string,
    Purpose:string,
    Who:string,
    Kilometers:string,
    Department:string
  ) => void;
  editObject:object;
  
}

export class PanelSmallRightExample extends React.Component<IMileage, IFieldsValue> {
 
  constructor(props) {
    super(props);
    this.state = {
        firstDayOfWeek: DayOfWeek.Sunday,
        showPanel: false,
        DateMileage:new Date(),
        StartPoint:"",
        EndPoint:"",
        Purpose:null,
        Who:"",
        Kilometers:"",
        Department:"",
    };

  }
  
  public render(): JSX.Element {
   
    const { firstDayOfWeek } = this.state;
    //var a = this.props.editObject
    console.log("Edit Object",(this.props.editObject[0].ID));
  
    //var a =  this.props.editObject["AuthorId"];
    // <Mileage showPanel={()=>this._onShowPanel} />
    // if(this.props.edit === true)
    // {
    //   this._onShowPanel();
    // }
    return (
      
      <div>

        <PrimaryButton
          onClick={ this._onShowPanel }
          text='Add'
        />
        <Panel
          isOpen={ this.state.showPanel }
          type={ PanelType.smallFixedFar }
          onDismiss={ this._onClosePanel }
          headerText=''
          closeButtonAriaLabel='Close'
          onRenderFooterContent={ this._onRenderFooterContent }
        >
        <div>
          <DatePicker 
          label='Dato' 
          isRequired={ true } 
          firstDayOfWeek={ firstDayOfWeek } 
          strings={ DayPickerStrings }
          //formatDate={(Date) => Date.getDay + "." + Date.getMonth + "." + Date.getUTCFullYear}
          placeholder='Select a date...' 
          value={(this.props.editObject === null ? this.state.DateMileage : this.state.DateMileage)}
          onSelectDate={ e => {this.setState({DateMileage:e});} }
           />
          {/* <DatePicker isRequired={ true } firstDayOfWeek={ firstDayOfWeek } strings={ DayPickerStrings } placeholder='Date required with no label...' /> */}
        </div>
        <div>
          <TextField
            label='Kørt fra'
            placeholder='Angiv nøjagtig adresse...'
            required={ true }
            defaultValue={this.state.StartPoint}
            onChanged={ e => {this.setState({StartPoint:e});} }

          />
        </div>
        <div>
          <TextField
            label='Kørt til'
            placeholder='Angiv nøjagtig adresse...'
            required={ true }
            defaultValue={this.state.EndPoint}
            onChanged={ e => {this.setState({EndPoint:e})} }
          />
        </div>
        <div>
          <Dropdown
            placeHolder='Select an Option'
            label='Formål'
            id='Basicdrop1'
            ariaLabel='Basic dropdown example'
            required={ true }
            defaultValue={this.state.Purpose}
            options={
              [
                { key: 'A', text: 'Internt møde' },
                { key: 'B', text: 'Kundebesøg' },
                { key: 'C', text: 'Kursus' },
                { key: 'D', text: 'Leverandør' },
                { key: 'E', text: 'Messe' },
                { key: 'F', text: 'Partnerbesøg' },
                { key: 'G', text: 'Statusmøde' },
              ]
            }
            onChanged={ e => this.setState({ Purpose: e.text }) } 
          />
        </div>
        <div>
          <TextField
            label={this.state.Purpose === null ? 'Hvem' : this.state.Purpose}
            required={ true }
            defaultValue={this.state.Who}
            onChanged={ e => {this.setState({Who:e});} }
          />
        </div>
        <div>
          <TextField
            label='Antal kørte km.'
            required={ true }
            defaultValue={this.state.Kilometers}
            onChanged={ e => {this.setState({Kilometers:e});} }
          />
        </div>
        <div>
          <TextField
            label='Betales af afdeling'
            required={ true }
            defaultValue={this.state.Department}
            onChanged={ e => {this.setState({Department:e});} }
          />
        </div>
        </Panel>
        
      </div>
      
    );
  }

  public _onClosePanel = (): void => {
    this.setState({ showPanel: false });
    this.setState({ StartPoint:"" });
    this.setState({ EndPoint:"" });
    this.setState({ Purpose:"" });
    this.setState({ Who:"" });
    this.setState({ Kilometers:"" });
    this.setState({ Department:"" });
  }

  // public onSaveClick(){
  //   console.log("asda");
  //   //this.props.saveHandler(this.state.DateMileage,this.state.EndPoint,this.state.StartPoint,this.state.Purpose,this.state.Who,this.state.Kilometers,this.state.Department);
  //   this._onClosePanel();
  // }

  private _onRenderFooterContent = (): JSX.Element => {
    return (
      <div>
        <PrimaryButton
          onClick={ ()=> this.props.saveHandler(this.state.DateMileage,this.state.EndPoint,this.state.StartPoint,this.state.Purpose,this.state.Who,this.state.Kilometers,this.state.Department)}
          style={ { 'marginRight': '8px' } }
        >
          Gem
        </PrimaryButton>
        <DefaultButton
          onClick={ this._onClosePanel }
        >
          Annuller
        </DefaultButton>
      </div>
    );
  }
  

  public _onShowPanel = (): void => {
    this.setState({ showPanel: true });
    //console.log("called");
    
  }
}
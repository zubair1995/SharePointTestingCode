import * as React from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DetailsList, DetailsListLayoutMode, Selection, IColumn, SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import { IMileageProps } from './IMileageProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions} from '@microsoft/sp-http'; 
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { PanelSmallRightExample } from './Panel';
import { BaseComponent, createRef } from 'office-ui-fabric-react/lib/Utilities';

const exampleChildClass = mergeStyles({
  display: 'block',
  marginBottom: '10px'
});

export interface IMileageItem {
  ID: number;
  SGDDAppDate: string;
  MileageStartPoint: string;
  MileageEndPoint:string;
  SGDDAppStatus:string;
  MileageKilometers:number;
  
}

export interface IMileageState {
  items: IMileageItem[];
  //selectionDetails: {};
  btnDisabled:boolean;
  itemId:number;
  loading:boolean;
  editItem:object;

}

export class Mileage extends React.Component<IMileageProps,IMileageState> {
  private _selection: Selection;
  private _allItems: IMileageItem[];
  private _columns: IColumn[];
  private showPanel;
  //private editItem:{};

  constructor() {
    super();
    this._allItems = [];
    this.showPanel = createRef();

    this._columns = [
      { key: 'column11', name: '', fieldName: '', minWidth: 20, maxWidth: 20, isResizable: true,
      onRender: (item) => (
        <i onClick={() => {this.editHandler(item)}} className="ms-Icon ms-Icon--EditSolid12 EditIcon" style={{cursor: 'pointer'}} aria-hidden="true"></i>
     ),
     },
     { key: 'column12', name: '', fieldName: '', minWidth: 20, maxWidth: 20, isResizable: true,
     onRender: (item) => (
       <i onClick={() => { this.deleteItem(item.ID); }} className="ms-Icon ms-Icon--Delete DeleteIcon" style={{cursor: 'pointer'}} aria-hidden="true"></i>
    ),
    },
      { key: 'column1', name: '#', fieldName: 'ID', minWidth: 50, maxWidth: 50, isResizable: true },
      { key: 'column2', name: 'Dato', fieldName: 'SGDDAppDate', minWidth: 100, maxWidth: 100, isResizable: true },
      { key: 'column3', name: 'Kørt fra', fieldName: 'MileageStartPoint', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column4', name: 'Kørt til', fieldName: 'MileageEndPoint', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column5', name: 'Formål', fieldName: 'MileagePurpose', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column6', name: 'Hvem', fieldName: 'MileageCustomer', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column7', name: 'Antal kørte km.', fieldName: 'MileageKilometers', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column8', name: 'Betales af afdeling', fieldName: 'MileageForOtherDepartment', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column9', name: 'Godkendt', fieldName: '', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column10', name: 'Sendt til løn afd.', fieldName: 'MileageDateProcessed', minWidth: 100, maxWidth: 200, isResizable: true },

    ];

    this._selection = new Selection({
      //onSelectionChanged: () => this.setState({ selectionDetails: this._getSelectionDetails() })
      onSelectionChanged: () => this._getSelectionDetails()
    });

    this.state = {
      items: this._allItems,
      //selectionDetails: this._getSelectionDetails(),
      btnDisabled:true,
      itemId:0,
      loading: false,
      editItem:null
    };
    
  }


  public componentDidMount(){    
    var reactHandler = this;   
    var requestUrl="https://sharepoint19-test.sgdd.dk/mileage/_api/web/lists/GetByTitle('Kørselsafregning')/items?$filter=AuthorId eq 1689" 
    this.props.ClientContext.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1)  
    .then((response: SPHttpClientResponse) => {  
        if (response.ok) {  
            response.json().then((responseJSON) => {  
                if (responseJSON!=null && responseJSON.value!=null){  
                   responseJSON.value.forEach((item, index, arr) => {
                    if(item.SGDDAppDate){
                      let d = new Date(item.SGDDAppDate);
                      let hours = d.getUTCHours();                      
                      if(hours >= 22){
                        d.setUTCHours(24);
                      }
                      let DatoValue = d.toISOString();  				
                      let DateArray : string[] = DatoValue.split("T");
                      let getdataval = DateArray[0].trim();
                      let getdatavalue : string[] = getdataval.split("-");
                      item.SGDDAppDate = getdatavalue[0] + '-' + getdatavalue[1] + '-' + getdatavalue[2];
                      arr[index].SGDDAppDate = item.SGDDAppDate;
                    }
                    
                  });
                    reactHandler.setState({    
                     items: responseJSON.value   
                   });        
                }  
            });  
        }  
    }); 
  }

  editHandler = (item) => {
    this.showPanel.current._onShowPanel();
    console.log(item.Purpose)
    console.log(item.ID)
    this.setState({editItem:item});

    //console.log(this.editItem as IFieldsValue[]);

  }

  public render(): JSX.Element {
    const { items, btnDisabled, loading } = this.state;
    const loadingStyles = {
      opacity: loading ? 0.6 : 1,
    }
    return (
      
      <Fabric>
        <div className="ms-Grid">
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm4 ms-md4 ms-lg4">
                <PanelSmallRightExample ref={this.showPanel} editObject={this.state.editItem} saveHandler ={(MileageDate,StartPoint,EndPoint,Purpose,Who,Kilometers,Department)=>this.createItem(MileageDate,StartPoint,EndPoint,Purpose,Who,Kilometers,Department)}

                />
            </div>
            <div className="ms-Grid-col ms-sm4 ms-md4 ms-lg4">        
              {/* <PrimaryButton
              text='Delete'
              disabled={btnDisabled}
              onClick={() => this.deleteItem(this.state.itemId)}
            /> */}
            </div>
            <div className="ms-Grid-col ms-sm4 ms-md4 ms-lg4">        
            {/* <PrimaryButton
              text='Edit'
              disabled={btnDisabled}
              onClick={this.editHandler}

            /> */}
            </div>
          </div>
        </div>
        
          <DetailsList
            items={items}
            columns={this._columns}
            setKey={(items.filter(item=>item.ID)).toString()}
            key={(items.filter(item=>item.ID)).toString()}
            layoutMode={DetailsListLayoutMode.justified}
            selectionMode={SelectionMode.none}
            //selection={this._selection}
            //selectionPreservedOnEmptyClick={true}
            ariaLabelForSelectionColumn="Toggle selection"
            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
            //checkButtonAriaLabel="Row checkbox"
            //onItemInvoked={this._onItemInvoked}
            //onActiveItemChanged={this._onItemInvoked}
          />
      </Fabric>
    );
  }

  private _onFilter = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string) : void => {
    this.setState({
      items: text ? this._allItems.filter(i => i.SGDDAppStatus.toLowerCase().indexOf(text) > -1) : this._allItems
    });
  };

  private _getSelectionDetails(): void {
    const selectionCount = this._selection.getSelectedCount();
    var selectedItem = this._selection.getSelection();
    //console.log((selectedItem[0] as IMileageItem).ID);

    if (selectionCount === 1){
      this.setState({btnDisabled:false});
    }
    else
      this.setState({btnDisabled:true});

    if(selectedItem != undefined || selectedItem.length != 0){
      let ID = (selectedItem[0] as IMileageItem).ID;
      this.setState({itemId:ID});
    }
  }

  public createItem = (MileageDate:Date,StartPoint:string,EndPoint:string,Purpose:string,Who:string,Kilometers:string,Department:string): void => {
    console.log(StartPoint);
    const body: string = JSON.stringify({  
      'SGDDAppDate': MileageDate,
      'MileageStartPoint': StartPoint,
      'MileageEndPoint': EndPoint,
      'MileageKilometers': Kilometers,
      'SGDDAppStatus': 'kladde',
      'MileagePurpose': Purpose,
      'MileageCustomer': Who,
      'MileageForOtherDepartment': Department,
      'SGDDCreatedByOS': this.getOS(),
      'SGDDCreatedByOSVersion': this.getOSVersion()
    });
    //  console.log(body); 
    this.props.ClientContext.spHttpClient.post(`https://sharepoint19-test.sgdd.dk/mileage/_api/web/lists/GetByTitle('Kørselsafregning')/items?`,  
    SPHttpClient.configurations.v1,  
    {  
      headers: {  
        'Accept': 'application/json;odata=nometadata',  
        'Content-type': 'application/json;odata=nometadata',  
        'odata-version': ''  
    },  
    body: body  
    }).then((response: SPHttpClientResponse)=>{
      // this.setState({
      //   items: this.state.items.concat()
      // })
      console.log(JSON.stringify(response));
    });
  }    

  public deleteItem(id: number): Promise < any > {
    this.setState({loading: true})
    let url: string = "https://sharepoint19-test.sgdd.dk/mileage/_api/web/lists/GetByTitle('Kørselsafregning')/items(" + id + ")";
    return this.props.ClientContext.spHttpClient.post(url,
      SPHttpClient.configurations.v1, {
        headers: {
          'Accept': 'application/json;odata=nometadata',
          'Content-type': 'application/json;odata=verbose',
          'odata-version': '',
          'IF-MATCH': "*",
          'X-HTTP-Method': 'DELETE'
        }
      }).then((response): void => {
        this.setState(state => ({
          items: state.items.filter(item => item.ID !== id),
          loading: false,
        }))        
  
    }, (error: any): void => {
      console.log("Error deleting item", error);
    });
  }

  private getOSVersion() {
    var getfullversion  = window.navigator.appVersion;
    var getversion = getfullversion.split(" ");
    var getfinalversion="";
    if(getversion.indexOf("MSIE") > -1 || getversion.indexOf("Trident/7.0;") > -1)
      getfinalversion=getversion[6];

    else
        getfinalversion=getversion[3];

    //console.log(getfinalversion);
    var getNewversion= getfinalversion.split(";");
    var getNewfinalVersion =getNewversion[0];
     
    return getNewfinalVersion;
  }
  

  private getOS() {

    var userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
        os = null;
  
    if (macosPlatforms.indexOf(platform) !== -1) {
      os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = 'Windows';
    } else if (/Android/.test(userAgent)) {
      os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
      os = 'Linux';
    }
  
    return os;
  }

}

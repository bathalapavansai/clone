import { getRecord,createRecord } from 'lightning/uiRecordApi';
import { api, LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import PSLIST from '@salesforce/schema/Temporary_PS_Assignment__c.Permission1_Sets__c';
import FTL_NAME from '@salesforce/schema/Temporary_PS_Assignment__c.FTL_Name__c';
import INC_CRQ from '@salesforce/schema/Temporary_PS_Assignment__c.iTAM_Incident_CRQ_Numbner__c';
import START_DATE from '@salesforce/schema/Temporary_PS_Assignment__c.Start_Date__c';
import UsersHandler from '@salesforce/apex/ClonePSRequestsUserListController.populateUserList';
export default class ClonePSRequest extends NavigationMixin(LightningElement) {
    @api recordId;
    @api objectApiName;

    error='';
    infoRequest=[];
    newReq='';
    newReqId='';

    @wire(getRecord,{
        recordId:"$recordId",
        fields:[PSLIST,FTL_NAME,INC_CRQ]
    }) record({error,data}){
        if(data){
            this.infoRequest=data;
            console.log(`Retrieved Info of current request ${this.infoRequest}`);
        }
        else if (error){
            console.log(`Error while retrieving Info of current request ${error}`);
        }
    }
   
    handleClone(event){
        console.log(`${JSON.stringify(this.infoRequest)}`);
        let currentdatetime=new Date(new Date().getTime()+120000);
        console.log(`Current time is ${currentdatetime.toJSON()}\nPermissionsSets : ${this.infoRequest.fields.Permission1_Sets__c}`);
        let fields={
                            "Permission1_Sets__c":this.infoRequest.fields.Permission1_Sets__c.value,
                            "iTAM_Incident_CRQ_Numbner__c":this.infoRequest.fields.iTAM_Incident_CRQ_Numbner__c.value,
                            "FTL_Name__c":this.infoRequest.fields.FTL_Name__c.value,
                            "Start_Date__c":currentdatetime.toJSON()
                        };
        console.log(`${JSON.stringify(fields)}`);
        let rec={apiName:"Temporary_PS_Assignment__c",fields};
        console.log(`Submitting for creation ${rec} and ${JSON.stringify(rec)}`);               
        createRecord(rec)
        .then(req => {
            console.log(`New Requested created : ${JSON.stringify(req)}`);
            console.log(`trying to access id ---`);
            console.log(`newly created req id : ${req.id} and req name : ${req.fields.Name.value}`);
            this.newReqId=req.id;
            this.newReq=req.fields.Name.value;
            console.log(`newly created req id : ${this.newReqId} and req name : ${this.newReq}`);
            
            this.dispatchEvent(
                new ShowToastEvent({
                    "title":'Success',
                    "message":`Created ${this.newReq} successfully!`,
                    "variant":'success'
                })
            ) 
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: this.newReqId,
                    objectApiName: 'Temporary_PS_Assignment__c', // objectApiName is optional
                    actionName: 'view'
                }
            });
            if(this.newReqId!=null){
                console.log(`OldId:${this.recordId},NewId:${this.newReqId}`);
                UsersHandler({OldId:this.recordId,NewId:this.newReqId})
                .then(response=>{
                    console.log(response);
                })
                .catch(error=>{
                    console.log(error);
                }) 
            }
        })
        .catch(err =>{
            this.dispatchEvent(
                new ShowToastEvent({
                    "title":"Error!",
                    "message":`Reason : ${err.body.message}`,
                    "variant":"error",
                    "mode":"sticky"
                })
            );
        });
               
    }
    
    
}
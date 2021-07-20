import { LightningElement, track, api,wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import OBJECT from '@salesforce/schema/user'
import FIRST_NAME_FIELD from '@salesforce/schema/user.FirstName'
import LAST_NAME_FIELD from '@salesforce/schema/user.LastName'
import EMAIL_FIELD from '@salesforce/schema/user.Email'
import USERNAME_FIELD from '@salesforce/schema/user.Username'
import PROFILE_FIELD from '@salesforce/schema/user.ProfileId'
import LocaleSidKey from '@salesforce/schema/user.LocaleSidKey'
import TimeZoneSidKey from '@salesforce/schema/user.TimeZoneSidKey'
import EmailEncodingKey from '@salesforce/schema/user.EmailEncodingKey'

import { getRecord } from 'lightning/uiRecordApi';

export default class CloneUser extends LightningElement {
    @api recordId;
    @track username="";
    @track profileId="";
    @track locale="";
    @track timeZone="";
    @track emailEncoding="";
    @track openModal = false;
    
    objectFields =[FIRST_NAME_FIELD,LAST_NAME_FIELD,EMAIL_FIELD,USERNAME_FIELD];
    
    @wire(getRecord, { recordId: '$recordId', fields: [PROFILE_FIELD,LocaleSidKey,TimeZoneSidKey,EmailEncodingKey] } )
    getUserDetails ({error, data}) {
        if (error) {
            // TODO: Error handling
            console.log(`User Details : ${JSON.stringify(error)}`);
        } else if (data) {
            // TODO: Data handling
            this.profileId=data.fields.ProfileId.value;
            this.locale=data.fields.LocaleSidKey.value;
            this.timeZone=data.fields.TimeZoneSidKey.value;
            this.emailEncoding=data.fields.EmailEncodingKey.value;
            console.log(`User Details : ${JSON.stringify(data)} \n\n populated fields : ${this.profileId}\n${this.locale}\n${this.timeZone}\n${this.emailEncoding}\n`);
        }
    }

    handleModal(){
        if(this.openModal==true){
            this.handleReset();
            this.username="";
        }
        this.openModal=!(this.openModal);
    }
    populateUserName(event){    
        if(this.username == "")
        this.username=event.target.value;        
    }
    handleReset() {
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
     }
     handleSuccess(){
         this.dispatchEvent(new ShowToastEvent({
            "title":"Success",
            "message":"Submitted",
            "variant":"success"
         })
         );
     }
}
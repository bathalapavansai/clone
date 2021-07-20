public with sharing class ClonePSRequestsUserListController {
    
    @AuraEnabled
    public static String populateUserList(Id OldId,Id NewId){
        try {
            List<UserList__c> users = [select Id,User__c,Temp_Ps_Assignment__c from UserList__c where Temp_Ps_Assignment__c =:OldId ];
            List<UserList__c> newUsers= new List<UserList__c>();
            for(UserList__c u : users){
                UserList__c ul= new UserList__c();
                if(u.User__c!=null){
                    ul.User__c=u.User__c;
                    ul.Temp_Ps_Assignment__c=NewId;
                    newUsers.add(ul);
                }
            }
            Database.insert(newUsers);
            return 'Success';
        } catch (Exception e) {
            System.debug(e);
            System.debug(e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }
}

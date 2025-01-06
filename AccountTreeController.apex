/* Created By: Prem Singh Foujdar
   Date: 06-01-2025*/

public with sharing class AccountTreeController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountHierarchy() {
        try {
            return [SELECT Id, Name, ParentId FROM Account LIMIT 50];
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching accounts: ' + e.getMessage());
        }
    }
    
}

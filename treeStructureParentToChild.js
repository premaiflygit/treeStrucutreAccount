import { LightningElement, track, wire } from 'lwc';
import getAccountHierarchy from '@salesforce/apex/AccountTreeController.getAccountHierarchy';

export default class AccountTree extends LightningElement {
    @track treeItems = []; 
    @track error = null; 
    @track isLoading = true; 

    @wire(getAccountHierarchy)
    wiredAccounts({ error, data }) {
        if (data) {
            console.log('Data received:', JSON.stringify(data));
            try {
                this.treeItems = this.buildTreeWithParents(data);
                this.error = null; 
            } catch (err) {
                console.error('Error building tree:', err.message);
                this.error = 'Error building the tree structure.';
            }
            this.isLoading = false; 
        } else if (error) {
            console.error('Error fetching accounts:', error);
            this.error = 'Error fetching accounts from the server.';
            this.isLoading = false; 
        }
    }

    buildTreeWithParents(accounts) {
        if (!accounts || !Array.isArray(accounts) || accounts.length === 0) {
            console.error('Invalid or empty accounts data.');
            return [];
        }

        const accountMap = new Map();
        accounts.forEach(account => {
            if (account.Id) {
                accountMap.set(account.Id, { ...account, items: [] });
            }
        });

        const tree = [];
        accounts.forEach(account => {
            if (account.ParentId && accountMap.has(account.ParentId)) {
                accountMap.get(account.ParentId).items.push(accountMap.get(account.Id));
            } else {
                tree.push(accountMap.get(account.Id));
            }
        });

        return tree.map(account => this.createTreeNode(account));
    }

    createTreeNode(account) {
        return {
            label: account.Name,
            name: account.Id,
            items: account.items.map(child => this.createTreeNode(child))
        };
    }

    handleSelect(event) {
        const selectedId = event.detail.name;
        console.log('Selected Account Id:', selectedId);
    }
}

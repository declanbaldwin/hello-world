console.log('DB4ContactMapping');

function getContactDetails() {
    console.log("start getContactDetails");
    ORACLE_SERVICE_CLOUD.extension_loader.load("CUSTOM_APP_ID", "1")
    .then(function (IExtensionProvider) {
        IExtensionProvider.registerWorkspaceExtension(function (WorkspaceRecord) {
            WorkspaceRecord.getFieldValues(['Contact.c_id', 'Contact.first_name', 'Contact.last_name', 'Contact.C$date_of_birth']).then(function (IFieldDetails) {
                let contactID = IFieldDetails.getField('Contact.c_id').getValue();
                let firstName = IFieldDetails.getField('Contact.first_name').getValue();
                let lastName = IFieldDetails.getField('Contact.last_name').getValue();
                let dob = IFieldDetails.getField('Contact.C$date_of_birth').getValue();

                contactQuery(contactID, firstName, lastName);
            });
        });
    });
}

function contactQuery(contactID, firstName, lastName) {
    console.log('start contactQuery function');

    if (!!contactID == false) {
        console.log("contactID does not exist");
        return;
    }
    if (!!firstName == false) {
        console.log("firstName does not exist");
        return;
    }
    if (!!lastName == false) {
        console.log("lastName does not exist");
        return;
    }
 
    //REST query to check if there is another Contact with the same firstName and lastName 

    let request = new XMLHttpRequest();

    request.open("GET", `https://opn-boxfusion-uk.rightnowdemo.com/services/rest/connect/v1.3/contacts?q=name.first = '${firstName}' AND name.last = '${lastName}' AND id != ${contactID}`, true);

    request.onload = function () {
        if (this.status < 500) {
            console.log('request onload');
            let data = JSON.parse(this.responseText);
            //passing JSON data object
            if (!!checkNumberOfMatchingContacts(data) == false) {
                return;
            }

            checkFields(data);
        }

        else console.log("Request Failed");
    }

    request.ontimeout = function () {
        console.log("Request Timed-Out");
    }
    request.onerror = function () {
        console.log("Request Errored-Out");
    }
    
    request.send();
}

function checkNumberOfMatchingContacts(data) {
    console.log('start checkNumberOfMatchingContacts function');
    console.log(typeof data);
    
    numberOfMatchingContacts = data.items.length;
    console.log('Number of returned Contacts: ' + numberOfMatchingContacts);

    if (numberOfMatchingContacts === 0) {
        console.log('No matching Contacts');
        return false;
    }

    if (numberOfMatchingContacts > 1) {
        console.log('You have messed up!');
        return false
    }

    return true;
}

//Checking what fields will be mapped to Original Contact
function checkFields(data) {
    console.log('start checkFields function');
    let originalContactID = data.items[0].id;
    console.log('orginalContactID: ' + originalContactID);
    
    if (originalContactID === null) {
        console.log('originalContactID not found');
        return;
    }

    let arrayOfAddressWorkspaceFields = [
        'Contact.city',
        'Contact.country_id',
        'Contact.postal_code',
        'Contact.stateOrProvince',
        'Contact.street'
    ];

    let addressDataToBeMapped = {
        address: {}
    }
//If someone knows a better way please tell me
    ORACLE_SERVICE_CLOUD.extension_loader.load("CUSTOM_APP_ID", "1")
    .then(function (IExtensionProvider) {
        IExtensionProvider.registerWorkspaceExtension(function (WorkspaceRecord) {
            WorkspaceRecord.getFieldValues([
                'Contact.city',
                'Contact.country_id',
                'Contact.postal_code',
                'Contact.stateOrProvince',
                'Contact.street'
            ]).then(function (IFieldDetails) {

                if (IFieldDetails.getField('Contact.city').getValue() !== null) {
                    addressDataToBeMapped.address.city = IFieldDetails.getField('Contact.city').getValue();
                }
                if (IFieldDetails.getField('Contact.country_id').getValue() !== null) {
                    addressDataToBeMapped.address.country = {};
                    addressDataToBeMapped.address.country.id = IFieldDetails.getField('Contact.country_id').getValue();
                }
                if (IFieldDetails.getField('Contact.postal_code').getValue() !== null) {
                    addressDataToBeMapped.address.postalCode = IFieldDetails.getField('Contact.postal_code').getValue();
                }
                if (IFieldDetails.getField('Contact.stateOrProvince').getValue() !== null) {
                    addressDataToBeMapped.address.stateOrProvince = IFieldDetails.getField('Contact.stateOrProvince').getValue();
                }
                if (IFieldDetails.getField('Contact.street').getValue() !== null) {
                    addressDataToBeMapped.address.street = IFieldDetails.getField('Contact.street').getValue();
                }
   
                console.log(addressDataToBeMapped);
                updateOriginalContact(originalContactID, addressDataToBeMapped);
            });
        });
    });
}




function updateOriginalContact(originalContactID, dataToBeMapped) {
    console.log('start updateOriginalContact function');

    let mappedJSONData = JSON.stringify(dataToBeMapped);

    let request = new XMLHttpRequest();
    request.open("POST", `https://opn-boxfusion-uk.rightnowdemo.com/services/rest/connect/v1.3/contacts/${originalContactID}`);

    request.setRequestHeader('X-HTTP-Method-Override','PATCH');
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        if (this.status < 500) {
            console.log('request onload');
        }
        else console.log("Request Failed");
    }
    request.ontimeout = function () {
        console.log("Request Timed-Out");
    }
    request.onerror = function () {
        console.log("Request Errored-Out");
    }

    request.send(mappedJSONData);
}


function main() {
    console.log('start main');
    ORACLE_SERVICE_CLOUD.extension_loader.load("CUSTOM_APP_ID" , "1")
    .then(function(extensionProvider)
	{
        extensionProvider.registerWorkspaceExtension(function(WorkspaceRecord)
            {
                WorkspaceRecord.addRecordSavedListener(getContactDetails); 
            }
        );
	});
}

main();
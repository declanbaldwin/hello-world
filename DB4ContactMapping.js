console.log('DB4ContactMapping');

function getContactDetails() {
    console.log("start getContactDetails");
    ORACLE_SERVICE_CLOUD.extension_loader.load("CUSTOM_APP_ID", "1")
    .then(function (IExtensionProvider) {
        IExtensionProvider.registerWorkspaceExtension(function (WorkspaceRecord) {
            WorkspaceRecord.getFieldValues(['Contact.first_name', 'Contact.last_name', 'Contact.C$date_of_birth']).then(function (IFieldDetails) {
                let firstName = IFieldDetails.getField('Contact.first_name').getValue();
                let lastName = IFieldDetails.getField('Contact.last_name').getValue();
                let dob = IFieldDetails.getField('Contact.C$date_of_birth').getValue();

                console.log('first name: ' + firstName);
                console.log('last name: ' + lastName);
                console.log('dob: ' + dob);
            });
        });
    });
}

function main() {
    console.log('start main');
    getContactDetails();
}

main();



https://opn-boxfusion-uk.rightnowdemo.com/services/rest/connect/v1.3/contacts?q= name . first = 'Declan' AND name.last = 'Baldwin'  AND customFields.c.date_of_birth >  '1523318400'
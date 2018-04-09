// Javascript code to populate Participation Start and End date from Parent Session on workspace load




function getSessionID() {
    var sessionID;
    console.log("start getSessionID");
    ORACLE_SERVICE_CLOUD.extension_loader.load("CUSTOM_APP_ID", "1")
    .then(function (IExtensionProvider) {
        IExtensionProvider.registerWorkspaceExtension(function (WorkspaceRecord) {
            
            //Get value of Parent Session
            WorkspaceRecord.getFieldValues(['PTIBUI$Participation.Session']).then(function (IFieldDetails) {
                console.log(IFieldDetails.getField('PTIBUI$Participation.Session').getValue());
                sessionID = IFieldDetails.getField('PTIBUI$Participation.Session').getValue();
                console.log(sessionID);
            });
        });
        });
    return sessionID;
}

// testREST();

// A function to trigger an XMLHttpRequest
function testREST(sessionID) {
    if (!!sessionID == false) { 
        console.log("QUITTING TESTREST");
        return;
    }
    console.log('start testREST')
    let request = new XMLHttpRequest();

    request.open("GET", `https://opn-boxfusion-uk.rightnowdemo.com/services/rest/connect/v1.3/PTIBUI.Session/${sessionID}`, true);

    request.onload = function () {
        if (this.status < 500) {
            console.log('request onload');
            let data = JSON.parse(this.responseText);
            //passing JSON data object
            updateEndDate(data);
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


//function to use data from the testRest function and update the Start data and End Date
/**
 * 
 * @param {*} data 
 */
function updateEndDate(data) {

    console.log('start updateEndDate');
    console.log(data);
    
    ORACLE_SERVICE_CLOUD.extension_loader.load("CUSTOM_APP_ID", "1")
    .then(function(IExtensionProvider)
    {
        IExtensionProvider.registerWorkspaceExtension(function(WorkspaceRecord)
        {
            console.log('start firstJSAddIn');
            
            //Get value of Parent Session
            WorkspaceRecord.getFieldValues(['PTIBUI$Participation.Session']).then(function(IFieldDetails)
            {
                console.log(IFieldDetails.getField('PTIBUI$Participation.Session').getValue());
            });
            
            
            // Sets values of StartDate EndDate field in Participation workspace
            if (data.StartDate) {
                let startDate = new Date(data.StartDate);
                WorkspaceRecord.updateField('PTIBUI$Participation.StartDate', startDate); 
            }
            if (data.EndDate) {
                let endDate = new Date(data.EndDate);
                WorkspaceRecord.updateField('PTIBUI$Participation.EndDate', endDate); 
            }
    
        });
    });
}


function main() {
    console.log('start main');
    let counter = 0;
    let sessionID;
    let sessionIDFound = false;
    while (!!sessionIDFound == false && counter < 500000) {
        setTimeout(function () {
            sessionID = getSessionID();
            if (!!sessionID == true) { 
                console.log("SESSION ID FOUND: " + sessionID);
                sessionIDFound = true;
                return sessionIDFound;
            }
            counter++;
            console.log(counter);
            
        }, 5000);
        if (sessionIDFound == true) { break;}
    }
    testREST(sessionID);
}

main();
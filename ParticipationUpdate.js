// Javascript code to populate Participation Start and End date from Parent Session on workspace load

function getSessionID() {
    console.log("start getSessionID");
    ORACLE_SERVICE_CLOUD.extension_loader.load("CUSTOM_APP_ID", "1")
    .then(function (IExtensionProvider) {
        IExtensionProvider.registerWorkspaceExtension(function (WorkspaceRecord) {
            WorkspaceRecord.getFieldValues(['PTIBUI$Participation.Session']).then(function (IFieldDetails) {
                let sessionID = IFieldDetails.getField('PTIBUI$Participation.Session').getValue();
                testREST(sessionID);
            });
        });
    });
}

function testREST(sessionID) {
    if (!!sessionID == false) { 
        return;
    }
    let request = new XMLHttpRequest();

    request.open("GET", "https://opn-boxfusion-uk.rightnowdemo.com/services/rest/connect/v1.3/PTIBUI.Session/"+ sessionID, true);

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

function updateEndDate(data) {
    console.log('start updateEndDate');
    console.log(data);
    
    ORACLE_SERVICE_CLOUD.extension_loader.load("CUSTOM_APP_ID", "1")
    .then(function(IExtensionProvider)
    {
        IExtensionProvider.registerWorkspaceExtension(function(WorkspaceRecord)
        {
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

function ready(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', fn);
    } else {
        document.attachEvent('onreadystatechange', function () {
            if (document.readyState != 'loading')
                fn();
        });
    }
}

function main() {
    console.log('start main');
    getSessionID();
}

ready(main);


// // ORACLE_SERVICE_CLOUD.extension_loader.load("CUSTOM_APP_ID" , "1")
// // .addEditorLoadedListener.prefetchWorkspaceFields(["PTIBUI$Participation.Session"]); 
		
	
// // console.log("BLAHHFHifhiosdhfioadynfoifioahsdf");
// // console.log(parameter.event.fields['PTIBUI$Participation.Session']);
// console.log("START");
// ORACLE_SERVICE_CLOUD.extension_loader.load("CUSTOM_APP_ID" , "1").then(function(extensionProvider){
// 	extensionProvider.registerWorkspaceExtension(function(WorkspaceRecord) {
//         var recordID = WorkspaceRecord.getWorkspaceRecordId();
//         var recordType = WorkspaceRecord.getWorkspaceRecordType();
//         // Perform some logic using recordId.
//         console.log(recordID);
//         console.log(recordType);
//         testREST(recordID);
//     });
// });

// function testREST(recordID) {
//     console.log('start testREST')
//     let request = new XMLHttpRequest();

//     request.open("GET", "https://opn-boxfusion-uk.rightnowdemo.com/services/rest/connect/v1.3/PTIBUI.Participation/"+ recordID, true);

//     request.onload = function () {
//         if (this.status < 500) {
//             console.log('request onload');
//             let data = JSON.parse(this.responseText);
//             //passing JSON data object
//             console.log(data);
//         }
//         else console.log("Request Failed");
//     }

//     request.ontimeout = function () {
//         console.log("Request Timed-Out");
//     }
//     request.onerror = function () {
//         console.log("Request Errored-Out");
//     }
    
//     request.send();
// }
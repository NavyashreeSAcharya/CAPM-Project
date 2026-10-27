sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui//model/json/JSONModel",
     "sap/ui/core/routing/History" ,
     "sap/m/MessageBox",
     "sap/m/MessageToast"
], (Controller,JSONModel,History,MessageBox,MessageToast) => {
    "use strict";

    return Controller.extend("complaints.complaints.controller.CreateComplaint", {
        onInit: function () {
            // Register a router listener to reset the form every time a user visits this view
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteCreateComplaint").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var sComplaintNumber = oEvent.getParameter("arguments").complaintNumber;
            var oView = this.getView();

            if (sComplaintNumber) {
                sComplaintNumber = sComplaintNumber.toString().trim();
             }

            var oComplaintModel = oView.getModel("complaintModel");
            if(!oComplaintModel){
                oComplaintModel = new JSONModel();
                oView.setModel(oComplaintModel,"complaintModel");
            }

            if(!sComplaintNumber || sComplaintNumber === "new"){
               oComplaintModel.setData({
                   complaintNumber: "",
                   customer: "",
                   category: "",
                   priority: "",
                   subject: "",
                   description: "",
                   assignedTo: "",
                   status: "Open",
                   comments: [],
                   resolution: {
                     ID: null,
                     resolutionText: "",
                     resolvedBy: "",
                     resolvedDate: null
                   }
                });
                
                if (oView.byId("idResolvedBy")) { oView.byId("idResolvedBy").setValue(""); }
                if (oView.byId("idResolutionText")) { oView.byId("idResolutionText").setValue(""); }
                if (oView.byId("idResolvedDate")) { oView.byId("idResolvedDate").setValue(null); }

            } else {
                
                var oODataModel = this.getOwnerComponent().getModel();
                var sPath = "/Complaints(" + sComplaintNumber +")";

                oODataModel.read(sPath,{
                    urlParameters:{
                        "$expand":"comments,resolution"
                    },

                    success:function(oData){

                         if (!oData.resolution) {
                           oData.resolution = {
                           ID: null,
                           resolutionText: "",
                           resolvedBy: "",
                           resolvedDate: null
                          };
                         }
                        oComplaintModel.setData(oData);
                    },
                    error:function(oError){
                        MessageBox.error(oError.statusText);
                        oComplaintModel.setData({});
                    }
                })
            }
        },

        onCustomerSelected: function (oEvent) {
             var oSelectedItem = oEvent.getParameter("selectedItem");
             var oComplaintModel = this.getView().getModel("complaintModel");
    
            if (oSelectedItem) {
            var sCustomerKey = oSelectedItem.getKey(); 
            oComplaintModel.setProperty("/customer_customerNumber", sCustomerKey);
          }
         }, 

        onNavBack: function () {
             var oRouter = this.getOwnerComponent().getRouter();
             oRouter.navTo("Routecomplaints", {}, true);
        },

        onSaveComplaint: function(){
            var oView = this.getView();
            var oJSONModel = oView.getModel("complaintModel");
            var oData = oJSONModel.getData();

            //Validate Complaint

            if (!oData.complaintNumber){
                MessageBox.error("Complaint Number is required.");
                return
            }
            if (!oData.customer_customerNumber){
                MessageBox.error("Customer is required.");
                return
            }
            if (!oData.category){
                MessageBox.error("Category is required.");
                return
            }
            if (!oData.priority){
                MessageBox.error("Priority is required.");
                return
            }
            if (!oData.subject){
                MessageBox.error("Subject is required.");
                return
            }
            if (!oData.assignedTo){
                MessageBox.error("Assignee is required.");
                return
            }
            if (!oData.status){
                MessageBox.error("Status is required.");
                return
            }
            
            //Create Payload

            var oPayload = {
                complaintNumber: oData.complaintNumber,
                customer_customerNumber: oData.customer_customerNumber,
                category: oData.category,
                priority: oData.priority,
                subject: oData.subject,
                description: oData.description,
                assignedTo: oData.assignedTo,
                status: oData.status || "Open",

                comments: [],
                resolution: null
            };

            //Add Composition entities Comments and Resolution
            
            if (oData.comments.results && Array.isArray(oData.comments.results)){
                oData.comments.results.forEach(function (oComment){
                    oPayload.comments.push({
                        ID : oComment.ID,
                        comment:oComment.comment,
                        commentedBy: oComment.commentedBy,
                        commentDate: oComment.commentDate
                    });
                });
            }

            if (oData.resolution){
                oPayload.resolution = {
                    complaint_complaintNumber: oData.complaintNumber,
                    ID: oData.resolution.ID,
                    resolutionText: oData.resolution.resolutionText,
                    resolvedDate: oData.resolution.resolvedDate,
                    resolvedBy: oData.resolution.resolvedBy
                };
            }

            console.log("Deep Create Complaint Payload:",JSON.stringify(oPayload,null,4));

            //Odata Model

            var oODataModel = this.getOwnerComponent().getModel();

            //Deep Create to CAPM Services

            oODataModel.create("/Complaints",oPayload,{
                success: function (oResponse) {
                    console.log("Complaint Saved Successfully:",oResponse);
                    MessageToast.show("Complaint Details are saved successfully");
                }.bind(this),
                error: function (oError){
                    console.error("Deep Create Failed",oError);
                    var sMessage = "Error while saving Complaint";

                    if (oError.responseText){
                        try {
                            var oErrorData = JSON.parse(oError.responseText);
                            if (oErrorData.error && oErrorData.error.message){
                                sMessage = oErrorData.error.message.value || oErrorData.error.message; 
                            }
                        }catch (e){
                            console.error(e);
                        }
                    }
                    MessageBox.error(sMessage);
                } .bind(this)   
            });
        },

        onUpdateComplaint: function(){
            var oView = this.getView();
            var oJSONModel = oView.getModel("complaintModel");
            var oData = oJSONModel.getData();

            //Validate Complaint
            if (oData.status === "Closed") {
               MessageBox.information("This complaint cannot be updated since it is resolved.");
               return;
            }

            if (!oData.complaintNumber){
                MessageBox.error("Complaint Number is required.");
                return
            }
            if (!oData.customer_customerNumber){
                MessageBox.error("Customer is required.");
                return
            }
            if (!oData.category){
                MessageBox.error("Category is required.");
                return
            }
            if (!oData.priority){
                MessageBox.error("Priority is required.");
                return
            }
            if (!oData.subject){
                MessageBox.error("Subject is required.");
                return
            }
            if (!oData.assignedTo){
                MessageBox.error("Assignee is required.");
                return
            }
            if (!oData.status){
                MessageBox.error("Status is required.");
                return
            }
            

            var oPayload = {
                complaintNumber: oData.complaintNumber,
                customer_customerNumber: oData.customer_customerNumber,
                category: oData.category,
                priority: oData.priority,
                subject: oData.subject,
                description: oData.description,
                assignedTo: oData.assignedTo,
                status: oData.status || "Open",

                comments: [],
                resolution: null
            };


            if (oData.comments.results && Array.isArray(oData.comments.results)){
                oData.comments.results.forEach(function (oComment){
                    oPayload.comments.push({
                        ID : oComment.ID,
                        comment:oComment.comment,
                        commentedBy: oComment.commentedBy,
                        commentDate: oComment.commentDate
                    });
                });
            }

            if (oData.resolution){
                oPayload.resolution = {
                    complaint_complaintNumber: oData.complaintNumber,
                    ID: oData.resolution.ID,
                    resolutionText: oData.resolution.resolutionText,
                    resolvedDate: oData.resolution.resolvedDate,
                    resolvedBy: oData.resolution.resolvedBy
                };
            }

            console.log("Deep Create Complaint Payload:",JSON.stringify(oPayload,null,4));


            var oODataModel = this.getOwnerComponent().getModel();

            oODataModel.update("/Complaints("+ oData.complaintNumber +")",oPayload,{
                success: function (oResponse) {
                    console.log("Complaint Updated Successfully:",oResponse);
                    MessageToast.show("Complaint Details are updated successfully");
                }.bind(this),
                error: function (oError){
                    console.error("Deep Update Failed",oError);
                    var sMessage = "Error while updating Complaint";

                    if (oError.responseText){
                        try {
                            var oErrorData = JSON.parse(oError.responseText);
                            if (oErrorData.error && oErrorData.error.message){
                                sMessage = oErrorData.error.message.value || oErrorData.error.message; 
                            }
                        }catch (e){
                            console.error(e);
                        }
                    }
                    MessageBox.error(sMessage);
                } .bind(this)   
            });
        },

  onAddComment: function () {
  
    var oModel = this.getView().getModel("complaintModel");
  
    if (!oModel) {
        oModel = this.getOwnerComponent().getModel("complaintModel");
    }

    if (!oModel) {
        sap.m.MessageBox.error("Could not find 'complaintModel'");
        return;
    }

    var aComments = oModel.getProperty("/comments/results");

 
    if (!Array.isArray(aComments)) {
        aComments = [];
    }

    aComments.push({
        commentDate: new Date(),  
        commentedBy: "",         
        comment: ""               
    });

  
    oModel.setProperty("/comments/results", aComments);	
},

       onDeleteComment: function (oEvent) {
        var oContext = oEvent.getSource().getBindingContext("complaintModel");
        var sPath = oContext.getPath();
        var iIndex = parseInt(sPath.split("/").pop(), 10);
        var oModel = this.getView().getModel("complaintModel");


        var aComments = oModel.getProperty("/comments/results"); 

        aComments.splice(iIndex, 1); 
 
        oModel.setProperty("/comments/results", aComments); 
        },

onResolveComplaint: function () {
    var oView = this.getView();
    var oJSONModel = oView.getModel("complaintModel");
    var oData = oJSONModel ? oJSONModel.getData() : null;

    if (!oData || !oData.complaintNumber) {
        sap.m.MessageBox.error("Complaint data context is missing.");
        return;
    }

    if (oData.status === "Closed") {
        sap.m.MessageBox.information("This complaint is already resolved.");
        return;
    }

    // 2. Fetch resolution inputs from the screen controls safely
    var sResolvedBy = oView.byId("idResolvedBy") ? oView.byId("idResolvedBy").getValue() : "";
    var sResolutionText = oView.byId("idResolutionText") ? oView.byId("idResolutionText").getValue() : "";
    var oResolvedDate = oView.byId("idResolvedDate") ? oView.byId("idResolvedDate").getDateValue() : null;

    if (!sResolvedBy || !sResolutionText || !oResolvedDate) {
        sap.m.MessageBox.error("Please fill in the Resolution details before resolving.");
        return;
    }

    var oPayload = {
        complaintNumber: oData.complaintNumber,
        status: "Closed",
        resolution: {
            complaint_complaintNumber: oData.complaintNumber,
            ID: oData.resolution?.ID || null,
            resolutionText: sResolutionText,
            resolvedDate: oResolvedDate,
            resolvedBy: sResolvedBy
        }
    };

    var oODataModel = this.getOwnerComponent().getModel();
    var sPath = oODataModel.createKey("/Complaints", { complaintNumber: oData.complaintNumber });

    oODataModel.update(sPath, oPayload, {
        success: function () {
            oJSONModel.setProperty("/status", "Closed");
            oJSONModel.setProperty("/resolution", oPayload.resolution);
            sap.m.MessageBox.success("Complaint has been successfully Resolved.");
        }.bind(this),
        
        error: function (oError) {
            var sMessage = this._parseBackendError(oError, "Failed to save resolution Details");
            sap.m.MessageBox.error(sMessage);
        }.bind(this)
    });
},

_parseBackendError: function (oError, sFallback) {
    if (oError && oError.responseText) {
        try {
            var oObj = JSON.parse(oError.responseText);
            if (oObj?.error?.message) {
                return oObj.error.message.value || oObj.error.message;
            }
        } catch (e) {
            if (oError.statusText) { return oError.statusText; }
        }
    }
    return oError?.message || sFallback;
}

});
});

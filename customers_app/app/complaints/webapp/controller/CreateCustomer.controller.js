sap.ui.define([
    "sap/ui/core/mvc/Controller",
     "sap/ui//model/json/JSONModel",
     "sap/ui/core/routing/History",
     "sap/m/MessageBox",
     "sap/m/MessageToast" 
], (Controller,JSONModel,History,MessageBox,MessageToast) => {
    "use strict";

    return Controller.extend("complaints.complaints.controller.CreateCustomer", {
        onInit() {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteCreateCustomer").attachPatternMatched(this._onRouteMatchedCustomer, this);
        },

         _onRouteMatchedCustomer: function (oEvent) {
            var sCustomerNumber = oEvent.getParameter("arguments").customerNumber;
            var oView = this.getView();

            if (sCustomerNumber) {
                sCustomerNumber = sCustomerNumber.toString().trim();
             }

            var oCustomerModel = oView.getModel("customerModel");
            if(!oCustomerModel){
                oCustomerModel = new JSONModel();
                oView.setModel(oCustomerModel,"customerModel");
            }

            if(!sCustomerNumber || sCustomerNumber === "new"){
               oCustomerModel.setData({
                   customerNumber:"",
                   customerName:"",
                   email:"",
                   phone:""
                }); 

            } else {
                
                var oODataModel = this.getOwnerComponent().getModel();
                var sPath = "/Customers(" + sCustomerNumber +")";

                oODataModel.read(sPath,{
                    success:function(oData){
                        oCustomerModel.setData(oData);
                    },
                    error:function(oError){
                        MessageBox.error(oError.statusText);
                        oCustomerModel.setData({});
                    }
                })
            }
        },

        onSaveCustomer: function(){
           var oView = this.getView();
           var oJSONModel = oView.getModel("customerModel");
           var oData = oJSONModel.getData();
           
           //Validate Customer

            if (!oData.customerNumber){
                MessageBox.error("Customer Number is required.");
                return
            }
            if (!oData.customerName){
                MessageBox.error("Customer Name is required.");
                return
            }
            if (!oData.email) {
              MessageBox.error("Email is required.");
               return;
            } else if (!oData.email.includes("@") || !oData.email.includes(".")) {
              MessageBox.error("Please enter a valid email address.");
               return;
            }

            if (!oData.phone) {
              MessageBox.error("Phone number is required.");
              return;
            } else if (isNaN(oData.phone.replace(/[\s+\-()]/g, "")) || oData.phone.length < 10) {
              MessageBox.error("Please enter a valid phone number (minimum 10 digits).");
              return;
            }

            var oPayload = {
                customerNumber: oData.customerNumber,
                customerName: oData.customerName,
                email: oData.email,
                phone: oData.phone,
            };

            //Odata Model

            var oODataModel = this.getOwnerComponent().getModel();

            //Deep Create to CAPM Services

            oODataModel.create("/Customers",oPayload,{
                success: function (oResponse) {
                    console.log("Customer Saved Successfully:",oResponse);
                    MessageToast.show("Customer Details are saved successfully");
                }.bind(this),
                error: function (oError){
                    console.error("Create Failed",oError);
                    var sMessage = "Error while saving Customer";

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

        onUpdateCustomer: function(){
           var oView = this.getView();
           var oJSONModel = oView.getModel("customerModel");
           var oData = oJSONModel.getData();
           
           //Validate Customer

            if (!oData.customerNumber){
                MessageBox.error("Customer Number is required.");
                return
            }
            if (!oData.customerName){
                MessageBox.error("Customer Name is required.");
                return
            }
            if (!oData.email) {
              MessageBox.error("Email is required.");
               return;
            } else if (!oData.email.includes("@") || !oData.email.includes(".")) {
              MessageBox.error("Please enter a valid email address.");
               return;
            }

            if (!oData.phone) {
              MessageBox.error("Phone number is required.");
              return;
            } else if (isNaN(oData.phone.replace(/[\s+\-()]/g, "")) || oData.phone.length < 10) {
              MessageBox.error("Please enter a valid phone number (minimum 10 digits).");
              return;
            }

            var oPayload = {
                customerNumber: oData.customerNumber,
                customerName: oData.customerName,
                email: oData.email,
                phone: oData.phone,
            };

            //Odata Model

            var oODataModel = this.getOwnerComponent().getModel();

            //Deep Create to CAPM Services

            oODataModel.update("/Customers("+oData.customerNumber+")",oPayload,{
                success: function (oResponse) {
                    console.log("Customer Updated Successfully:",oResponse);
                    MessageToast.show("Customer Details are updated successfully");
                }.bind(this),
                error: function (oError){
                    console.error("Update Failed",oError);
                    var sMessage = "Error while updating Customer";

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
        onNavBack: function () {
             var oRouter = this.getOwnerComponent().getRouter();
             oRouter.navTo("Routecomplaints", {}, true);
        }
    });
});
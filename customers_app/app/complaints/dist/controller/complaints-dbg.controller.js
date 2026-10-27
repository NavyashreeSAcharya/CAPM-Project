sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], (Controller,MessageBox) => {
    "use strict";

    return Controller.extend("complaints.complaints.controller.complaints", {
        onInit() {
        },
        onRowPress: function(oEvent){
            var oItem = oEvent.getSource();
            var oContext = oItem.getBindingContext();
            var sComplaintNumber = oContext.getProperty("complaintNumber");

            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteCreateComplaint",{
                complaintNumber:sComplaintNumber
            })
        },

        onRowPressCustomer: function(oEvent){
            var oItem = oEvent.getSource();
            var oContext = oItem.getBindingContext();
            var sCustomerNumber = oContext.getProperty("customerNumber");

            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteCreateCustomer",{
                customerNumber:sCustomerNumber
            })
        },

       onCreateComplaint : function(){
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteCreateComplaint",{
            complaintNumber:"new"
          })
       },

    onDeleteComplaint: function(oEvent) {
      var oModel = this.getView().getModel(); 
      var oTable = this.getView().byId("idComplaintsTable"); 
    
    if (!oTable) {
        sap.m.MessageBox.error("Could not find the table control on the screen.");
        return;
    }

    var oSelectedItem = oTable.getSelectedItem(); 
    
    if (!oSelectedItem && typeof oTable.getSelectedItems === "function") {
        var aSelectedItems = oTable.getSelectedItems();
        if (aSelectedItems.length > 0) {
            oSelectedItem = aSelectedItems[0];
        }
    }

    if (!oSelectedItem) {
        sap.m.MessageBox.warning("Please select a complaint row from the table first before deleting.");
        return;
    }

    var oBindingContext = oSelectedItem.getBindingContext();
    if (!oBindingContext) {
        sap.m.MessageBox.error("Could not trace the backend data path for the selected row.");
        return;
    }
    
    var sPath = oBindingContext.getPath();

    // 5. Send the delete request to your HANA Backend
    oModel.remove(sPath, {
        success: function () {
            sap.m.MessageBox.success("Complaint Deleted successfully");
            oTable.removeSelections(true); 
        },
        error: function (oError) {
            sap.m.MessageBox.error(oError.statusText || "Delete failed.");
        }
    }); 
},

      onCreateCustomer : function(){
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteCreateCustomer",{
            customerNumber:"new"
        })
      },

       onDeleteCustomer: function(oEvent) {
      var oModel = this.getView().getModel(); 
      var oTable = this.getView().byId("idCustomersTable"); 
    
    if (!oTable) {
        sap.m.MessageBox.error("Could not find the table control on the screen.");
        return;
    }

    var oSelectedItem = oTable.getSelectedItem(); 
    
    if (!oSelectedItem && typeof oTable.getSelectedItems === "function") {
        var aSelectedItems = oTable.getSelectedItems();
        if (aSelectedItems.length > 0) {
            oSelectedItem = aSelectedItems[0];
        }
    }

    if (!oSelectedItem) {
        sap.m.MessageBox.warning("Please select a customer row from the table first before deleting.");
        return;
    }

    var oBindingContext = oSelectedItem.getBindingContext();
    if (!oBindingContext) {
        sap.m.MessageBox.error("Could not trace the backend data path for the selected row.");
        return;
    }
    
    var sPath = oBindingContext.getPath();

    oModel.remove(sPath, {
        success: function () {
            sap.m.MessageBox.success("Customer Deleted successfully");
            oTable.removeSelections(true); // Clear the row checkbox selection after success
        },
        error: function (oError) {
            sap.m.MessageBox.error(oError.statusText || "Delete failed.");
        }
    }); 
}



    });
});
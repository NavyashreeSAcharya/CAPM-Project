namespace customers.app;

using {cuid, managed } from '@sap/cds/common';


entity Customers:managed{ 
key customerNumber:String(30); 
customerName:String(150); 
email: String(100); 
phone:String(20); 
} 

entity Complaints: managed { 
key complaintNumber:String(30); 
customer:Association to Customers; 
category: String(50); 
priority: ComplaintPriority; 
subject:String(200); 
description:String(1000); 
assignedTo: String(100); 
status :ComplaintStatus; 
comments: Composition of many ComplaintComments on comments.complaint=$self; 
resolution: Composition of one ComplaintResolution on resolution.complaint=$self; 
} 

entity ComplaintComments :cuid{ 
complaint:Association to Complaints;
comment:String(1000); 
commentedBy:String(100); 
commentDate:Timestamp; 
} 

entity ComplaintResolution:cuid{ 
complaint:Association to Complaints; 
resolutionText: String(1000); 
resolvedDate:Date; 
resolvedBy:String(100); 
} 

type ComplaintPriority : String enum{
    High;
    Low;
    Medium;
    Critical;
}

type ComplaintStatus :String enum{
    Open;
    Closed;
}

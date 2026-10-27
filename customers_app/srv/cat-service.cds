using { customers.app as db } from '../db/schema';

using { metadata as external } from './external/metadata';


@requires:'authenticated-user'
service ComplaintsService {

 annotate Customers with @restrict :
    [
        { grant : [ 'READ', 'CREATE' ,'UPDATE'  ], to : [ 'viewer' ] },
        { grant : [ 'READ', 'CREATE', 'UPDATE', 'DELETE' ], to : [ 'admin' ] }
    ];
    
  @cds.redirection.target
  entity Customers as projection on db.Customers;
  
  annotate Complaints with @restrict :
    [
        { grant : [ 'READ', 'CREATE' ,'UPDATE'  ], to : [ 'viewer' ] },
        { grant : [ 'READ', 'CREATE', 'UPDATE', 'DELETE' ], to : [ 'admin' ] }
    ];

  @cds.redirection.target
  entity Complaints as projection on db.Complaints;
  
  @cds.redirection.target
  @readonly entity Employees as projection on external.Employees;

}

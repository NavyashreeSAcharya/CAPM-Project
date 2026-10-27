using demo.app as db from '../db/schema.cds';

service BookService {

  @odata.draft.enabled
  entity Books as projection on db.Books;

}

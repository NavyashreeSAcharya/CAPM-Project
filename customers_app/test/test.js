import cds from '@sap/cds';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const test = cds.test(__dirname + '/..','--with-mocks');

test.defaults.auth = {
    username:'anil',
    password:'anil'
};

const {GET,POST,PATCH,DELETE,expect} = test;

const BASE = 'http://localhost:4004/odata/v4/complaints';
const EXTERNAL_BASE = 'https://localhost:4004/odata/v4/complaints';

describe('ComplaintsService - Read Endpoints',() => {
   
    it('should read Customers', async() => {
        const {status,data}= await GET(`${BASE}/Customers`);

        expect(status).to.equal(200);
        expect(data.value).to.be.an('array');
    });

    it('should read Complaints', async() => {
        const {status,data}= await GET(`${BASE}/Complaints`);

        expect(status).to.equal(200);
        expect(data.value).to.be.an('array');
    });

    it('should read Employees', async() => {
        const {status,data}= await GET(`${BASE}/Employees`);

       expect(status).to.equal(200);
        expect(data.value).to.be.an('array');
    });

    it('should support $expand for Comments', async () => {
    const { status, data } = await GET(
      `${BASE}/Complaints?$expand=comments`
    );

    expect(status).to.equal(200);
    expect(data.value).to.be.an('array');
  });

  it('should support $expand for Resolution', async () => {
    const { status, data } = await GET(
      `${BASE}/Complaints?$expand=resolution`
    );

    expect(status).to.equal(200);
    expect(data.value).to.be.an('array');
  });


  it('should reject an unauthenticated request', async () => {
    const { status } = await GET(
      `${BASE}/C`,
      {
        auth: false,
        validateStatus: null
      }
    );

    expect([401, 403]).to.include(status);
  });
  
})
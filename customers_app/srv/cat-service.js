import cds from '@sap/cds';

export default class ComplaintsService extends cds.ApplicationService {

    async init() {
        const { Employees, Complaints } = this.entities;

        // --- Existing Employees Logic ---
        this.on('READ', Employees, async (request) => {
            const northwindService = await cds.connect.to('metadata');
            return northwindService.tx(request).run(request.query);
        });

        this.before('UPDATE', 'Complaints', async (request) => {
            const { status } = request.data;

            if (status === 'Closed') {
                if (!request.user.is('admin')) {
                    return request.reject(403, 'Access Denied: Only users with the Admin role can resolve complaints.');
                }
            }
        });

        await super.init(); 
    }   
}

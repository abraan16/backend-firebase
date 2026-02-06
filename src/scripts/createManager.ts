
import { createOrganization } from '../services/organizations';

async function createManager() {
    console.log('Creando la organización gestora principal...');

    try {
        const managerOrganization = await createOrganization({
            name: 'Diana Gestora Principal',
            instanceName: 'diana-gestora-principal',
            type: 'manager', // Especificamos el tipo como 'manager'
        });

        console.log('\n🎉 ¡Organización gestora creada con éxito!\n');
        console.log('Detalles de la organización:');
        console.log(`   ID: ${managerOrganization.id}`);
        console.log(`   Nombre: ${managerOrganization.name}`);
        console.log(`   Instancia: ${managerOrganization.instanceName}`);
        console.log(`   Tipo: ${managerOrganization.type}`);

    } catch (error) {
        console.error('\n❌ Error al crear la organización gestora:', error);
    }
}

createManager();

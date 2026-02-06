
import { getOrganizationByInstanceName, updateOrganization } from '../services/organizations';

async function updateManagerInstance() {
    console.log('Actualizando el nombre de la instancia de la organización gestora...');

    try {
        // ID de la organización creada anteriormente.
        const organizationId = 'LyC8GA6K0yw88zVoexcU'; 

        const updatedOrganization = await updateOrganization(organizationId, {
            instanceName: 'diana principal',
        });

        console.log('\n🎉 ¡Instancia de gestora actualizada con éxito!\n');
        console.log('Detalles actualizados:');
        console.log(`   ID: ${updatedOrganization.id}`);
        console.log(`   Nombre: ${updatedOrganization.name}`);
        console.log(`   Instancia: ${updatedOrganization.instanceName}`);

    } catch (error) {
        console.error('\n❌ Error al actualizar la instancia:', error);
    }
}

updateManagerInstance();

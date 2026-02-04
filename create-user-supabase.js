const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
require('dotenv').config();

function generateUUID() {
    return crypto.randomUUID();
}

async function createTestUser() {
    console.log('🔧 Creando usuario de prueba con Supabase JS...\n');

    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_KEY
    );

    try {
        // 1. Crear organización
        console.log('1️⃣ Creando organización...');
        const orgId = generateUUID();
        const { data: org, error: orgError } = await supabase
            .from('organizations')
            .upsert({
                id: orgId,
                slug: 'test-clinic',
                name: 'Clínica de Prueba',
                plan: 'pro',
                status: 'active',
                updatedAt: new Date().toISOString()
            }, { onConflict: 'slug' })
            .select()
            .single();

        if (orgError) throw orgError;
        console.log('✅ Organización creada:', org.name, '\n');

        // 2. Crear usuario
        console.log('2️⃣ Creando usuario...');
        const hashedPassword = await bcrypt.hash('test123', 10);
        const userId = generateUUID();
        
        const { data: user, error: userError } = await supabase
            .from('users')
            .upsert({
                id: userId,
                email: 'test@test.com',
                passwordHash: hashedPassword,
                name: 'Usuario de Prueba',
                updatedAt: new Date().toISOString()
            }, { onConflict: 'email' })
            .select()
            .single();

        if (userError) throw userError;
        console.log('✅ Usuario creado:', user.email, '\n');

        // 3. Vincular usuario con organización
        console.log('3️⃣ Vinculando usuario con organización...');
        const { error: linkError } = await supabase
            .from('organization_users')
            .upsert({
                id: generateUUID(),
                organizationId: org.id,
                userId: user.id,
                role: 'admin'
            }, { onConflict: 'organizationId,userId' });

        if (linkError) throw linkError;
        console.log('✅ Usuario vinculado\n');

        // 4. Crear datos de ejemplo
        console.log('4️⃣ Creando datos de ejemplo...');
        
        // Paciente
        const { data: patient, error: patientError } = await supabase
            .from('patients')
            .upsert({
                id: generateUUID(),
                organizationId: org.id,
                phone: '+1234567890',
                name: 'Juan Pérez',
                tags: '',
                botStatus: 'active',
                updatedAt: new Date().toISOString()
            }, { onConflict: 'phone' })
            .select()
            .single();

        if (!patientError) {
            console.log('✅ Paciente creado\n');
        }

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎉 ¡TODO LISTO!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('📋 CREDENCIALES DE PRUEBA:');
        console.log('   Email:    test@test.com');
        console.log('   Password: test123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('💡 Ahora puedes:');
        console.log('   1. Levantar el backend: npm run dev');
        console.log('   2. Levantar el frontend: cd web && npm run dev');
        console.log('   3. Ir a http://localhost:5174 e iniciar sesión\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
    }
}

createTestUser();

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
    console.log('🔧 Probando conexión a Supabase...\n');
    
    try {
        // Test 1: Conexión básica
        console.log('1️⃣ Test de conexión básica...');
        await prisma.$connect();
        console.log('✅ Conexión establecida\n');

        // Test 2: Query simple
        console.log('2️⃣ Test de query (contar organizaciones)...');
        const count = await prisma.organization.count();
        console.log(`✅ Query exitoso: ${count} organizaciones encontradas\n`);

        // Test 3: Listar tablas
        console.log('3️⃣ Verificando tablas...');
        const tables = await prisma.$queryRaw`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        `;
        console.log('✅ Tablas encontradas:');
        tables.forEach(t => console.log(`   - ${t.table_name}`));
        console.log('');

        console.log('🎉 ¡Conexión exitosa! La base de datos funciona correctamente.\n');

    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
        console.error('\n📋 Detalles del error:');
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();

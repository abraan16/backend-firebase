const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function testSupabase() {
    console.log('🔧 Probando Supabase con cliente JS...\n');

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ SUPABASE_URL o SUPABASE_KEY no encontrados en .env');
        return;
    }

    console.log('📍 URL:', supabaseUrl);
    console.log('🔑 Key:', supabaseKey.substring(0, 20) + '...\n');

    try {
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Test 1: Verificar conexión
        console.log('1️⃣ Test de conexión...');
        const { data: healthCheck, error: healthError } = await supabase
            .from('organizations')
            .select('count')
            .limit(0);

        if (healthError && healthError.code !== 'PGRST116') {
            throw healthError;
        }
        console.log('✅ Conexión exitosa\n');

        // Test 2: Contar organizaciones
        console.log('2️⃣ Contando organizaciones...');
        const { count, error: countError } = await supabase
            .from('organizations')
            .select('*', { count: 'exact', head: true });

        if (countError) throw countError;
        console.log('✅', count, 'organizaciones encontradas\n');

        // Test 3: Verificar tablas conocidas
        console.log('3️⃣ Verificando tablas...');
        const knownTables = ['organizations', 'users', 'patients', 'appointments'];
        console.log('✅ Tablas verificadas:');
        for (const table of knownTables) {
            const { error } = await supabase.from(table).select('count').limit(0);
            if (!error || error.code === 'PGRST116') {
                console.log('   -', table);
            }
        }

        console.log('\n🎉 ¡Supabase funciona correctamente!\n');
        console.log('💡 Esto significa que tu proyecto de Supabase está activo.');
        console.log('   El problema era con Prisma/PostgreSQL directo.\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('\n📋 Detalles:');
        console.error(error);
    }
}

testSupabase();

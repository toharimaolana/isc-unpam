const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZHRha2ZhcW5vaHFqZGVveXhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMTE5MDMsImV4cCI6MjA5MzY4NzkwM30.vEqGsVtTocALpQuJuZWq1opCyV3CnTpAJn-0WQUpZlM';

async function testTable(tableName) {
  const url = `https://zsdtakfaqnohqjdeoyxd.supabase.co/rest/v1/${tableName}?select=*`;
  try {
    const res = await fetch(url, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    console.log(`Table ${tableName} Status:`, res.status);
    const data = await res.json();
    if (res.status === 200) {
      console.log(`Table ${tableName} data count:`, data.length);
      if (data.length > 0) {
        console.log(`Table ${tableName} sample:`, data[0]);
      }
    } else {
      console.log(`Table ${tableName} error:`, data);
    }
  } catch (err) {
    console.error(`Error table ${tableName}:`, err);
  }
}

async function run() {
  await testTable('members');
  await testTable('classes');
  await testTable('attendances');
  await testTable('profiles');
}

run();

import fs from 'fs';

async function verify() {
  try {
    const env = fs.readFileSync('.env.local', 'utf-8');
    const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
    const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);

    if (!urlMatch || !keyMatch) {
      console.error("❌ Missing Supabase variables in .env.local");
      process.exit(1);
    }
    const url = urlMatch[1].trim().replace(/['"]/g, '');
    const key = keyMatch[1].trim().replace(/['"]/g, '');

    if (url === 'your-supabase-url' || key === 'your-anon-key') {
      console.error("❌ Environment variables are still the default placeholders. Please update them with your actual Supabase keys.");
      process.exit(1);
    }

    console.log(`Connecting to: ${url}...`);

    // Ping the settings table to verify tables and RLS
    const res = await fetch(`${url}/rest/v1/settings?select=*`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });

    if (res.ok) {
      const data = await res.json();
      console.log("✅ Supabase Connection Successful!");
      console.log("✅ Successfully retrieved data from 'settings' table:", data[0]?.site_name);
      
      // Check Portfolio table
      const pRes = await fetch(`${url}/rest/v1/portfolio?select=title,is_published`, {
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      });
      if (pRes.ok) {
        const pData = await pRes.json();
        console.log(`✅ Successfully retrieved ${pData.length} published portfolio items!`);
        console.log("✅ Phase 1 Verification Complete. Everything is set up correctly.");
      } else {
        console.error("❌ Failed to query 'portfolio' table. Ensure the SQL migrations were fully executed.");
      }
    } else {
      const error = await res.text();
      console.error("❌ Supabase connection failed. Are your keys correct?", error);
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Verification script error:", error.message);
  }
}

verify();

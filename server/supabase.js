const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase configuration missing. Auth will not work.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };

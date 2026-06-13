import { createClient } from "@supabase/supabase-js";
import { config } from "./index.js";

/**
 * Supabase Client Configuration
 * 
 * Supabase Project Details:
 * - URL: https://hivftccjveppcexwaihv.supabase.co
 * - Host: db.hivftccjveppcexwaihv.supabase.co
 * - Port: 5432
 * - Database: postgres
 * - User: postgres
 */

// Initialize Supabase client with anon key for public operations
export const supabase = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_ANON_KEY
);

// Initialize Supabase client with service role key for admin operations
export const supabaseAdmin = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Supabase Client Usage Examples:
 * 
 * 1. Query data:
 *    const { data, error } = await supabase
 *      .from('Profile')
 *      .select('*')
 *      .eq('userId', userId);
 * 
 * 2. Insert data:
 *    const { data, error } = await supabase
 *      .from('Profile')
 *      .insert([{ userId, fullName, role: 'STUDENT' }])
 *      .select();
 * 
 * 3. Update data:
 *    const { data, error } = await supabase
 *      .from('Profile')
 *      .update({ fullName })
 *      .eq('userId', userId)
 *      .select();
 * 
 * 4. Delete data:
 *    const { error } = await supabase
 *      .from('Profile')
 *      .delete()
 *      .eq('userId', userId);
 * 
 * 5. Real-time subscriptions:
 *    const subscription = supabase
 *      .on('*', { event: 'INSERT', schema: 'public', table: 'Profile' },
 *        payload => console.log('New profile:', payload))
 *      .subscribe();
 */

export default supabase;

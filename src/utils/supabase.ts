export const supabaseAdminClient = {
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        eq: () => ({
          order: () => ({
            limit: () => Promise.resolve({ data: [], error: null })
          }),
          limit: () => Promise.resolve({ data: [], error: null })
        }),
        order: () => ({
          limit: () => Promise.resolve({ data: [], error: null })
        }),
        limit: () => Promise.resolve({ data: [], error: null })
      }),
      order: () => ({
        limit: () => Promise.resolve({ data: [], error: null })
      }),
      limit: () => Promise.resolve({ data: [], error: null })
    })
  })
};

export const supabase = supabaseAdminClient;

export function createSupabaseServerClient(context: any) {
  return supabaseAdminClient;
}

export function createSupabaseAdminServerClient(context: any) {
  return supabaseAdminClient;
}

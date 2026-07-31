const dummyPromise = Promise.resolve({ data: null, error: null });
const createMockChain = () => {
  const chain: any = new Proxy(function() {}, {
    get: (target, prop) => {
      if (prop === 'then') return dummyPromise.then.bind(dummyPromise);
      if (prop === 'catch') return dummyPromise.catch.bind(dummyPromise);
      if (prop === 'finally') return dummyPromise.finally.bind(dummyPromise);
      return chain;
    },
    apply: () => chain
  });
  return chain;
};

export const supabaseAdminClient = {
  from: () => createMockChain(),
  auth: createMockChain(),
  storage: createMockChain()
};

export const supabase = supabaseAdminClient;

export function createSupabaseServerClient(context: any) {
  return supabaseAdminClient;
}

export function createSupabaseAdminServerClient(context: any) {
  return supabaseAdminClient;
}

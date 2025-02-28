export async function resolve(promise) {
  const resolved = {
    data: null,
    error: null,
  };
  try {
    const { data } = await promise;
    resolved.data = data;
  } catch (e) {
    return {
      data: null,
      error: e,
    };
  }
  return resolved;
}

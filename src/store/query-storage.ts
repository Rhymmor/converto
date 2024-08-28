export const QueryStorageEngine = new Proxy(window.location, {
  set(loc, name, value) {
    const query = new URLSearchParams(loc.search);
    query.set(name.toString(), value);

    loc.search = query.toString();
    return true;
  },
  get(loc, name) {
    const query = new URLSearchParams(loc.search);
    return query.get(name.toString());
  },
  deleteProperty(loc, name) {
    const query = new URLSearchParams(loc.search);
    query.delete(name.toString());

    loc.search = query.toString();

    return true;
  },
});

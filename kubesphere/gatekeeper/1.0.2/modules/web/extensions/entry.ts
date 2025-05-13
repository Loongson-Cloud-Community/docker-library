// @ts-ignore
function importAll(r: __WebpackModuleApi.RequireContext) {
  r.keys()
    .filter(k => k.startsWith('.'))
    .forEach(r);
}

importAll(require.context('./', true, /src\/index.[jt]s$/));

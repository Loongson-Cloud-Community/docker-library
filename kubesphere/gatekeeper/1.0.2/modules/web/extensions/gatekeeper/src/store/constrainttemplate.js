import { BaseStore, getPath } from '@ks-console/shared';
import { API_VERSIONS } from '../utils/constants';

const module = 'constrainttemplates';

const mapper = item => {
  return { name: item.metadata.name, ...item };
};

const yamlRawData = `apiVersion: templates.gatekeeper.sh/v1
kind: ConstraintTemplate
metadata:
  name: null
spec:
  crd:
    spec:
      names:
        kind: null
      validation:
        openAPIV3Schema:
          type: object
          properties: {}
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: ''
`;

const getResourceUrl = (params, ksVersion) => {
  if (ksVersion) {
    return `kapis/templates.gatekeeper.sh/v1${getPath(params)}/${module}`;
  } else {
    return `${API_VERSIONS[module]}${getPath(params)}/${module}`;
  }
};

const { ...baseStore } = BaseStore({
  module,
  mapper,
  getListUrlFn: getResourceUrl,
  getResourceUrlFn: getResourceUrl,
});

const store = {
  ...baseStore,
  module,
  mapper,
  yamlRawData,
};

export default store;
//# sourceMappingURL=secret.d.ts.map

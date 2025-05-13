const getConstraintTemplatesTemplate = () => ({
  apiVersion: 'templates.gatekeeper.sh/v1',
  kind: 'ConstraintTemplate',
  metadata: {
    name:''
  },
  spec: {
    crd: {
      spec: {
        names: {
          kind:null,
        },
        validations: {
          openAPIV3Schema: {
            type:'object',
            properties:{}
          },
        },
      },
    },
    targets: [
      {
        target: 'admission.k8s.gatekeeper.sh',
        rego: '',
      },
    ],
  },
});

const getConstraintTemplate = ()=>({
  apiVersion: 'constraints.gatekeeper.sh/v1beta1', 
  kind: '', 
  metadata: {
    name:'',
  },
  spec: {
    enforcementAction:'deny',
    match:{
      kinds:[
        {
          apiGroups:[''],
          kinds:['Pod'],
        }
      ],
      namespaces:[{name:""}],
      namespaceSelector:{
        matchExpressions:[
          {key:'',operator:''}
        ],
        matchLabels:{},
      }
    },
    parameters:{}
  },
})

const FORM_TEMPLATES = {
  constrainttemplates: getConstraintTemplatesTemplate,
  constraints:getConstraintTemplate,
};

const MODULE_KIND_MAP = {
  constraints: 'ConstraintTemplate',
};

export default FORM_TEMPLATES;

export const getFormTemplate = (namespace, module) => {
  const kind = MODULE_KIND_MAP[module];

  if (!kind || !FORM_TEMPLATES[module]) {
    return {};
  }

  const template = FORM_TEMPLATES[module]({ namespace });

  return {
    [kind]: template,
  };
};

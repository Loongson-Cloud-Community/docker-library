import routes from './routes';
import locales from './locales';

const menus = [{
  parent: 'cluster',
  name: 'gatekeeper',
  title: 'Gatekeeper',
  icon: 'key',
  assets:'https://open-policy-agent.github.io/gatekeeper/website/img/logo.svg',
  order: 8,
},{
  parent: 'cluster.gatekeeper',
  name: 'gatekeeper.constrainttemplates',
  title: 'Constraint Templates',
  order: 0,
  clusterModule: 'gatekeeper',
},
{
  parent: 'cluster.gatekeeper',
  name: 'gatekeeper.constraints',
  title: 'Constraints',
  order: 1,
  clusterModule: 'gatekeeper',
}]


const extensionConfig = {
  menus,
  routes,
  locales,
  isCheckLicense: true,
};

export default extensionConfig;

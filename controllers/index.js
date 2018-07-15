import maintenanceController from './maintenance'
import configurationController from './configuration'
import statusController from './status'
import initializationController from './initialization'
import homeController from './home'
/**
 * Namespace containing Controllers for TEMS endpoints
 * @namespace Controllers
 */
const Controllers = {
  maintenance: maintenanceController,
  configuration: configurationController,
  status: statusController,
  initialization: initializationController,
  home: homeController,
}

export default Controllers

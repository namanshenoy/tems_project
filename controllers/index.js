import maintenanceController from './maintenance'
import configurationController from './configuration'
import statusController from './status'
import initializationController from './initialization'
import homeController from './home'

const controllers = {
  maintenance: maintenanceController,
  configuration: configurationController,
  status: statusController,
  initialization: initializationController,
  home: homeController,
}

export default controllers

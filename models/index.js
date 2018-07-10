import Sequelize from 'sequelize'

var sequelize = new Sequelize('tems', 'postgres', 'postgres', {
  dialect: 'postgres',
  define: {
    underscored: true
  }
});

const models = {
  Tester: sequelize.import('./tester'),
  Slot: sequelize.import('./slot')
}

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models
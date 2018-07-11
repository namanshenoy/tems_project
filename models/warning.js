export default (sequelize, DataTypes) => {
  const Warning = sequelize.define('warning', {
    message: DataTypes.STRING,
    date: {
      type: DataTypes.DATE,
      get() {
        const d = this.getDataValue('date')
        console.log('DATE: ', d)
        // 'this' allows you to access attributes of the instance
        if (d == null) {
          return 'Setting Date. Please Try again'
        }
        return d.toString()
      },
    },
  })

  Warning.associate = (models) => {
    // 1:M
    // Each Slot has Many Monitors
    models.Warning.belongsTo(models.Tester, {
      onDelete: 'CASCADE',
      targetKey: 'id',
    })
  }

  return Warning
}

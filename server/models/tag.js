module.exports = function (sequelize, DataTypes) {
  let Tag = sequelize.define("Tag",
    {
      text: {
        type: DataTypes.STRING, allowNull: false, validate: {notEmpty: true },
        set: function (val) {
          if (!val) {
            val = '';
          }
          this.setDataValue('text', val.toLowerCase());
        }
      }
    }
    , {
      classMethods: {
        associate: function (models) {
          Tag.belongsTo(models.User, {
            allowNull: false,
            onDelete: 'cascade',
            onUpdate: 'cascade',
            foreignKey: 'creatorId'
          });
        }
      },
      timestamps: true,
      updatedAt: false,
      indexes: [
        {
          unique: true,
          fields: ['text'],
          name: 'text_index'
        },
        {
          name: 'creator_index',
          fields: ['creatorId']
        }
      ]
    });
  return Tag;
}
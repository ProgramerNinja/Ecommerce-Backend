// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

Product.belongsTo(Category, {
  foreignKey: "category_id",
  onDelete: "CASCADE"
}); // Products belongsTo Category

Category.hasMany(Product, {
  foreignKey: "category_id",
  onDelete: "CASCADE"
}); // Categories have many Products

Product.belongsToMany(Tag, {
  foreignKey: "product_id",
  through: {
    model: ProductTag,
    unique: false,
  },
  // Creating an alias
  as: "products"
}); // Products belongToMany Tags (through ProductTag)

Tag.belongsToMany(Product, {
  foreignKey: "tag_id",
  through: {
    model: ProductTag,
    unique: false,
  },
  // Creating an alias
  as: "tags"
}); // Tags belongToMany Products (through ProductTag)


module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};

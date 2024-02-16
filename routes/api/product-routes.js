const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const products = await Product.findAll({
      include: [
        { model: Category },
        { model: Tag, through: ProductTag, as: 'products' },
      ] // Include the associated Category and Tag data
    });

    res.json(products);
} catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve products' });
}
});

// get one product
router.get('/:id', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const products = await Product.findByPk(req.params.id,{
      include: [
        { model: Category },
        { model: Tag, through: ProductTag, as: 'products' },
      ] // Include the associated Category and Tag data
    });

    res.json(products);
} catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve products' });
}
});

// create new product
router.post('/', async (req, res) => {
  try {
    // Create a new product
    const product = await Product.create(req.body);

    // If there are product tags, create pairings in the ProductTag model
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });

      // Bulk create in the ProductTag model
      await ProductTag.bulkCreate(productTagIdArr);
    }

    // Respond with the created product data
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

// update product
router.put('/:id', async (req, res) => {
  try {
    // Update product data
    const productData = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    // Check if the product was not found or not updated
    if (productData > 0) {
      // If there are product tags, update the ProductTag model
      if (req.body.tagIds && req.body.tagIds.length) {
        const productTags = await ProductTag.findAll({
          where: { product_id: req.params.id }
        });

        // Create filtered list of new tag_ids
        const productTagIds = productTags.map(({ tag_id }) => tag_id);
        const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });

        // Figure out which ones to remove
        const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);

        // Run both actions
        await Promise.all([
          ProductTag.destroy({ where: { id: productTagsToRemove } }),
          ProductTag.bulkCreate(newProductTags),
        ]);
      }

      // Respond with the updated product data
      res.status(200).json({ message: 'Product updated successfully' });
    } else {
      res.status(404).json({ message: 'Product not found or not updated' });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});


router.delete('/:id', async (req, res) => {
  try {
    // Delete a product by its `id` value
    const productData = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    // Check if the product was not found or not deleted
    if (productData > 0) {
      res.status(200).json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ message: 'Product not found or not deleted' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;

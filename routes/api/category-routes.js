const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
      const categories = await Category.findAll({
        include: [{ model: Product }] // Include the associated Product model
      });

      res.json(categories);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve categories' });
  }
});

router.get('/:id', async (req, res) => {
  try {
      const categories = await Category.findByPk(req.params.id,{
        include: [{ model: Product }] // Include the associated Product model
      });

      res.json(categories);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve category' });
  }
});

router.post('/', async (req, res) => {
  // create a new category

  //Thank you to https://github.com/SlemJosh for the verification snippit
  const { category_name } = req.body;

  // Validate the category_name
  if (!category_name || typeof category_name !== 'string' || category_name.trim() === '') {
    return res.status(400).json({ message: 'Invalid category_name' });
  }

  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  const { category_name } = req.body;

  // Validate the category_name
  if (!category_name || typeof category_name !== 'string' || category_name.trim() === '') {
    return res.status(400).json({ message: 'Invalid category_name' });
  }

  try {
    // Update an existing category by its id
    const [categoryData] = await Category.update({ category_name }, {
      where: {
        id: req.params.id,
      },
    });

    // Check if the category was not found or not updated
    if (categoryData > 0) {
      res.status(200).json({ message: 'Category updated successfully' });
    } else {
      res.status(404).json({ message: 'Category not found or not updated' });
    }
  }
  catch (err) {
    // Handle errors and respond with a 500 status code
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
    }

    res.status(200).json({message: 'Category deleted'});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

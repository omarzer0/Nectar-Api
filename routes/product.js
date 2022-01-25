const router = require("express").Router();
const product = require("../models/product");
const { verifyToken } = require("../validation");

// create
// /api/products/ (post) (base url is in server.js file)
router.post("/", verifyToken, (req, res) => {
  const data = req.body;
  product
    .insertMany(data)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// read all
// /api/products/ (get)
router.get("/", (req, res) => {
  product
    .find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// read all product that in stock
/**
 * this must be before get porduct by ID or else instock will be thought as ID in get porduct by ID
 */
// /api/products/instock (get)
router.get("/instock", (req, res) => {
  product
    .find({ inStock: true })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// read single product
// /api/products/123456 (get)
router.get("/:id", (req, res) => {
  product
    .findById(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// update product
// /api/products/123456 (put)
router.put("/:id", verifyToken, (req, res) => {
  const id = req.params.id;

  product
    .findByIdAndUpdate(id, req.body)
    .then((data) => {
      if (!data) {
        // cannot find the id of a porduct in mongo db to be updated
        res
          .status(404)
          .send({
            message:
              "Cannot update product with id=" +
              id +
              ". Maybe product was not found",
          });
      } else {
        res.send({ message: "Product was successfully updated." });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error updating product with id=" + id });
    });
});

// delete product
// /api/products/123456 (put)
router.delete("/:id", verifyToken, (req, res) => {
  const id = req.params.id;

  product
    .findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        // cannot find the id of a porduct in mongo db to be updated
        res
          .status(404)
          .send({
            message:
              "Cannot delete product with id=" +
              id +
              ". Maybe product was not found",
          });
      } else {
        res.send({ message: "Product was successfully deleted." });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error deleting product with id=" + id });
    });
});

// export
module.exports = router;

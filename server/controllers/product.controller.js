import productModel from "../models/product.model";

class ProductController {
  async createProduct(req, res) {
    try {
      await productModel.createProduct(/* sender */ req.body);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async buyProduct(req, res) {
    try {
      await productModel.buyProduct(/* sender */ req.body);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async returnProduct(req, res) {
    try {
      await productModel.returnProduct(/* sender */ req.body);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

export default new ProductController();

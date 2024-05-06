import storeModel from "../models/store.model";

class StoreController {
  async createStore(req, res) {
    try {
      await storeModel.createStore(/* sender */ req.body);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async removeStore(req, res) {
    try {
      await storeModel.removeStore(/* sender */ req.body);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

export default new StoreController();

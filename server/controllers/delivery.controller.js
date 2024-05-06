import deliveryModel from "../models/delivery.model";

class DeliveryController {
  async createDeliveryRequest(req, res) {
    try {
      await deliveryModel.createDeliveryRequest(/* sender */ req.body);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async confirmDelivery(req, res) {
    try {
      await deliveryModel.confirmDelivery(/* sender */ req.body);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

export default new DeliveryController();

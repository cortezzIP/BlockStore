import userModel from "../models/user.model";

class UserController {
  async createUser(req, res) {
    try {
      await userModel.createUser(/* sender */ req.body);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async createAdmin(req, res) {
    try {
      await userModel.createAdmin(/* sender */ req.body);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

export default new UserController();

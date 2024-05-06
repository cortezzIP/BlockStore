import roleModel from "../models/role.model";

class RoleController {
  async createRequestRoleChange(req, res) {
    try {
      await roleModel.createRequestRoleChange(/* sender */ req.body);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async approveRoleChange(req, res) {
    try {
      await roleModel.approveRoleChange(/* sender */ req.body);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async rejectRoleChange(req, res) {
    try {
      await roleModel.rejectRoleChange(/* sender */ req.body);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

export default new RoleController();

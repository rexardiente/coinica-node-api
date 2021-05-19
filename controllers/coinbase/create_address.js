const { coinbaseClient } = require("../../services/coinbaseClient");
const errorHandler = require("../../helpers/errorHandler");
const successHandler = require("../../helpers/successHandler");
const paramValidator = require("../../helpers/paramValidator");

const create_address = async(req, res) => {
  const { id, name } = req.body;
  const { isValid, message  } = paramValidator({ id, name })

  if (isValid) {
    try {
      coinbaseClient.getAccount(id, (err, account) => {
        if (err) {
          res.status(400).json(errorHandler({ status: 400, message: 'Invalid id or id not found' }))
        } else {
          account.createAddress({ name }, function(err, address) {
            if (err) {
              res.status(400).json(errorHandler({ status: 400, message: err.message || 'Error creating address' }))
            } else {
              res.status(200).json(successHandler({ data: address }))
            }
          });
        }
      });
    } catch (err) {
      res.status(500).json(errorHandler({ message: err.message || "Internal server error" }))
    }
  } else {
    res.status(400).json(errorHandler({ status: 400, message }))
  }
}

module.exports = create_address;

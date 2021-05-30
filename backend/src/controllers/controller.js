const db = require('../config/db.config.js');
const Cliente = db.Cliente;

exports.createCliente = (request, response) => {
  let cliente = {};

  try {
    cliente.nome = request.body.nome;
    cliente.email = request.body.email;
    cliente.idade = request.body.idade;

    Cliente.create(cliente, { attributes: ['id', 'nome', 'email', 'idade'] })
      .then(result => {
        response.status(200).json(result);
      });
  } catch (error) {
    response.status(500).json({
      message: 'Fail!',
      error: error.message,
    })
  }
}

exports.getCliente = (request, response) => {
  Cliente.findByPk(
    request.params.id, {
    attributes: ['id', 'nome', 'email', 'idade']
  })
    .then(cliente => {
      response.status(200).json(cliente);
    })
    .catch(error => {
      console.log(error);

      response.status(500).json({
        message: 'Error!',
        error: error,
      })
    })
}


exports.getClientes = (request, response) => {
  try {
    Cliente.findAll({
      attributes: ['id', 'nome', 'email', 'idade']
    })
      .then(clientes => {
        response.status(200).json(clientes);
      })
  }
  catch (error) {
    console.log(error);

    response.status(500).json({
      message: 'ErrorAll!',
      error: error,
    })
  }
}

exports.deleteCliente = async (request, response) => {
  try {
    let clienteId = request.params.id;
    let cliente = await Cliente.findByPk(clienteId);

    if (!cliente) {
      response.status(404).json({
        message: `Não existe nenhum cliente com o Id ${clienteId}`,
        error: "404",
      });
    } else {
      await cliente.destroy();
      response.status(200).json('Cliente deletado com sucesso');
    }
  } catch (error) {
    response.status(500).json({
      message: `Não foi possível deletar o cliente com o Id: ${request.params.id}`,
      error: error.message
    })
  }
}

exports.updateCliente = async (request, response) => {
  try {
    let cliente = await Cliente.findByPk(request.body.id);

    if (!cliente) {
      response.status(404).json({
        message: `Não existe nenhum cliente com o Id ${clienteId}`,
        error: "404",
      });
    } else {
      let updateObject = {
        nome: request.body.nome,
        email: request.body.email,
        idade: request.body.idade,
      }

      let result = await Cliente.update(updateObject, {
        returning: true,
        where: { id: request.body.id },
        attributes: ['id', 'nome', 'email', 'idade']
      })

      if (!result) {
        response.status(500).json({
          message: `Não houve alteração no cliente com o Id ${request.params.id}`,
          error: "Não pode ser alterado",
        })
      }
      response.status(200).json('Cliente alterado com sucesso');
    }
  } catch (error) {
    response.status(500).json({
      message: `Não pode ser alterado o cliente com o Id ${request.params.id}`,
      error: error.message,
    });
  }
}

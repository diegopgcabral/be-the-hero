import generateUniqueId from '../../utils/generateUniqueId';
import connection from '../../database/connection';

class OngController {
  async index(req, res) {
    const ongs = await connection('ongs').select('*');
    return res.status(200).json(ongs);
  }

  async create(req, res) {
    const { name, email, whatsapp, city, uf } = req.body;

    const id = generateUniqueId();

    await connection('ongs').insert({
      id,
      name,
      email,
      whatsapp,
      city,
      uf,
    });

    return res.json({ id });
  }
}

export default new OngController();

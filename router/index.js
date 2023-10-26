const mysql = require('mysql');
const util = require('util');
const { generateRandomString } = require('./random.js');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'mysql',
});

const query = util.promisify(pool.query).bind(pool);

module.exports = function (app) {
  app.get('/test', async (req, res) => {
    try {
      const results = await query('SELECT * from sys_user');
      const result = {
        code: 0,
        msg: 'success',
        data: results,
      };
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });

  app.post('/login', async (req, res) => {
    try {
      const results = await query(
        'SELECT * FROM sys_user WHERE name = ? AND password = ?',
        [req.body.name, req.body.password]
      );

      const result = {
        code: 0,
        msg: 'success',
      };

      if (results.length === 0) {
        result.code = 500;
        result.msg = 'no data';
      } else {
        result.token = generateRandomString(36);
        await query('UPDATE sys_user SET token = ? WHERE id = ?', [result.token, results[0].id]);
      }

      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });

  app.post('/insert', async (req, res) => {
    try {
      await query('INSERT INTO sys_user (name, password) VALUES (?, ?)', [req.body.name, req.body.password]);
      const result = {
        code: 0,
        msg: 'success',
      };
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });

  app.post('/update', async (req, res) => {
    try {
      await query('UPDATE sys_user SET name = ?, password = ? WHERE id = ?', [req.body.name, req.body.password, req.body.id]);
      const result = {
        code: 0,
        msg: 'success',
      };
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });

  app.delete('/delete', async (req, res) => {
    const id = req.query.id;
    try {
      await query('DELETE FROM sys_user WHERE id = ?', [id]);
      const result = {
        code: 0,
        msg: 'success',
      };
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });
};

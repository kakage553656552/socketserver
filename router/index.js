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

      const token = generateRandomString(36);
      if (results.length === 0) {
        result.code = 500;
        result.msg = 'no data';
      } else {
        await query('UPDATE sys_user SET token = ? WHERE id = ?', [token, results[0].id]);
      }
      results[0].token = token;
      result.data = results[0];
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });

  app.post('/insert', async (req, res) => {
    try {
      //查询name是否已经存在数据库
      const results = await query('SELECT * FROM sys_user WHERE name = ?', [req.body.name]);
      if (results.length > 0) {
        const result = {
          code: 500,
          msg: 'name already exists',
        };
        res.send(result);
        return;
      }
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
  app.delete('/signOut', async (req, res) => {
    const id = req.query.id;
    try {
      // 修改 SQL 查询以删除 token 字段
      await query('UPDATE sys_user SET token = NULL WHERE id = ?', [id]);
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

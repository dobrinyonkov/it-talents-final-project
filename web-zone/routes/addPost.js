var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send("az si gi testvah skoro shte go iztirq tva")
//   res.send(`
//   <h1>add post test page</h1>
//   <form action="/api/posts" method="post">
//   <input type="text" name="userId" placeholder="userId"/ value="5ad63bf90f14ae3f21b9d9ab">
//   <input type="text" name="text" placeholder="text"/>
//   <input type="submit" value="add comment to the data base"/>
//   </form>
//   `);
});

module.exports = router;

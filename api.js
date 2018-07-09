const huejay = require("huejay");

module.exports = {
  routes: {
    get: {
      discover: (req, res) => {
        // const appRoot = req.app.locals.appRoot;
        // const config = req.app.locals.config;

        huejay
          .discover()
          .then(bridges => {
            return res.send({ bridges });
          })
          .catch(error => {
            console.log(`An error occurred: ${error.message}`);
          });
      }
    },
    post: {
      connect: (req, res) => {
        const body = req.body;
        if (!body || !body.ip) {
          return res.send(false);
        }

        let client = new huejay.Client({
          host: body.ip,
          username: "default",
          timeout: 30000
        });

        let user = new client.users.User();
        user.deviceType = "webdash-hue";

        return client.users
          .create(user)
          .then(user => {
            const config = {
              hue: {
                ip: body.ip,
                username: "aD1SP94kayZp9T3mjfawr7bFVQLdMI6qd0IgUAYj"
              }
            };

            return res.send({ config });
          })
          .catch(error => {
            if (error instanceof huejay.Error && error.type === 101) {
              return console.log(`Link button not pressed. Try again...`);
            }
            console.log(error.stack);
          })
          .catch(error => {
            console.log(error.message);
          });
      }
    }
  }
};

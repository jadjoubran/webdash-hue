const huejay = require("huejay");

const getClient = config => {
  const client = new huejay.Client({
    host: config.ip,
    username: config.username
  });
  return client;
};

module.exports = {
  routes: {
    get: {
      discover: (req, res) => {
        huejay
          .discover()
          .then(bridges => {
            return res.send({ bridges });
          })
          .catch(error => {
            console.log(`An error occurred: ${error.message}`);
          });
      },
      lights: (req, res) => {
        const config = req.app.locals.config;

        const client = getClient(config.hue);

        client.lights.getAll().then(lights => {
          return res.send({ lights });
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
              ip: body.ip,
              username: "aD1SP94kayZp9T3mjfawr7bFVQLdMI6qd0IgUAYj",
              presets: []
            };

            return res.send({ config });
          })
          .catch(error => {
            if (error instanceof huejay.Error && error.type === 101) {
              console.log(`Link button not pressed. Try again...`);
              return res.send({
                message: "Link button not pressed. Try again..."
              });
            }
            console.log(error.stack);
            return res.send({
              message: "Could not connect to bridge. Try again..."
            });
          });
      },
      "set-light": (req, res) => {
        const body = req.body;
        if (!body || !body.id) {
          return res.send(false);
        }

        const config = req.app.locals.config;

        const client = getClient(config.hue);

        client.lights
          .getById(body.id)
          .then(light => {
            console.log(body.state);
            for (const key of Object.keys(body.state)) {
              console.log(key, body.state[key]);
              light[key] = body.state[key];
            }

            return client.lights.save(light);
          })
          .then(light => {
            console.log(`Updated light [${light.id}]`);
            return res.send(true);
          })
          .catch(error => {
            console.log("Something went wrong");
            console.log(error.stack);
          });
      }
    }
  }
};

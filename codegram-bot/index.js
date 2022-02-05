/**
 * This is the main entrypoint to CodeGram Probot app
 * For any new listener added below you need to add the permission
 * inside the app settings on github and get users to approve the new permissions
 * @param {import('probot').Probot} app
 */

module.exports = (app) => {
  app.log.info("Yay, the app was loaded!");
};

const cron = require("node-cron");
const { Repository } = require("../repository/implementation/Repository");

const _articleRepository = new Repository("articles");

export const scheduleArticlePublishing = () => {
    console.log("cron starting")
  // Schedule the job to run every minute
  cron.schedule("* * * * *", async () => {
    console.log("Running scheduled task for publishing articles...");

    try {
      await _articleRepository.updateMany(
        { where: { publishedAt: { lte: new Date() }, is_published: false } },
        { is_published: true }
      );
    } catch (error) {
      console.error("Error in scheduled task:", error);
    }
  });
};

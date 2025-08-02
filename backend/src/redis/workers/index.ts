export default {
  startQueueWorkers: () => {
    require("./jobScheduler.worker");
    console.log("All workers started!");
  },
};

import axios from "axios";

export default {
  // Gets all runningStats
  getRunningStats: function() {
    return axios.get("/api/runningStats");
  },
  // Gets the runningStat with the given id
  getRunningStat: function(id) {
    return axios.get("/api/runningStats/" + id);
  },
  // Deletes the runningStat with the given id
  deleteRunningStat: function(id) {
    return axios.delete("/api/runningStats/" + id);
  },
  // Saves a runningStat to the database
  saveRunningStat: function(runningStatData) {
    return axios.post("/api/runningStats", runningStatData);
  },
  //save the user info to the database
  // saveUserData: function(id) {
  //   return axios.post("/api/user/" + id);
  // }
}

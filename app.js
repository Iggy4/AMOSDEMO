const procedures = {
  startup: [
    "Verify emergency stop is released.",
    "Confirm guards and door interlocks are active.",
    "Power on main machine switch.",
    "Initialize CNC controller.",
    "Home all axes.",
    "Check coolant level and flow.",
    "Load correct program.",
    "Verify tool offsets and work offset.",
    "Run dry cycle if required."
  ],
  shutdown: [
    "Stop current job safely.",
    "Return machine to home or safe position.",
    "Turn off spindle.",
    "Clean chips from enclosure and fixture.",
    "Turn off coolant system.",
    "Power down controller.",
    "Shut off main power if required."
  ],
  toolChange: [
    "Pause machine operation.",
    "Move spindle to safe position.",
    "Confirm correct replacement tool.",
    "Remove current tool.",
    "Insert and secure new tool.",
    "Update tool number and offset.",
    "Verify clearance.",
    "Resume operation."
  ],
  fixtureSetup: [
    "Clean fixture surface.",
    "Mount fixture securely.",
    "Verify fixture alignment.",
    "Tighten all bolts to shop standard.",
    "Load part into fixture.",
    "Check tool clearance.",
    "Run dry test."
  ]
};

document.getElementById("ackSafety").addEventListener("click", () => {
  document.getElementById("safetyModal").style.display = "none";
  logActivity("Safety notice acknowledged");
});

function showProcedure(name) {
  const steps = procedures[name] || [];
  const el = document.getElementById("procedureSteps");
  el.innerHTML = "";
  steps.forEach(step => {
    el.innerHTML += `<li>${step}</li>`;
  });
}

function render() {
  updateMachine();

  const alerts = evaluateAlerts(machine);
  const maint = evaluateMaintenance(machine);
  const health = calculateHealth(machine, alerts.concat(maint));

  const statusCard = document.getElementById("statusCard");
  statusCard.className = `hero-card status-card status-${health.color}`;
  document.getElementById("machineState").innerText = health.text;
  document.getElementById("statusReason").innerText = health.reason;

  document.getElementById("lastUpdate").innerText = new Date().toLocaleTimeString();

  document.getElementById("cycleTime").innerText = `${machine.cycleTime}s`;
  document.getElementById("cycleBaseline").innerText = `Baseline ${machine.baselines.cycleTime}s`;
  document.getElementById("idleTime").innerText = `${machine.idleTime}s`;
  document.getElementById("startupTime").innerText = `${machine.startupTime}s`;
  document.getElementById("startupBaseline").innerText = `Baseline ${machine.baselines.startupTime}s`;
  document.getElementById("runtimeHours").innerText = `${machine.runtimeHours.toFixed(2)}h`;
  document.getElementById("cycleCount").innerText = machine.cycleCount;
  document.getElementById("power").innerText = `${Math.round(machine.power)} W`;
  document.getElementById("vibration").innerText = machine.vibration.toFixed(2);
  document.getElementById("vibrationRange").innerText = `Normal ${machine.baselines.vibrationMin}-${machine.baselines.vibrationMax}`;
  document.getElementById("temperature").innerText = `${machine.temperature.toFixed(1)}°C`;
  document.getElementById("temperatureRange").innerText = `Normal ${machine.baselines.temperatureMin}-${machine.baselines.temperatureMax}°C`;
  document.getElementById("spindleRpm").innerText = machine.spindleRpm;
  document.getElementById("feedRate").innerText = machine.feedRate.toFixed(1);
  document.getElementById("coolant").innerText = machine.coolantOn ? "ON" : "OFF";
  document.getElementById("activeJob").innerText = machine.job;
  document.getElementById("jobProgress").innerText = `${Math.round(machine.jobProgress)}% complete`;

  const alertsList = document.getElementById("alertsList");
  alertsList.innerHTML = alerts.length ? "" : `<li class="good">No active alerts</li>`;
  alerts.forEach(alert => alertsList.innerHTML += `<li class="${alert.level === "red" ? "bad" : "warn"}">${alert.text}</li>`);
  document.getElementById("alertCount").innerText = `${alerts.length} Active`;

  const maintenanceList = document.getElementById("maintenanceList");
  maintenanceList.innerHTML = maint.length ? "" : `<li class="good">No maintenance due soon</li>`;
  maint.forEach(item => maintenanceList.innerHTML += `<li class="${item.level === "red" ? "bad" : "warn"}">${item.text}</li>`);

  const feed = document.getElementById("activityFeed");
  feed.innerHTML = "";
  activity.forEach(item => feed.innerHTML += `<li>${item}</li>`);
}

showProcedure("startup");
logActivity("Machine 1 online");
setInterval(render, 1000);
render();

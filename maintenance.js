const maintenance = {
  lastCompletedRuntime: 0,
  lastCompletedCycles: 0,
  runtimeInterval: 0.35,
  cycleInterval: 8
};

function evaluateMaintenance(machine) {
  const items = [];
  const runtimeSince = machine.runtimeHours - maintenance.lastCompletedRuntime;
  const cyclesSince = machine.cycleCount - maintenance.lastCompletedCycles;

  if (runtimeSince >= maintenance.runtimeInterval) {
    items.push({ level: "red", text: "Maintenance due — inspect lubrication, coolant, chips, and spindle area." });
  } else if (runtimeSince >= maintenance.runtimeInterval * 0.75) {
    items.push({ level: "yellow", text: "Maintenance interval approaching — prepare inspection." });
  }

  if (cyclesSince >= maintenance.cycleInterval) {
    items.push({ level: "red", text: "Cycle-count maintenance due — inspect tooling and fixture wear." });
  }

  if (machine.temperature > machine.baselines.temperatureMax) {
    items.push({ level: "yellow", text: "Temperature trend rising — inspect cooling system." });
  }

  if (machine.vibration > machine.baselines.vibrationMax) {
    items.push({ level: "yellow", text: "Vibration trend rising — check spindle wear or tool condition." });
  }

  return items;
}

function completeMaintenance() {
  maintenance.lastCompletedRuntime = machine.runtimeHours;
  maintenance.lastCompletedCycles = machine.cycleCount;
  logActivity("Maintenance marked complete");
}

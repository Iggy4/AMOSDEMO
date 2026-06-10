function evaluateAlerts(machine) {
  const alerts = [];

  if (machine.state === "alarm" || machine.fault) {
    alerts.push({ level: "red", text: "Machine alarm active — inspect machine before restart." });
  }

  if (machine.temperature > machine.baselines.temperatureMax + 8) {
    alerts.push({ level: "red", text: "Overheating — inspect coolant flow and cooling system." });
  }

  if (machine.vibration > machine.baselines.vibrationMax + 0.25) {
    alerts.push({ level: "red", text: "High vibration — possible tool wear, spindle issue, or fixture problem." });
  }

  if (machine.state === "running" && !machine.coolantOn) {
    alerts.push({ level: "yellow", text: "Coolant off while running — confirm coolant flow." });
  }

  if (machine.idleTime > 18) {
    alerts.push({ level: "yellow", text: "Excessive idle time between cycles." });
  }

  if (machine.cycleTime > machine.baselines.cycleTime * 1.25) {
    alerts.push({ level: "yellow", text: "Cycle time above baseline — review job setup or tool condition." });
  }

  if (machine.stopStarts >= 3) {
    alerts.push({ level: "yellow", text: "Repeated stop/start pattern detected." });
  }

  return alerts;
}

function calculateHealth(machine, alerts) {
  if (alerts.some(a => a.level === "red")) {
    return { color: "red", text: "RED", reason: "Critical alert active" };
  }

  if (alerts.some(a => a.level === "yellow") || machine.state === "idle") {
    return { color: "yellow", text: "YELLOW", reason: "Warning or idle condition" };
  }

  if (machine.state === "stopped") {
    return { color: "yellow", text: "YELLOW", reason: "Machine stopped" };
  }

  return { color: "green", text: "GREEN", reason: "Normal operation" };
}

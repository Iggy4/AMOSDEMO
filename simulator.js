const machine = {
  id: "MACHINE-1",
  state: "running",
  cycleTime: 0,
  idleTime: 0,
  startupTime: 8,
  runtimeHours: 0,
  cycleCount: 0,
  power: 1450,
  vibration: 0.55,
  temperature: 42,
  spindleRpm: 7800,
  feedRate: 65,
  coolantOn: true,
  job: "Bracket-A",
  jobProgress: 0,
  fault: false,
  lastState: "running",
  stopStarts: 0,
  baselines: {
    cycleTime: 42,
    startupTime: 9,
    vibrationMin: 0.25,
    vibrationMax: 1.1,
    temperatureMin: 34,
    temperatureMax: 62
  }
};

const jobQueue = ["Housing-B", "Fixture-Plate", "Test-Part"];
const activity = [];

function logActivity(message) {
  const time = new Date().toLocaleTimeString();
  activity.unshift(`${time} — ${message}`);
  if (activity.length > 16) activity.pop();
}

function setMode(mode) {
  if (machine.state !== mode) {
    if ((machine.state === "stopped" && mode === "running") || (machine.state === "running" && mode === "stopped")) {
      machine.stopStarts += 1;
    }
    machine.lastState = machine.state;
    machine.state = mode;
    logActivity(`Machine state changed to ${mode.toUpperCase()}`);
  }
}

function triggerFault() {
  machine.fault = true;
  machine.state = "alarm";
  machine.temperature = 76;
  machine.vibration = 1.55;
  logActivity("Manual fault triggered");
}

function completeJob() {
  machine.cycleCount += 1;
  machine.jobProgress = 0;
  machine.cycleTime = 0;
  machine.job = jobQueue.length ? jobQueue.shift() : "No Job Queued";
  logActivity(`Job completed. New active job: ${machine.job}`);
}

function clearFault() {
  machine.fault = false;
  machine.state = "idle";
  logActivity("Fault cleared");
}

function updateMachine() {
  const drift = machine.runtimeHours > 0.25 ? machine.runtimeHours * 0.04 : 0;

  if (machine.state === "running") {
    machine.cycleTime += 1;
    machine.idleTime = 0;
    machine.runtimeHours += 0.002;
    machine.jobProgress = Math.min(100, machine.jobProgress + 1.4);
    machine.power = randomRange(1200, 2600);
    machine.vibration = randomRange(0.3, 1.0) + drift;
    machine.temperature = randomRange(38, 61) + drift * 7;
    machine.spindleRpm = Math.round(randomRange(3000, 12000));
    machine.feedRate = randomRange(25, 125);
    machine.coolantOn = Math.random() > 0.08;

    if (machine.jobProgress >= 100) completeJob();
  }

  if (machine.state === "idle") {
    machine.idleTime += 1;
    machine.power = randomRange(60, 220);
    machine.vibration = randomRange(0.02, 0.18);
    machine.temperature = Math.max(28, machine.temperature - 0.4);
    machine.spindleRpm = 0;
    machine.feedRate = 0;
    machine.coolantOn = false;
  }

  if (machine.state === "stopped") {
    machine.power = randomRange(0, 40);
    machine.spindleRpm = 0;
    machine.feedRate = 0;
    machine.coolantOn = false;
  }

  if (machine.state === "alarm") {
    machine.power = randomRange(80, 300);
    machine.spindleRpm = 0;
    machine.feedRate = 0;
    machine.coolantOn = false;
  }

  if (Math.random() < 0.015 && machine.state === "running") {
    machine.state = "idle";
    logActivity("Simulator inserted idle gap between cycles");
  }

  if (Math.random() < 0.01 && machine.state === "idle") {
    machine.state = "running";
    logActivity("Machine resumed cycle");
  }
}

function randomRange(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

# Synapse V1 — CNC Machine Manager Demo

Synapse V1 is a static Git/demo-first CNC machine management interface. It simulates a Raspberry Pi-based shop-floor node for operational awareness, rule-based alerts, preventative maintenance, safety notices, procedures, and future 3D machine visualization.

## What this demo shows

- Machine 1 online status
- Green/yellow/red machine health
- Live simulated measurements
- Running / idle / stopped / alarm states
- Cycle time, idle time, startup time, runtime hours
- Cycle count, power, vibration, temperature
- Spindle RPM, feed rate, coolant status
- Job progress and job completion
- Rule-based alerts
- Maintenance warnings
- Safety notice modal
- Step-by-step procedures
- Activity feed
- 3D machine view placeholder

## How to run

Open `index.html` in a browser.

No Flask required.  
No Raspberry Pi required.  
No hardware required.

## Why static first?

This version proves the interface and workflow before connecting it to Raspberry Pi Flask APIs or real machine inputs.

## Future Raspberry Pi version

The simulator logic can be replaced with:

- GPIO inputs
- vibration sensor
- temperature sensor
- power/current sensor
- MTConnect
- machine controller integration

## One-line pitch

Synapse V1 is an interactive CNC machine manager demo that simulates live operational monitoring, rule-based inefficiency detection, preventative maintenance tracking, procedures, safety notices, and future 3D machine visualization for a Raspberry Pi-powered manufacturing node.

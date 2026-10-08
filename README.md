# Rectifier Lab

Interactive diode / thyristor rectifier simulator with schematics and waveforms.
1-phase and 3-phase, half-wave and full-wave, R-L-E load. Plain HTML + CSS + JS.

## Features
- 4 topologies: 1φ half-wave, 1φ bridge, 3φ half-wave (3-pulse), 3φ bridge (6-pulse); diode or thyristor
- Schematic highlights the conducting devices and the live current path
- Source, vo, io and device-conduction graphs on one shared time axis
- Zoom (wheel, buttons, pinch, +/- keys), pan (drag, arrows), double-click or 0 to reset, Auto-fit Y
- Load R, L and EMF E: R load, highly inductive, battery charger (E>0), inverter mode (E<0, α>90°)
- Metrics: Vdc, Vrms, Idc, Irms, form factor, ripple factor, Pdc, ripple frequency, CCM/DCM, textbook Vdc

## Run locally
Open `index.html` in a browser (or `python3 -m http.server`, then http://localhost:8000).


## Model assumptions
Ideal devices and source, 50 Hz, no source inductance or commutation overlap, no device drops.
Thyristors use a wide gate pulse (they fire when first forward-biased after α).
Simulation: 0.125° steps, 100 cycles, last cycle displayed.
Verified against textbook Vdc for R load, continuous conduction, battery charging and inverter operation.

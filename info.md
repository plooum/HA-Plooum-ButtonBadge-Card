# Ha Plooum Button Badge Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/default)
[![version](https://img.shields.io/badge/version-v1.0.0-blue.svg)](https://github.com/)

A custom Home Assistant button card that allows you to display a customizable button with an integrated floating badge, icon sizing, text padding, and flexible touch actions (tap, hold, navigate, script execution, or toggle).

## Features

* **Custom Button & Badge Integration**: Display a main button with an optional badge positioned in the top-right corner.
* **Dynamic Styling**: 
  * Customize text size (`font_size`) and left text offset/padding (`text_padding_left`).
  * Adjust icon sizes for both the main button (`icon_size`) and the badge (`badge_icon_size`).
  * Dynamic active/inactive state colors for both the main icon/text and the badge background.
* **Flexible Action Handling**: Configure independent actions for **Tap** and **Hold** events on both the main button and the badge:
  * Toggle entities (`toggle`)
  * Navigate to dashboards/views using Home Assistant's native navigation selector (`navigate`)
  * Execute scripts (`execute_script`)
  * No action (`none`)
* **Visual Editor**: Full support for the Home Assistant visual card editor (using built-in pickers and selectors).

![Preview](https://github.com/plooum/HA-Plooum-ButtonBadge-Card/blob/main/docs/preview.png)

For more information and full documentation, check out the [GitHub README](https://github.com/plooum/HA-Plooum-ButtonBadge-Card).
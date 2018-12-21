[![Build Status](https://travis-ci.org/mendixlabs/dropdown-type-ahead.svg?branch=master)](https://travis-ci.org/mendixlabs/dropdown-type-ahead)
[![Dependency Status](https://david-dm.org/mendixlabs/dropdown-type-ahead.svg)](https://david-dm.org/mendixlabs/dropdown-type-ahead)
[![Dev Dependency Status](https://david-dm.org/mendixlabs/dropdown-type-ahead.svg#info=devDependencies)](https://david-dm.org/mendixlabs/dropdown-type-ahead#info=devDependencies)
[![codecov](https://codecov.io/gh/mendixlabs/dropdown-type-ahead/branch/master/graph/badge.svg)](https://codecov.io/gh/mendixlabs/dropdown-type-ahead)
![badge](https://img.shields.io/badge/mendix-7.21.0-green.svg)

# Dropdown
An input widget used to display and edit associations for reference and reference sets

## Features
* Selection of multiple options
* Asynchronous loading of options
* Supports different data sources
    - Xpath
    - Microflow
    - Nanoflow
* Supports on change actions
    - call a microflow
    - call a nanoflow
* Supports `Tab` or `Enter` keys to auto complete suggested selection
* Supports `Back space` key to clear selection

## Dependencies
Mendix 7.13.1

## Demo project
[https://dropdowntypeahead.mxapps.io](https://dropdowntypeahead.mxapps.io)

## Usage
![dropdown-type-ahead](/assets/dropdown-typeahead-normal-loading.gif)

* Place the widget in data form within the context of an entity
* Select entity path and attribute over reference for selectable objects
* Select the data source

## Basic configuration
For a basic configuration, set up the widget as indicated below:-
### Data source
![dropdown-typeahead-data-source](/assets/dropdown-typeahead-data-source.png)
### Appearance
![dropdown-typeahead-appearance](/assets/dropdown-typeahead-appearance.png)
### Label
![dropdown-typeahead-label](/assets/dropdown-typeahead-label.png)
### Selectable objects
![dropdown-typeahead-selectable-objects](/assets/dropdown-typeahead-selectable.png)
### Events
![dropdown-typeahead-events](/assets/dropdown-typeahead-events.png)

## Issues, suggestions and feature requests
We are actively maintaining this widget, please report any issues or suggestion for improvement at
https://github.com/mendixlabs/dropdown-type-ahead/issues

## Development and contribution
Please follow [development guide](/development.md)

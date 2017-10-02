﻿/**
 * Block pour le capteur anémomètre intégrant un contact reed (avec un aimant sur sa partie mobile)
 */
'use strict';

goog.provide('Blockly.Arduino.anemometre');
goog.require('Blockly.Arduino');

Blockly.Arduino.vitesse_rotation = function() {
  Blockly.Arduino.includes_['anemo_lib'] = '#include <PinChangeInt.h>';
  Blockly.Arduino.definitions_['var_anemo'] = 'unsigned long dureeDebut;\n' +
	'int nombreTourMin = 0;\n' +
	'volatile unsigned int comptageILS = 0;\n' +
	'const unsigned long dureeAntiRebond = 1;';
  Blockly.Arduino.codeFunctions_['function_anemo'] = "void interruptILS() //comptage de l'ILS\n" +
	'  {\n' +
	'  static unsigned long dateDernierChangement = 0;\n' +
	'  unsigned long date = millis();\n' +
	'  if ((date - dateDernierChangement) > dureeAntiRebond) {\n' +
    '    comptageILS++;\n' +
    '    dateDernierChangement = date;\n' +
	'    }\n' +
	'  }';
  var PIN_ANEMO = Blockly.Arduino.valueToCode(this, 'PIN', Blockly.Arduino.ORDER_ATOMIC);
  Blockly.Arduino.setups_['setup_anemo'] = 'pinMode(' + PIN_ANEMO + ', INPUT);\n' +
	'  PCintPort::attachInterrupt(' + PIN_ANEMO + ', interruptILS, FALLING);\n' +
	'  dureeDebut = millis();';
 
  var code = 'if ((millis() - dureeDebut) > 1000) { // durée de 1 seconde\n' +
    '  nombreTourMin = comptageILS * 60; //comptage du nombre de tours par minute\n' +
    '  comptageILS = 0; // réinitialisation du comptage\n' +
    '  dureeDebut = millis();\n' +
	'}';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};
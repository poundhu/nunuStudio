"use strict";

/**
 * Gamepad provides basic support for gamepads.
 *
 * Some gamepads require a button press to being detected.
 * 
 * Gamepad implementation across browsers is still fragmented, every browser implements it a bit differently, so test it on every target before deploying an application using it.
 *
 * For more information about the Gamepad API state take look at the W3C Gamepad API page https://www.w3.org/TR/gamepad/.
 * 
 * @class Gamepad
 * @module Input
 * @constructor
 */
function Gamepad()
{
	this.vendor = -1;
	this.product = -1;
	this.connected = false;

	this.gamepad = null;
	this.buttons = [];

	var gamepads = navigator.getGamepads();
	for(var i = 0; i < gamepads.length; i++)
	{
		if(gamepads[i] !== null)
		{
			this.setGamepad(gamepads[i]);
			break;
		}
	}
	
	if(this.gamepad === null)
	{
		console.warn("nunuStudio: No gamepad found");
	}
}

/**
 * Set which gamepad should be used by this Gamepad instance.
 * 
 * @param {Object} Browser gamepad object.
 * @method setGamepad
 */
Gamepad.prototype.setGamepad = function(gamepad)
{	
	if(gamepad !== undefined && gamepad !== null)
	{
		//Store gamepad and its index
		this.index = gamepad.index;
		this.gamepad = gamepad;

		//Create and initialize buttons
		this.buttons = [];
		for(var i = 0; i < gamepad.buttons.length; i++)
		{
			this.buttons.push(new Key());
		}

		//Try to get the device vendor and product id
		this.setProductVendor(gamepad);
		this.connected = true;
	}
	else
	{
		console.warn("nunuStudio: No gamepad found");
		this.disconnect();
	}
};

/**
 * Disconnect this gamepad object.
 * 
 * @method disconnect
 */
Gamepad.prototype.disconnect = function()
{
	this.vendor = -1;
	this.product = -1;
	this.connected = false;

	this.gamepad = null;
	this.buttons = [];
};

/**
 * Set vendor and product id for this gamepad.
 *
 * @method setProductVendor
 * @param {Object} gamepad Gamepad object.
 */
Gamepad.prototype.setProductVendor = function(gamepad)
{
	//Chrome
	try
	{
		var temp = gamepad.id.split(":");

		this.vendor = temp[1].split(" ")[1];
		this.product = temp[2].replace(" ", "").replace(")", "");

		return;
	}
	catch(e){}

	//Firefox
	try
	{
		var temp = gamepad.id.split("-");

		this.vendor = temp[0];
		this.product = temp[1];

		return;
	}
	catch(e){}
};

/**
 * Update the gamepad state.
 *
 * Should be called every frame before checking the buttons values.
 * 
 * @method update
 */
Gamepad.prototype.update = function()
{
	this.gamepad = navigator.getGamepads()[this.index];

	if(this.gamepad !== undefined)
	{
		for(var i = 0; i < this.buttons.length; i++)
		{
			this.buttons[i].update(this.gamepad.buttons[i].pressed ? Key.DOWN : Key.UP);
		}
	}
};

/**
 * Get analog button value [0...1]
 *
 * @method getAnalogueButton
 * @param {Number} button Button to get analogue value from.
 * @return {Number} Value between 0 and 1 depending how hard the button is pressed.
 */
Gamepad.prototype.getAnalogueButton = function(button)
{
	return (button > this.buttons.length || button < 0) ? 0 : this.gamepad.buttons[button].value;
};

/**
 * Get axis value [-1...1]
 *
 * @method getAxis
 * @param {Number} Axis to get value from.
 * @return {Number} Value between -1 and 1 depending on the axis direction
 */
Gamepad.prototype.getAxis = function(axis)
{
	return (axis > this.gamepad.axes.length || axis < 0) ? 0 : this.gamepad.axes[button].value;
};

/**
 * Check if gamepad button is currently pressed.
 * 
 * @method buttonPressed
 * @param {Number} button Button to check status of
 * @return {boolean} True if button is currently pressed
 */
Gamepad.prototype.buttonPressed = function(button)
{
	return (button > this.buttons.length) ? false : this.buttons[button].pressed;
};

/**
 * Check if a gamepad button was just pressed.
 * 
 * @method buttonJustPressed
 * @param {Number} button Button to check status of
 * @return {boolean} True if button was just pressed
 */
Gamepad.prototype.buttonJustPressed = function(button)
{
	return (button > this.buttons.length || button < 0) ? false : this.buttons[button].justPressed;
};

/**
 * Check if a gamepad button was just released.
 * 
 * @method buttonJustReleased
 * @param {Number} button Button to check status of
 * @return {boolean} True if button was just released
 */
Gamepad.prototype.buttonJustReleased = function(button)
{
	return (button > this.buttons.length || button < 0) ? false : this.buttons[button].justReleased;
};

Gamepad.LEFT = 14;
Gamepad.RIGHT = 15;
Gamepad.DOWN = 13
Gamepad.UP = 12;

Gamepad.SELECT = 8;
Gamepad.START = 9;
Gamepad.HOME = 16;

Gamepad.LEFT_TRIGGER_A = 4;
Gamepad.LEFT_TRIGGER_B = 6;
Gamepad.RIGHT_TRIGGER_A = 5;
Gamepad.RIGHT_TRIGGER_B = 7;

Gamepad.A = 0;
Gamepad.B = 1;
Gamepad.C = 2;
Gamepad.D = 3;

Gamepad.LEFT_ANALOGUE_HOR = 0;
Gamepad.LEFT_ANALOGUE_VERT = 1;
Gamepad.RIGHT_ANALOGUE_HOR = 2;
Gamepad.RIGHT_ANALOGUE_VERT = 3;
var pwmController = require('../util/pwm');
var poweredLift = require('../util/poweredLiftMapping');
var utils = require('../util/shared');
var EventEmitter = require('events');
var util = require('util')

function Copter(options){
  this.motorMap = options.motorMap;
  this.minThrottle = options.minThrottle;
  this.midThrottle = options.midThrottle;
  this.maxThrottle = options.maxThrottle;
  this.motorMap = options.motorMap;
  this.pwmControl = new pwmController();
  return this;
};

util.inherits(Copter, EventEmitter);

Copter.prototype.translateInputs = function(inputs, callback){
  // 
  // Probably will relocate to mode handlers
  // 
  try{
    // throttle gets scaled to min/max PWM from %
    inputs.throttle = utils.scalePercentageToValue(inputs.throttle, this.minThrottle, this.maxThrottle);
    callback(null, inputs);
  } catch (e){
    this.emit('error', e);
    callback(e);
  }
}

Copter.prototype.handleControlInputs = function(inputs){
  try{
    for (var pwmChannel in this.motorMap){
      var throttleForMotor = poweredLift.getMotorThrottle(inputs, this.motorMap[pwmChannel]);
      // console.log(this.pwmControl);
      // console.log(pwmChannel, throttleForMotor, inputs.throttle);
      this.pwmControl.setChanneluS(pwmChannel, throttleForMotor);
    }
    this.emit('controlInputUpdated', inputs);
  } catch (e){
    this.emit('error', e);
  }
}

Copter.prototype.updateControlInput = function(rawInputs){
  this.translateInputs(rawInputs, function(err, data){
    if (err){
      this.emit('error', e);
    } else {
      this.handleControlInputs(data)
    }
  }.bind(this));
}

Copter.prototype.calibrationRoutine = function(mode){
  var value;
  if (mode == 'high'){
    value = this.maxThrottle;
  } else if (mode == 'mid'){
    value = this.midThrottle;
  } else if (mode == 'low'){
    value = this.minThrottle;
  }
  for (var pwmChannel in this.motorMap){
    this.pwmControl.setChanneluS(pwmChannel, value);
  }
}

module.exports = Copter
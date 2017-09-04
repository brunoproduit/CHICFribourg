#ifndef MOTOR_CONTROL_H
#define MOTOR_CONTROL_H

#include <stdint.h>
#include "ble.h"

void pwm_ready_callback(uint32_t pwm_id);

void motor_pwm_init(void);

void motor_open(void);

void motor_close(void);

void motor_control(void);

#endif // MOTOR_CONTROL_H

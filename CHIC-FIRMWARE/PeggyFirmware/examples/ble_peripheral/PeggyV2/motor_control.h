#ifndef MOTOR_CONTROL_H
#define MOTOR_CONTROL_H

#include <stdint.h>
#include "ble.h"

void motor_timeout_handler(void* p_context);

void motor_timer_init(void);

void motor_open(void);

void motor_close(void);

#endif // MOTOR_CONTROL_H

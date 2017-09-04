#include <stdint.h>
#include "app_trace.h" 
#include "app_timer.h"
#include "motor_control.h"
#include "boards.h"


#define APP_TIMER_PRESCALER       	0
#define MOTOR_INTERVAL      				APP_TIMER_TICKS(500, APP_TIMER_PRESCALER)  // delay for motor to turn ~30°

APP_TIMER_DEF(m_motor_timer_id);


void motor_timeout_handler(void* p_context)
{
	NRF_GPIO->OUTCLR = (BSP_LED_7_MASK | BSP_LED_8_MASK | BSP_LED_9_MASK);
}

void motor_timer_init(void)
{
	uint32_t                err_code;
	err_code = app_timer_create(&m_motor_timer_id,
                              APP_TIMER_MODE_SINGLE_SHOT,
															motor_timeout_handler);
	APP_ERROR_CHECK(err_code);
}

void motor_open()
{
		NRF_GPIO->OUTCLR = BSP_LED_7_MASK;
		NRF_GPIO->OUTSET = (BSP_LED_8_MASK | BSP_LED_9_MASK);
	
		uint32_t err_code;
    err_code = app_timer_start(m_motor_timer_id, MOTOR_INTERVAL, NULL);
    APP_ERROR_CHECK(err_code);
}

void motor_close()
{
		NRF_GPIO->OUTCLR = BSP_LED_8_MASK;
		NRF_GPIO->OUTSET = (BSP_LED_7_MASK | BSP_LED_9_MASK);
	
		uint32_t err_code;
    err_code = app_timer_start(m_motor_timer_id, MOTOR_INTERVAL, NULL);
    APP_ERROR_CHECK(err_code);
}
